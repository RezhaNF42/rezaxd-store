import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { fulfillOrder } from "@/lib/fulfill";

export const dynamic = "force-dynamic";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Akses ditolak.", code: "FORBIDDEN" }, { status: 403 });
  }

  const b = await req.json().catch(() => null);
  let note: string | null | undefined;
  if (b && typeof b === "object" && "note" in b) {
    if (b.note === null) note = null;
    else if (typeof b.note === "string" && b.note.trim().length <= 1000) note = b.note.trim() || null;
    else {
      return NextResponse.json(
        { error: "Catatan maksimal 1000 karakter.", code: "VALIDATION" },
        { status: 400 }
      );
    }
  }

  const r = await fulfillOrder(params.id, note);
  if (!r.ok) {
    return NextResponse.json({ error: r.error, code: r.code }, { status: r.status });
  }
  return NextResponse.json({ ok: true, order: r.order }, { headers: { "Cache-Control": "no-store" } });
}
