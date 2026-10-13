import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const KEYS = { orders: "stats_base_orders", customers: "stats_base_customers" } as const;
const FIELDS = ["orders", "customers"] as const;

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }
  const rows = await prisma.setting.findMany({
    where: { key: { in: [KEYS.orders, KEYS.customers] } },
  });
  const val = (k: string) => {
    const r = rows.find((x) => x.key === k);
    return r ? Number(r.value) : null;
  };
  return NextResponse.json({ orders: val(KEYS.orders), customers: val(KEYS.customers) });
}

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }
  const b = await req.json().catch(() => null);
  if (!b || typeof b !== "object") {
    return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });
  }

  const ops: { key: string; value: number | null }[] = [];
  for (const f of FIELDS) {
    if (!(f in b)) continue;
    const v = b[f];
    if (v === null || v === "") ops.push({ key: KEYS[f], value: null });
    else if (Number.isInteger(v) && v >= 0 && v <= 10000000) ops.push({ key: KEYS[f], value: v });
    else {
      return NextResponse.json(
        { error: "Angka harus bilangan bulat 0 - 10.000.000, atau kosong." },
        { status: 400 }
      );
    }
  }
  if (ops.length === 0) {
    return NextResponse.json({ error: "Tidak ada perubahan." }, { status: 400 });
  }

  for (const o of ops) {
    if (o.value === null) {
      await prisma.setting.deleteMany({ where: { key: o.key } });
    } else {
      await prisma.setting.upsert({
        where: { key: o.key },
        update: { value: String(o.value) },
        create: { key: o.key, value: String(o.value) },
      });
    }
  }
  return NextResponse.json({ ok: true });
}
