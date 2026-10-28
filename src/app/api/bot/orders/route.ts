import { Prisma } from "@prisma/client";
import { botUnauthorized, isBotRequest } from "@/lib/bot-auth";
import { expireStalePending, fail, isSource, json, orderSelect, serializeOrder } from "@/lib/bot-order";
import { prisma } from "@/lib/prisma";
import { cleanPhone } from "@/lib/contact";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!isBotRequest(req)) return botUnauthorized();

  const b = await req.json().catch(() => null);
  const productId = typeof b?.productId === "string" ? b.productId.trim() : "";
  const source = b?.source;
  const buyer = b?.buyer;
  const buyerId = typeof buyer?.id === "string" ? buyer.id.trim() : "";
  const nameRaw = buyer?.name;
  const phoneRaw = buyer?.phone;

  if (!productId || productId.length > 100) return fail(400, "VALIDATION", "productId tidak valid.");
  if (!isSource(source)) return fail(400, "VALIDATION", "source harus whatsapp atau telegram.");
  if (buyer?.platform !== source) return fail(400, "VALIDATION", "buyer.platform harus sama dengan source.");
  if (buyerId.length < 3 || buyerId.length > 128) return fail(400, "VALIDATION", "buyer.id harus 3-128 karakter.");
  if (nameRaw != null && (typeof nameRaw !== "string" || nameRaw.trim().length > 60)) {
    return fail(400, "VALIDATION", "buyer.name maksimal 60 karakter.");
  }
  const buyerName = typeof nameRaw === "string" && nameRaw.trim() ? nameRaw.trim() : null;
  const phone = cleanPhone(phoneRaw);
  const key = req.headers.get("idempotency-key")?.trim() || null;
  if (key && key.length > 128) return fail(400, "VALIDATION", "Idempotency-Key maksimal 128 karakter.");

  // Idempotency-Key yang sama: kembalikan pesanan yang sama
  if (key) {
    const prev = await prisma.order.findUnique({
      where: { idempotencyKey: key },
      select: { ...orderSelect, source: true, buyerRef: true },
    });
    if (prev) {
      if (prev.source !== source || prev.buyerRef !== buyerId) {
        return fail(409, "IDEMPOTENCY_CONFLICT", "Idempotency-Key sudah dipakai untuk pembeli lain.");
      }
      if (prev.status === "PENDING" && !prev.paymentUrl) {
        return fail(409, "IN_PROGRESS", "Pesanan sedang diproses. Coba lagi sebentar lagi.");
      }
      return json({ order: serializeOrder(prev) }, 200);
    }
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.active) return fail(404, "NOT_FOUND", "Produk tidak ditemukan.");
  if (product.price === null) return fail(422, "PRICE_CUSTOM", "Produk ini harganya khusus, hubungi admin.");
  if (product.stock < 1) return fail(409, "SOLD_OUT", "Stok produk habis.");

  // pembatasan: maksimal 3 pesanan PENDING per pembeli, 60 pesanan bot per 10 menit
  await expireStalePending();
  const since = new Date(Date.now() - 10 * 60 * 1000);
  const [pending, burst] = await Promise.all([
    prisma.order.count({ where: { source, buyerRef: buyerId, status: "PENDING" } }),
    prisma.order.count({ where: { source: { not: "web" }, createdAt: { gt: since } } }),
  ]);
  if (pending >= 3 || burst >= 60) {
    return fail(429, "LIMIT", "Terlalu banyak pesanan. Selesaikan pembayaran yang tertunda atau coba lagi nanti.", {
      "Retry-After": "600",
    });
  }

  let order: { id: string };
  try {
    order = await prisma.order.create({
      data: {
        productId: product.id,
        contact: phone ?? buyerId,
        source,
        buyerRef: buyerId,
        buyerName,
        buyerPhone: phone,
        idempotencyKey: key,
        amount: product.price,
        status: "PENDING",
      },
      select: { id: true },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002" && key) {
      return fail(409, "IN_PROGRESS", "Pesanan dengan kunci ini sedang diproses. Coba lagi sebentar lagi.");
    }
    throw e;
  }

  const base =
    process.env.MIDTRANS_IS_PRODUCTION === "true"
      ? "https://app.midtrans.com"
      : "https://app.sandbox.midtrans.com";
  const site = (process.env.NEXTAUTH_URL ?? "").replace(/\/$/, "");

  let redirectUrl: string | null = null;
  try {
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
        customer_details: { first_name: buyerName ?? "Pelanggan", ...(phone ? { phone } : {}) },
        ...(site ? { callbacks: { finish: `${site}/?bayar=selesai` } } : {}),
      }),
      signal: AbortSignal.timeout(8000),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && typeof data.redirect_url === "string") redirectUrl = data.redirect_url;
  } catch {
    // jatuh ke penanganan gagal di bawah (tanpa mencetak detail)
  }

  if (!redirectUrl) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "CANCEL", closedReason: "error", idempotencyKey: null },
    });
    return fail(502, "PAYMENT_ERROR", "Gagal membuat pembayaran. Coba lagi.");
  }

  const saved = await prisma.order.update({
    where: { id: order.id },
    data: { paymentUrl: redirectUrl },
    select: orderSelect,
  });
  return json({ order: serializeOrder(saved) }, 201);
}

export async function GET(req: Request) {
  if (!isBotRequest(req)) return botUnauthorized();

  const sp = new URL(req.url).searchParams;
  const platform = sp.get("platform");
  const buyerId = (sp.get("buyerId") ?? "").trim();
  if (!isSource(platform) || buyerId.length < 3 || buyerId.length > 128) {
    return fail(400, "VALIDATION", "platform dan buyerId wajib diisi.");
  }
  const n = Number(sp.get("limit") ?? 5);
  const limit = Number.isFinite(n) ? Math.min(10, Math.max(1, Math.floor(n))) : 5;

  await expireStalePending();
  const rows = await prisma.order.findMany({
    where: { source: platform, buyerRef: buyerId },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: orderSelect,
  });
  return json({ orders: rows.map(serializeOrder) });
}
