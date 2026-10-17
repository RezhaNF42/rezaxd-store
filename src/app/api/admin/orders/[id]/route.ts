import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { fulfillOrder } from "@/lib/fulfill";
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

  let note: string | null | undefined;
  if ("deliveryNote" in b) {
    if (b.deliveryNote === null) note = null;
    else if (typeof b.deliveryNote === "string" && b.deliveryNote.trim().length <= 1000) {
      note = b.deliveryNote.trim() || null;
    } else return bad("Catatan maksimal 1000 karakter.");
  }

  if ("status" in b) {
    const to = typeof b.status === "string" ? b.status : "";
    if (!(NEXT[order.status] ?? []).includes(to)) return bad("Perubahan status tidak diizinkan.");

    if (to === "DONE") {
      const r = await fulfillOrder(order.id, note);
      if (!r.ok) return NextResponse.json({ error: r.error }, { status: r.status });
      return NextResponse.json({ ok: true });
    }

    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: to,
        ...(to === "PAID" ? { fulfilledAt: null } : {}),
        ...(note !== undefined ? { deliveryNote: note } : {}),
      },
    });
    return NextResponse.json({ ok: true });
  }

  if (note !== undefined) {
    await prisma.order.update({ where: { id: order.id }, data: { deliveryNote: note } });
    return NextResponse.json({ ok: true });
  }
  return bad("Tidak ada perubahan.");
}
