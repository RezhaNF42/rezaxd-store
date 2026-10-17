import { prisma } from "@/lib/prisma";

const orderSelect = {
  id: true,
  status: true,
  source: true,
  buyerRef: true,
  paidAt: true,
  fulfilledAt: true,
  deliveryNote: true,
  product: { select: { name: true, price: true } },
} as const;

// serah-terima: PAID -> DONE (di sisi bot: FULFILLED), idempoten dan atomik
export async function fulfillOrder(id: string, note?: string | null) {
  const order = await prisma.order.findUnique({
    where: { id },
    select: { id: true, status: true, source: true, fulfilledAt: true },
  });
  if (!order) {
    return { ok: false as const, status: 404, code: "NOT_FOUND", error: "Pesanan tidak ditemukan." };
  }
  if (order.status !== "PAID" || order.fulfilledAt) {
    return {
      ok: false as const,
      status: 409,
      code: "INVALID_STATE",
      error: "Hanya pesanan berstatus PAID yang belum diserahkan yang bisa diselesaikan.",
    };
  }

  const r = await prisma.order.updateMany({
    where: { id, status: "PAID", fulfilledAt: null },
    data: {
      status: "DONE",
      fulfilledAt: new Date(),
      ...(note !== undefined ? { deliveryNote: note } : {}),
    },
  });
  if (r.count !== 1) {
    return { ok: false as const, status: 409, code: "INVALID_STATE", error: "Pesanan sudah diproses." };
  }

  // pesanan bot: pembeli dikabari lewat antrean; pesanan website tidak menghasilkan event
  if (order.source !== "web") {
    await prisma.botEvent.createMany({
      data: [{ orderId: id, type: "FULFILLED" }],
      skipDuplicates: true,
    });
  }

  const updated = await prisma.order.findUnique({ where: { id }, select: orderSelect });
  return { ok: true as const, order: updated };
}
