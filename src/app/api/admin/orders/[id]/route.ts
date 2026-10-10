import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const NEXT: Record<string, string[]> = {
  PENDING: ["CANCEL"],
  PAID: ["DONE"],
  DONE: ["PAID"],
  CANCEL: [],
};

const bad = (error: string) => NextResponse.json({ error }, { status: 400 });

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }
  const b = await req.json().catch(() => null);
  if (!b || typeof b !== "object") return bad("Data tidak valid.");

  const order = await prisma.order.findUnique({ where: { id: params.id } });
  if (!order) return NextResponse.json({ error: "Pesanan tidak ditemukan." }, { status: 404 });

  const data: { status?: string; deliveryNote?: string | null } = {};
  if ("status" in b) {
    const to = typeof b.status === "string" ? b.status : "";
    if (!(NEXT[order.status] ?? []).includes(to)) return bad("Perubahan status tidak diizinkan.");
    data.status = to;
  }
  if ("deliveryNote" in b) {
    if (b.deliveryNote === null) data.deliveryNote = null;
    else if (typeof b.deliveryNote === "string" && b.deliveryNote.trim().length <= 1000) {
      data.deliveryNote = b.deliveryNote.trim() || null;
    } else return bad("Catatan maksimal 1000 karakter.");
  }
  if (Object.keys(data).length === 0) return bad("Tidak ada perubahan.");

  await prisma.order.update({ where: { id: order.id }, data });
  return NextResponse.json({ ok: true });
}
