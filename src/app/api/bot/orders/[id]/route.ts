import { NextResponse } from "next/server";
import { isBotRequest } from "@/lib/bot-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  if (!isBotRequest(req)) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  // pesanan menunggu bayar yang sudah lewat masa bayar menjadi CANCEL
  await prisma.order.updateMany({
    where: { status: "PENDING", createdAt: { lt: new Date(Date.now() - 25 * 60 * 60 * 1000) } },
    data: { status: "CANCEL" },
  });

  const o = await prisma.order.findFirst({
    where: { id: params.id, source: { not: "web" } },
    select: {
      id: true,
      status: true,
      source: true,
      paidAt: true,
      createdAt: true,
      deliveryNote: true,
      product: { select: { name: true, price: true } },
    },
  });
  if (!o) return NextResponse.json({ error: "Pesanan tidak ditemukan." }, { status: 404 });

  return NextResponse.json({
    id: o.id,
    status: o.status,
    platform: o.source,
    productName: o.product.name,
    amount: o.product.price,
    paidAt: o.paidAt,
    createdAt: o.createdAt,
    deliveryNote: o.status === "DONE" ? o.deliveryNote : null,
  });
}
