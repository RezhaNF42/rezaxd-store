import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }
  const items = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: { id: true, displayName: true, rating: true, message: true, status: true, createdAt: true },
  });
  return NextResponse.json(items);
}
