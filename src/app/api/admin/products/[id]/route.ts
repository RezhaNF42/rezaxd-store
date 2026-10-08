import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const bad = (error: string) => NextResponse.json({ error }, { status: 400 });

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }
  const id = decodeURIComponent(params.id);
  const b = await req.json().catch(() => null);
  if (!b || typeof b !== "object") return bad("Data tidak valid.");

  const data: {
    name?: string;
    price?: number | null;
    stock?: number;
    active?: boolean;
    badge?: string | null;
  } = {};

  if ("name" in b) {
    const v = typeof b.name === "string" ? b.name.trim() : "";
    if (v.length < 2 || v.length > 80) return bad("Nama harus 2-80 karakter.");
    data.name = v;
  }
  if ("price" in b) {
    if (b.price === null) data.price = null;
    else if (Number.isInteger(b.price) && b.price >= 1000 && b.price <= 100000000) data.price = b.price;
    else return bad("Harga harus bilangan bulat Rp 1.000 - Rp 100.000.000, atau kosong.");
  }
  if ("stock" in b) {
    if (!Number.isInteger(b.stock) || b.stock < 0 || b.stock > 99999) return bad("Stok tidak valid.");
    data.stock = b.stock;
  }
  if ("active" in b) {
    if (typeof b.active !== "boolean") return bad("Status aktif tidak valid.");
    data.active = b.active;
  }
  if ("badge" in b) {
    if (b.badge === null || b.badge === "") data.badge = null;
    else if (typeof b.badge === "string" && b.badge.trim().length <= 20) data.badge = b.badge.trim();
    else return bad("Label maksimal 20 karakter.");
  }
  if (Object.keys(data).length === 0) return bad("Tidak ada perubahan.");

  try {
    await prisma.product.update({ where: { id }, data });
  } catch {
    return NextResponse.json({ error: "Produk tidak ditemukan." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
