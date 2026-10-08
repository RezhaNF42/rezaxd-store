import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }
  const items = await prisma.product.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      category: true,
      price: true,
      stock: true,
      badge: true,
      active: true,
      sortOrder: true,
    },
  });
  return NextResponse.json(items);
}
