import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const hb = await prisma.botHeartbeat.findUnique({ where: { id: "main" } });
  const online = !!hb && Date.now() - hb.lastSeen.getTime() < 3 * 60 * 1000;
  return NextResponse.json(
    { online, lastSeen: hb ? hb.lastSeen.toISOString() : null },
    { headers: { "Cache-Control": "s-maxage=30, stale-while-revalidate=60" } }
  );
}
