import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const H = 60 * 60 * 1000;
const toInt = (v?: string) => {
  const n = Number(v);
  return Number.isInteger(n) && n >= 0 ? n : 0;
};

export async function GET() {
  const [done, webBuyers, botBuyers, bySourceRows, settings, first] = await Promise.all([
    prisma.order.count({ where: { status: "DONE" } }),
    prisma.order.groupBy({
      by: ["userId"],
      where: { status: "DONE", userId: { not: null } },
    }),
    prisma.order.groupBy({
      by: ["source", "buyerRef"],
      where: { status: "DONE", userId: null, buyerRef: { not: null } },
    }),
    prisma.order.groupBy({
      by: ["source"],
      where: { status: "DONE" },
      _count: { _all: true },
    }),
    prisma.setting.findMany({
      where: { key: { in: ["stats_base_orders", "stats_base_customers"] } },
    }),
    prisma.botUptimeHour.findFirst({ orderBy: { hour: "asc" } }),
  ]);

  const base: Record<string, number> = {};
  for (const s of settings) base[s.key] = toInt(s.value);

  const bySource: Record<string, number> = { web: 0, whatsapp: 0, telegram: 0 };
  for (const r of bySourceRows) bySource[r.source] = r._count._all;

  // uptime: persen jam lengkap yang punya heartbeat, dihitung sejak heartbeat pertama
  let uptime: number | null = null;
  const now = Date.now();
  if (first && now - first.hour.getTime() >= 24 * H) {
    const nowHour = Math.floor(now / H) * H;
    const startMs = Math.max(first.hour.getTime(), nowHour - 720 * H);
    const total = (nowHour - startMs) / H;
    const beats = await prisma.botUptimeHour.count({
      where: { hour: { gte: new Date(startMs), lt: new Date(nowHour) } },
    });
    uptime = total > 0 ? Math.min(100, Math.round((beats / total) * 10000) / 100) : null;
  }

  return NextResponse.json(
    {
      orders: done + (base.stats_base_orders ?? 0),
      customers: webBuyers.length + botBuyers.length + (base.stats_base_customers ?? 0),
      uptime,
      bySource,
    },
    { headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=120" } }
  );
}
