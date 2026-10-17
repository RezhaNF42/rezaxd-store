import { botUnauthorized, isBotRequest } from "@/lib/bot-auth";
import { expireStalePending, json } from "@/lib/bot-order";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isBotRequest(req)) return botUnauthorized();

  await expireStalePending();

  const n = Number(new URL(req.url).searchParams.get("limit") ?? 20);
  const limit = Number.isFinite(n) ? Math.min(50, Math.max(1, Math.floor(n))) : 20;

  const rows = await prisma.botEvent.findMany({
    where: { deliveredAt: null, order: { source: { not: "web" } } },
    orderBy: { createdAt: "asc" },
    take: limit,
    select: {
      id: true,
      type: true,
      order: {
        select: {
          id: true,
          source: true,
          buyerRef: true,
          buyerName: true,
          payment: true,
          deliveryNote: true,
          product: { select: { name: true, price: true } },
        },
      },
    },
  });

  return json({
    events: rows.map((e) => ({
      id: e.id,
      type: e.type,
      order: {
        id: e.order.id,
        productName: e.order.product.name,
        amount: e.order.product.price,
        paymentMethod: e.order.payment,
        ...(e.type === "FULFILLED" ? { note: e.order.deliveryNote } : {}),
      },
      buyer: { platform: e.order.source, id: e.order.buyerRef, name: e.order.buyerName },
    })),
  });
}
