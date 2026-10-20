import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Bucket = { orders: number; revenue: number };
const KEYS = { web: "WEB", whatsapp: "WHATSAPP", telegram: "TELEGRAM" } as const;

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Akses ditolak.", code: "FORBIDDEN" }, { status: 403 });
  }

  const rows = await prisma.order.groupBy({
    by: ["source"],
    where: { status: { in: ["PAID", "DONE"] } },
    _count: { _all: true },
    _sum: { amount: true },
  });

  const bySource: Record<"WEB" | "WHATSAPP" | "TELEGRAM", Bucket> = {
    WEB: { orders: 0, revenue: 0 },
    WHATSAPP: { orders: 0, revenue: 0 },
    TELEGRAM: { orders: 0, revenue: 0 },
  };
  const total: Bucket = { orders: 0, revenue: 0 };

  for (const r of rows) {
    const key = KEYS[r.source as keyof typeof KEYS];
    if (!key) continue;
    const revenue = r._sum.amount ?? 0;
    bySource[key] = { orders: r._count._all, revenue };
    total.orders += r._count._all;
    total.revenue += revenue;
  }

  return NextResponse.json({ bySource, total }, { headers: { "Cache-Control": "no-store" } });
}
