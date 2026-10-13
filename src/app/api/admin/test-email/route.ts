import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { notifyAdmin } from "@/lib/notify";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }
  const ok = await notifyAdmin(
    "Uji notifikasi Rezaxd Official",
    "Jika email ini sampai, notifikasi pesanan dibayar sudah siap bekerja."
  );
  return NextResponse.json({ ok });
}
