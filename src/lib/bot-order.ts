import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const isSource = (v: unknown): v is "whatsapp" | "telegram" =>
  v === "whatsapp" || v === "telegram";

const HOUR = 60 * 60 * 1000;
export const STALE_AFTER = 25 * HOUR; // pesanan PENDING yang lewat ini ditutup
export const PAYMENT_WINDOW = 24 * HOUR; // masa bayar Snap bawaan Midtrans

const NO_STORE = { "Cache-Control": "no-store" };

export const json = (body: unknown, status = 200, headers?: Record<string, string>) =>
  NextResponse.json(body, { status, headers: { ...NO_STORE, ...headers } });

export const fail = (status: number, code: string, error: string, headers?: Record<string, string>) =>
  json({ error, code }, status, headers);

export const orderSelect = Prisma.validator<Prisma.OrderSelect>()({
  id: true,
  status: true,
  closedReason: true,
  createdAt: true,
  amount: true,
  paidAt: true,
  fulfilledAt: true,
  paymentUrl: true,
  product: { select: { name: true, price: true } },
});
export type BotOrderRow = Prisma.OrderGetPayload<{ select: typeof orderSelect }>;

export type BotStatus = "PENDING" | "PAID" | "FULFILLED" | "EXPIRED" | "CANCELED";

// pemetaan status internal (PENDING/PAID/DONE/CANCEL) ke status untuk bot
export function botStatus(o: Pick<BotOrderRow, "status" | "closedReason">): BotStatus {
  if (o.status === "DONE") return "FULFILLED";
  if (o.status === "PAID") return "PAID";
  if (o.status === "CANCEL") {
    return o.closedReason === "expire" || o.closedReason === "timeout" ? "EXPIRED" : "CANCELED";
  }
  return "PENDING";
}

export function serializeOrder(o: BotOrderRow) {
  const status = botStatus(o);
  return {
    id: o.id,
    status,
    amount: o.amount ?? o.product.price,
    productName: o.product.name,
    paymentUrl: status === "PENDING" ? o.paymentUrl : null,
    expiresAt: new Date(o.createdAt.getTime() + PAYMENT_WINDOW).toISOString(),
    paidAt: o.paidAt,
    fulfilledAt: o.fulfilledAt,
    createdAt: o.createdAt,
  };
}

// menutup pesanan PENDING yang kedaluwarsa; pesanan bot menghasilkan event EXPIRED
export async function expireStalePending() {
  const stale = await prisma.order.findMany({
    where: { status: "PENDING", createdAt: { lt: new Date(Date.now() - STALE_AFTER) } },
    select: { id: true },
    take: 200,
  });
  if (stale.length === 0) return;
  const ids = stale.map((s) => s.id);

  await prisma.order.updateMany({
    where: { id: { in: ids }, status: "PENDING" },
    data: { status: "CANCEL", closedReason: "timeout" },
  });

  const closed = await prisma.order.findMany({
    where: { id: { in: ids }, status: "CANCEL", closedReason: "timeout", source: { not: "web" } },
    select: { id: true },
  });
  if (closed.length > 0) {
    await prisma.botEvent.createMany({
      data: closed.map((c) => ({ orderId: c.id, type: "EXPIRED" as const })),
      skipDuplicates: true,
    });
  }
}
