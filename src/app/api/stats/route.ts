import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const H = 60 * 60 * 1000;
const toInt = (v?: string) => {
  const n = Number(v);
  return Number.isInteger(n) && n >= 0 ? n : 0;
};

export async function GET() {
  const [done, customerGroups, settings, first] = await Promise.all([
    prisma.order.count({ where: { status: "DONE" } }),
    prisma.order.groupBy({
      by: ["userId"],
      where: { status: "DONE", userId: { not: null } },
    }),
    prisma.setting.findMany({
      where: { key: { in: ["stats_base_orders", "stats_base_customers"] } },
    }),
    prisma.botUptimeHour.findFirst({ orderBy: { hour: "asc" } }),
  ]);

  const base: Record<string, number> = {};
  for (const s of settings) base[s.key] = toInt(s.value);

  // uptime: persen jam yang punya heartbeat selama 30 hari terakhir
  let uptime: number | null = null;
  const now = Date.now();
  if (first && now - first.hour.getTime() >= 24 * H) {
    const nowHour = Math.floor(now / H) * H;
    const startMs = Math.max(first.hour.getTime(), nowHour - 720 * H);
    const total = (nowHour - startMs) / H;
    const beats = await prisma.botUptimeHour.count({
      where: { hour: { gte: new Date(startMs), lt: new Date(nowHour) } },
    });
    uptime = Math.min(100, Math.round((beats / total) * 10000) / 100);
  }

  return NextResponse.json(
    {
      orders: done + (base.stats_base_orders ?? 0),
      customers: customerGroups.length + (base.stats_base_customers ?? 0),
      uptime,
    },
    { headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=120" } }
  );
}
