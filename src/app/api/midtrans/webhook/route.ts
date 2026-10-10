import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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
    include: { product: true },
  });
  if (!order) return NextResponse.json({ ok: true });

  if (Number(b.gross_amount) !== order.product.price) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const t = b.transaction_status;
  let next: "PAID" | "CANCEL" | null = null;
  if ((t === "capture" && b.fraud_status === "accept") || t === "settlement") next = "PAID";
  else if (t === "deny" || t === "cancel" || t === "expire") next = "CANCEL";

  // uang masuk adalah kebenaran: PENDING atau CANCEL (terlanjur kedaluwarsa) menjadi PAID
  if (next === "PAID" && (order.status === "PENDING" || order.status === "CANCEL")) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "PAID", payment: b.payment_type ?? null, paidAt: new Date() },
    });
  } else if (next === "CANCEL" && order.status === "PENDING") {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "CANCEL", payment: b.payment_type ?? null },
    });
  }
  return NextResponse.json({ ok: true });
}
