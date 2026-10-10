import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function GET() {
  const where = { status: "APPROVED" };
  const [items, agg] = await Promise.all([
    prisma.testimonial.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 50,
      select: { id: true, displayName: true, rating: true, message: true, createdAt: true },
    }),
    prisma.testimonial.aggregate({ where, _avg: { rating: true }, _count: true }),
  ]);
  return NextResponse.json({
    items,
    count: agg._count,
    average: agg._avg.rating ?? 0,
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const uid = (session?.user as { id?: string } | undefined)?.id;
  if (!uid) {
    return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });
  }

  const recentCount = await prisma.testimonial.count({
    where: { userId: uid, createdAt: { gt: new Date(Date.now() - 60 * 60 * 1000) } },
  });
  if (recentCount >= 3) {
    return NextResponse.json(
      { error: "Terlalu banyak testimoni dalam waktu singkat. Coba lagi nanti." },
      { status: 429, headers: { "Retry-After": "3600" } }
    );
  }

  const b = await req.json().catch(() => null);
  const orderId = typeof b?.orderId === "string" ? b.orderId : "";
  const rating = Number(b?.rating);
  const message = typeof b?.message === "string" ? b.message.trim() : "";
  const fallback = (session?.user?.name ?? "Pembeli").split(" ")[0];
  const displayName = (
    typeof b?.displayName === "string" && b.displayName.trim() ? b.displayName.trim() : fallback
  ).slice(0, 30);

  if (
    !orderId ||
    !Number.isInteger(rating) || rating < 1 || rating > 5 ||
    message.length < 10 || message.length > 500 ||
    displayName.length < 2
  ) {
    return NextResponse.json({ error: "Data testimoni tidak valid." }, { status: 400 });
  }

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: uid },
    include: { testimonial: true },
  });
  if (!order) {
    return NextResponse.json({ error: "Pesanan tidak ditemukan." }, { status: 404 });
  }
  if (order.status !== "DONE") {
    return NextResponse.json(
      { error: "Testimoni hanya untuk pesanan yang sudah selesai." },
      { status: 403 }
    );
  }
  if (order.testimonial) {
    return NextResponse.json({ error: "Testimoni untuk pesanan ini sudah ada." }, { status: 409 });
  }

  try {
    await prisma.testimonial.create({
      data: { orderId, userId: uid, displayName, rating, message, status: "PENDING" },
    });
  } catch (e) {
    if ((e as { code?: string }).code === "P2002") {
      return NextResponse.json({ error: "Testimoni untuk pesanan ini sudah ada." }, { status: 409 });
    }
    throw e;
  }
  return NextResponse.json({ ok: true, message: "Terima kasih! Testimoni Anda menunggu persetujuan." }, { status: 201 });
}
