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

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }
  const b = await req.json().catch(() => null);
  const to = typeof b?.status === "string" ? b.status : "";

  const order = await prisma.order.findUnique({ where: { id: params.id } });
  if (!order) return NextResponse.json({ error: "Pesanan tidak ditemukan." }, { status: 404 });
  if (!(NEXT[order.status] ?? []).includes(to)) {
    return NextResponse.json({ error: "Perubahan status tidak diizinkan." }, { status: 400 });
  }
  await prisma.order.update({ where: { id: order.id }, data: { status: to } });
  return NextResponse.json({ ok: true });
}
