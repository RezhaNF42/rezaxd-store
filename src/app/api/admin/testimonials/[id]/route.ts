import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }
  const b = await req.json().catch(() => null);
  const status = b?.status;
  if (status !== "APPROVED" && status !== "PENDING") {
    return NextResponse.json({ error: "Status tidak valid." }, { status: 400 });
  }
  try {
    await prisma.testimonial.update({ where: { id: params.id }, data: { status } });
  } catch {
    return NextResponse.json({ error: "Testimoni tidak ditemukan." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }
  try {
    await prisma.testimonial.delete({ where: { id: params.id } });
  } catch {
    return NextResponse.json({ error: "Testimoni tidak ditemukan." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
