import { NextRequest, NextResponse } from "next/server";

// Nomor hanya dibaca di server, tidak masuk ke HTML maupun bundle
const NUMBERS: Record<string, string | undefined> = {
  owner: process.env.WA_OWNER,
  bot: process.env.WA_BOT,
};

export function GET(req: NextRequest, { params }: { params: { who: string } }) {
  const num = NUMBERS[params.who];
  if (!num) return new NextResponse("Not found", { status: 404 });

  const text = (req.nextUrl.searchParams.get("text") ?? "").slice(0, 500);
  const url = `https://wa.me/${num}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
  return NextResponse.redirect(url, 302);
}
