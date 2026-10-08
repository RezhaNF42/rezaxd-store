import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function currentUser() {
  const session = await getServerSession(authOptions);
  const id = (session?.user as { id?: string } | undefined)?.id;
  if (!session?.user?.email || !id) return null;
  return { id, email: session.user.email, name: session.user.name ?? "Pembeli" };
}

export async function GET() {
  const u = await currentUser();
  if (!u) return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });
  const orders = await prisma.order.findMany({
    where: { userId: u.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      createdAt: true,
      product: { select: { name: true, price: true } },
      testimonial: { select: { id: true } },
    },
  });
  return NextResponse.json(orders);
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
  if (!product || product.price === null || product.stock < 1) {
    return NextResponse.json({ error: "Produk ini tidak bisa dibeli online." }, { status: 404 });
  }

  const order = await prisma.order.create({
    data: { productId: product.id, userId: u.id, contact, status: "PENDING" },
  });

  const base =
    process.env.MIDTRANS_IS_PRODUCTION === "true"
      ? "https://app.midtrans.com"
      : "https://app.sandbox.midtrans.com";

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
    }),
  });
  const data = await res.json().catch(() => ({}));

  if (!res.ok || !data.redirect_url) {
    await prisma.order.update({ where: { id: order.id }, data: { status: "CANCEL" } });
    return NextResponse.json({ error: "Gagal membuat pembayaran. Coba lagi." }, { status: 502 });
  }
  return NextResponse.json({ orderId: order.id, redirectUrl: data.redirect_url });
}
