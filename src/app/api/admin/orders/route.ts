import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      status: true,
      contact: true,
      payment: true,
      createdAt: true,
      paidAt: true,
      deliveryNote: true,
      product: { select: { name: true, price: true } },
      user: { select: { email: true, name: true } },
      testimonial: { select: { id: true } },
    },
  });
  return NextResponse.json(orders);
}
