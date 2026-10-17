import { botUnauthorized, isBotRequest } from "@/lib/bot-auth";
import { fail, json } from "@/lib/bot-order";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!isBotRequest(req)) return botUnauthorized();

  const b = await req.json().catch(() => null);
  const ids = b?.ids;
  if (
    !Array.isArray(ids) ||
    ids.length > 100 ||
    !ids.every((x: unknown) => typeof x === "string" && x.length > 0 && x.length <= 64)
  ) {
    return fail(400, "VALIDATION", "ids harus berupa daftar maksimal 100 id.");
  }

  // id yang tidak dikenal diabaikan
  await prisma.botEvent.updateMany({
    where: { id: { in: ids }, deliveredAt: null },
    data: { deliveredAt: new Date() },
  });
  return json({ ok: true });
}
