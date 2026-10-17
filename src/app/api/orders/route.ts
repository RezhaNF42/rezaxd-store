import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const HOUR = 60 * 60 * 1000;
const STALE_AFTER = 25 * HOUR; // token Snap kedaluwarsa 24 jam
const REUSE_WITHIN = 23 * HOUR; // pakai ulang bila sisa waktu bayar masih cukup

async function currentUser() {
  const session = await getServerSession(authOptions);
  const id = (session?.user as { id?: string } | undefined)?.id;
  if (!session?.user?.email || !id) return null;
  return { id, email: session.user.email, name: session.user.name ?? "Pembeli" };
}

export async function GET() {
  const u = await currentUser();
  if (!u) return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });

  // pesanan PENDING yang sudah lewat masa bayar otomatis menjadi CANCEL
  await prisma.order.updateMany({
    where: { status: "PENDING", createdAt: { lt: new Date(Date.now() - STALE_AFTER) } },
    data: { status: "CANCEL" },
  });

  const rows = await prisma.order.findMany({
    where: { userId: u.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      createdAt: true,
      paidAt: true,
      contact: true,
      paymentUrl: true,
      deliveryNote: true,
      product: { select: { name: true, price: true } },
      testimonial: { select: { id: true } },
    },
  });

  return NextResponse.json(
    rows.map(({ paymentUrl, deliveryNote, ...o }) => ({
      ...o,
      paymentUrl: o.status === "PENDING" ? paymentUrl : null,
      deliveryNote: o.status === "DONE" ? deliveryNote : null,
    }))
  );
}

export async function POST(req: Request) {
  const u = await currentUser();
  if (!u) return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const productId = typeof body?.productId === "string" ? body.productId : "";
  const contact = typeof body?.contact === "string" ? body.contact.trim() : "";
  if (!productId || contact.length < 3 || contact.length > 100) {
    return NextResponse.json({ error: "Data pesanan tidak valid." }, { status: 400 });
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.active || product.price === null || product.stock < 1) {
    return NextResponse.json({ error: "Produk ini tidak bisa dibeli online." }, { status: 404 });
  }

  // pesanan PENDING untuk produk yang sama: pakai ulang, jangan buat baru
  const existing = await prisma.order.findFirst({
    where: {
      userId: u.id,
      productId: product.id,
      status: "PENDING",
      paymentUrl: { not: null },
      createdAt: { gt: new Date(Date.now() - REUSE_WITHIN) },
    },
    orderBy: { createdAt: "desc" },
  });
  if (existing?.paymentUrl) {
    if (existing.contact !== contact) {
      await prisma.order.update({ where: { id: existing.id }, data: { contact } });
    }
    return NextResponse.json({ orderId: existing.id, redirectUrl: existing.paymentUrl });
  }

  // pembatasan laju per pengguna (dihitung dari database)
  const [recent, pending] = await Promise.all([
    prisma.order.count({ where: { userId: u.id, createdAt: { gt: new Date(Date.now() - 10 * 60 * 1000) } } }),
    prisma.order.count({ where: { userId: u.id, status: "PENDING" } }),
  ]);
  if (recent >= 5 || pending >= 10) {
    return NextResponse.json(
      { error: "Terlalu banyak pesanan dalam waktu singkat. Coba lagi beberapa menit lagi." },
      { status: 429, headers: { "Retry-After": "600" } }
    );
  }

  const order = await prisma.order.create({
    data: { productId: product.id, userId: u.id, contact, status: "PENDING" },
  });

  const base =
    process.env.MIDTRANS_IS_PRODUCTION === "true"
      ? "https://app.midtrans.com"
      : "https://app.sandbox.midtrans.com";
  const site = (process.env.NEXTAUTH_URL ?? "").replace(/\/$/, "");

  const res = await fetch(`${base}/snap/v1/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Basic " + Buffer.from(`${process.env.MIDTRANS_SERVER_KEY}:`).toString("base64"),
    },
    body: JSON.stringify({
      transaction_details: { order_id: order.id, gross_amount: product.price },
      item_details: [{ id: product.id, price: product.price, quantity: 1, name: product.name.slice(0, 50) }],
      customer_details: { email: u.email, first_name: u.name },
      ...(site ? { callbacks: { finish: `${site}/pesanan` } } : {}),
    }),
  });
  const data = await res.json().catch(() => ({}));

  if (!res.ok || !data.redirect_url) {
    await prisma.order.update({ where: { id: order.id }, data: { status: "CANCEL" } });
    return NextResponse.json({ error: "Gagal membuat pembayaran. Coba lagi." }, { status: 502 });
  }

  await prisma.order.update({ where: { id: order.id }, data: { paymentUrl: data.redirect_url } });
  return NextResponse.json({ orderId: order.id, redirectUrl: data.redirect_url });
}
