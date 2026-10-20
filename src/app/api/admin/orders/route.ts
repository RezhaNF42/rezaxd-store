import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const SOURCES = ["web", "whatsapp", "telegram"];
const STATUSES = ["PENDING", "PAID", "DONE", "CANCEL"];

const select = {
  id: true,
  status: true,
  source: true,
  buyerRef: true,
  buyerName: true,
  contact: true,
  payment: true,
  amount: true,
  createdAt: true,
  paidAt: true,
  fulfilledAt: true,
  deliveryNote: true,
  product: { select: { name: true, price: true } },
  user: { select: { email: true, name: true } },
  testimonial: { select: { id: true } },
} as const;

const NO_STORE = { "Cache-Control": "no-store" };
const err = (status: number, code: string, error: string) =>
  NextResponse.json({ error, code }, { status, headers: NO_STORE });

export async function GET(req: Request) {
  if (!(await requireAdmin())) return err(403, "FORBIDDEN", "Akses ditolak.");

  const sp = new URL(req.url).searchParams;
  const filtered = ["source", "status", "cursor", "limit"].some((k) => sp.has(k));

  // tanpa parameter: bentuk lama (array, 100 terbaru) supaya panel yang ada tidak rusak
  if (!filtered) {
    const rows = await prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 100, select });
    return NextResponse.json(rows, { headers: NO_STORE });
  }

  const source = sp.get("source")?.toLowerCase() || null;
  const status = sp.get("status")?.toUpperCase() || null;
  const cursor = sp.get("cursor") || null;
  if (source && !SOURCES.includes(source)) return err(400, "VALIDATION", "source harus web, whatsapp, atau telegram.");
  if (status && !STATUSES.includes(status)) return err(400, "VALIDATION", "status harus PENDING, PAID, DONE, atau CANCEL.");
  if (cursor && cursor.length > 64) return err(400, "VALIDATION", "Cursor tidak valid.");
  const n = Number(sp.get("limit") ?? 30);
  const limit = Number.isFinite(n) ? Math.min(100, Math.max(1, Math.floor(n))) : 30;

  try {
    const rows = await prisma.order.findMany({
      where: { ...(source ? { source } : {}), ...(status ? { status } : {}) },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      select,
    });
    const hasMore = rows.length > limit;
    const items = hasMore ? rows.slice(0, limit) : rows;
    return NextResponse.json(
      { items, nextCursor: hasMore ? items[items.length - 1].id : null },
      { headers: NO_STORE }
    );
  } catch {
    return err(400, "VALIDATION", "Cursor tidak valid.");
  }
}
