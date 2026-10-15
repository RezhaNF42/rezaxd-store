import { NextResponse } from "next/server";
import { isBotRequest } from "@/lib/bot-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const REUSE_WITHIN = 23 * 60 * 60 * 1000;

const err = (error: string, status: number, headers?: Record<string, string>) =>
  NextResponse.json({ error }, { status, headers });

export async function POST(req: Request) {
  if (!isBotRequest(req)) return err("Tidak diizinkan.", 401);

  const b = await req.json().catch(() => null);
  const productId = typeof b?.productId === "string" ? b.productId : "";
  const platform = b?.platform;
  const contact = typeof b?.contact === "string" ? b.contact.trim() : "";
  const externalId = typeof b?.externalId === "string" ? b.externalId.trim().slice(0, 100) : "";
  const buyerName =
    (typeof b?.buyerName === "string" ? b.buyerName.trim() : "").slice(0, 50) || "Pelanggan";

  if (
    !productId ||
    (platform !== "whatsapp" && platform !== "telegram") ||
    contact.length < 3 ||
    contact.length > 100
  ) {
    return err("Data pesanan tidak valid.", 400);
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.active || product.price === null || product.stock < 1) {
    return err("Produk ini tidak bisa dibeli.", 404);
  }

  const who = externalId ? { buyerRef: externalId } : { contact };

  // pesanan menunggu bayar yang sama: pakai ulang, jangan buat baru
  const existing = await prisma.order.findFirst({
    where: {
      source: platform,
      productId: product.id,
      status: "PENDING",
      paymentUrl: { not: null },
      createdAt: { gt: new Date(Date.now() - REUSE_WITHIN) },
      ...who,
    },
    orderBy: { createdAt: "desc" },
  });
  if (existing?.paymentUrl) {
    return NextResponse.json({
      orderId: existing.id,
      paymentUrl: existing.paymentUrl,
      productName: product.name,
      amount: product.price,
      status: "PENDING",
      reused: true,
    });
  }

  // pembatasan laju: per pembeli dan keseluruhan bot
  const since = new Date(Date.now() - 10 * 60 * 1000);
  const [mine, all] = await Promise.all([
    prisma.order.count({ where: { source: platform, createdAt: { gt: since }, ...who } }),
    prisma.order.count({ where: { source: { not: "web" }, createdAt: { gt: since } } }),
  ]);
  if (mine >= 5 || all >= 60) {
    return err("Terlalu banyak pesanan dalam waktu singkat. Coba lagi beberapa menit lagi.", 429, {
      "Retry-After": "600",
    });
  }

  const order = await prisma.order.create({
    data: {
      productId: product.id,
      contact,
      source: platform,
      buyerRef: externalId || null,
      status: "PENDING",
    },
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
      item_details: [
        { id: product.id, price: product.price, quantity: 1, name: product.name.slice(0, 50) },
      ],
      customer_details: { first_name: buyerName },
      ...(site ? { callbacks: { finish: `${site}/?bayar=selesai` } } : {}),
    }),
  });
  const data = await res.json().catch(() => ({}));

  if (!res.ok || !data.redirect_url) {
    await prisma.order.update({ where: { id: order.id }, data: { status: "CANCEL" } });
    return err("Gagal membuat pembayaran. Coba lagi.", 502);
  }

  await prisma.order.update({ where: { id: order.id }, data: { paymentUrl: data.redirect_url } });
  return NextResponse.json({
    orderId: order.id,
    paymentUrl: data.redirect_url,
    productName: product.name,
    amount: product.price,
    status: "PENDING",
    reused: false,
  });
}
