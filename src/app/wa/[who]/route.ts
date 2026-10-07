import { NextRequest, NextResponse } from "next/server";

// Selalu dijalankan saat ada permintaan, supaya env terbaca di runtime
export const dynamic = "force-dynamic";

const KEYS: Record<string, string> = { owner: "WA_OWNER", bot: "WA_BOT" };

export function GET(req: NextRequest, { params }: { params: { who: string } }) {
  const key = KEYS[params.who];
  if (!key) return new NextResponse("Not found", { status: 404 });

  // Hanya digit, jadi aman dari tanda +, spasi, atau kutip yang terselip
  const num = (process.env[key] ?? "").replace(/\D/g, "");
  if (!num) return new NextResponse(`Kontak belum dikonfigurasi (${key} kosong)`, { status: 404 });

  const text = (req.nextUrl.searchParams.get("text") ?? "").slice(0, 500);
  const url = `https://wa.me/${num}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
  return NextResponse.redirect(url, 302);
}
