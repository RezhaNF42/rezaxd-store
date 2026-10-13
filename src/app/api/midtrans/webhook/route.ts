import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyAdmin } from "@/lib/notify";

export const dynamic = "force-dynamic";

const rupiah = (n: number | null) =>
  n === null ? "-" : new Intl.NumberFormat("id-ID").format(n);

export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  if (!b) return NextResponse.json({ ok: false }, { status: 400 });

  const key = process.env.MIDTRANS_SERVER_KEY ?? "";
  const expected = crypto
    .createHash("sha512")
    .update(`${b.order_id}${b.status_code}${b.gross_amount}${key}`)
    .digest("hex");
  const got = Buffer.from(String(b.signature_key ?? ""));
  const want = Buffer.from(expected);
  if (got.length !== want.length || !crypto.timingSafeEqual(got, want)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const order = await prisma.order.findUnique({
    where: { id: String(b.order_id) },
    include: { product: true, user: true },
  });
  if (!order) return NextResponse.json({ ok: true });

  if (Number(b.gross_amount) !== order.product.price) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const t = b.transaction_status;
  let next: "PAID" | "CANCEL" | null = null;
  if ((t === "capture" && b.fraud_status === "accept") || t === "settlement") next = "PAID";
  else if (t === "deny" || t === "cancel" || t === "expire") next = "CANCEL";

  if (next === "PAID") {
    // atomik: hanya satu notifikasi yang berhasil mengubah status, sehingga email tidak ganda
    const r = await prisma.order.updateMany({
      where: { id: order.id, status: { in: ["PENDING", "CANCEL"] } },
      data: { status: "PAID", payment: b.payment_type ?? null, paidAt: new Date() },
    });
    if (r.count === 1) {
      const site = (process.env.NEXTAUTH_URL ?? "").replace(/\/$/, "");
      await notifyAdmin(
        `Pesanan dibayar: ${order.product.name} (Rp ${rupiah(order.product.price)})`,
        [
          "Ada pesanan yang sudah dibayar dan menunggu penyerahan layanan.",
          "",
          `Produk    : ${order.product.name}`,
          `Nominal   : Rp ${rupiah(order.product.price)}`,
          `Metode    : ${b.payment_type ?? "-"}`,
          `Pembeli   : ${order.user?.name ?? "-"} (${order.user?.email ?? "-"})`,
          `Kontak    : ${order.contact}`,
          `ID pesanan: ${order.id}`,
          "",
          `Buka panel admin: ${site}/admin`,
        ].join("\n")
      );
    }
  } else if (next === "CANCEL") {
    await prisma.order.updateMany({
      where: { id: order.id, status: "PENDING" },
      data: { status: "CANCEL", payment: b.payment_type ?? null },
    });
  }
  return NextResponse.json({ ok: true });
}
