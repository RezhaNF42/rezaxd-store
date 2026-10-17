import crypto from "crypto";

const sha = (s: string) => crypto.createHash("sha256").update(s).digest();

export function isBotRequest(req: Request): boolean {
  const secret = process.env.BOT_API_SECRET ?? "";
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  return !!secret && crypto.timingSafeEqual(sha(token), sha(secret));
}
