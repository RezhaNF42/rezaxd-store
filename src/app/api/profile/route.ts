import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function userId() {
  const session = await getServerSession(authOptions);
  return (session?.user as { id?: string } | undefined)?.id ?? null;
}

export async function GET() {
  const id = await userId();
  if (!id) return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });
  const u = await prisma.user.findUnique({
    where: { id },
    select: { name: true, email: true, image: true, contact: true },
  });
  if (!u) return NextResponse.json({ error: "Akun tidak ditemukan." }, { status: 404 });
  return NextResponse.json(u);
}

export async function PATCH(req: Request) {
  const id = await userId();
  if (!id) return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });

  const b = await req.json().catch(() => null);
  if (!b || typeof b !== "object" || !("contact" in b)) {
    return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });
  }
  let contact: string | null = null;
  if (b.contact === null) {
    contact = null;
  } else if (typeof b.contact === "string") {
    const v = b.contact.trim();
    if (v !== "") {
      if (v.length < 3 || v.length > 100) {
        return NextResponse.json({ error: "Kontak harus 3-100 karakter." }, { status: 400 });
      }
      contact = v;
    }
  } else {
    return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });
  }

  await prisma.user.update({ where: { id }, data: { contact } });
  return NextResponse.json({ ok: true, contact });
}
