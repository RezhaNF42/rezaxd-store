import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await prisma.product.findMany({
    where: { active: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      category: true,
      price: true,
      stock: true,
      badge: true,
      description: true,
      features: true,
    },
  });
  const items = rows.map(({ category, ...p }) => ({ ...p, tab: category }));
  return NextResponse.json(items, {
    headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" },
  });
}
