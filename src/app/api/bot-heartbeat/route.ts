import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const HOUR = 60 * 60 * 1000;
const sha = (s: string) => crypto.createHash("sha256").update(s).digest();

export async function POST(req: Request) {
  const secret = (process.env.BOT_HEARTBEAT_SECRET ?? "").trim();
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!secret || !crypto.timingSafeEqual(sha(token), sha(secret))) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  const now = new Date();
  const prev = await prisma.botHeartbeat.findUnique({ where: { id: "main" } });

  // batas laju: maksimal 10 permintaan per menit (jeda minimal 6 detik)
  if (prev && now.getTime() - prev.lastSeen.getTime() < 6000) {
    return NextResponse.json(
      { error: "Terlalu sering. Coba lagi sebentar lagi." },
      { status: 429, headers: { "Retry-After": "6" } }
    );
  }

  await prisma.botHeartbeat.upsert({
    where: { id: "main" },
    update: { lastSeen: now },
    create: { id: "main", lastSeen: now },
  });

  // catat jam ini sekali saja (agregasi per jam untuk uptime)
  const hourStart = new Date(Math.floor(now.getTime() / HOUR) * HOUR);
  if (!prev || prev.lastSeen.getTime() < hourStart.getTime()) {
    await prisma.botUptimeHour.upsert({
      where: { hour: hourStart },
      update: {},
      create: { hour: hourStart },
    });
  }
  return new NextResponse(null, { status: 204 });
}
