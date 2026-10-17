import crypto from "crypto";
import { NextResponse } from "next/server";

const sha = (s: string) => crypto.createHash("sha256").update(s).digest();

export function botUnauthorized() {
  return NextResponse.json(
    { error: "unauthorized", code: "UNAUTHORIZED" },
    { status: 401, headers: { "Cache-Control": "no-store" } }
  );
}

export function isBotRequest(req: Request): boolean {
  const secret = process.env.BOT_API_SECRET ?? "";
  if (secret.length < 40) return false;
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  return crypto.timingSafeEqual(sha(token), sha(secret));
}
