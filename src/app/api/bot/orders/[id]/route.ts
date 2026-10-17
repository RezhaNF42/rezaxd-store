import { botUnauthorized, isBotRequest } from "@/lib/bot-auth";
import { expireStalePending, fail, isSource, json, orderSelect, serializeOrder } from "@/lib/bot-order";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  if (!isBotRequest(req)) return botUnauthorized();

  const sp = new URL(req.url).searchParams;
  const platform = sp.get("platform");
  const buyerId = (sp.get("buyerId") ?? "").trim();
  if (!isSource(platform) || buyerId.length < 3 || buyerId.length > 128) {
    return fail(400, "VALIDATION", "platform dan buyerId wajib diisi.");
  }

  await expireStalePending();
  // pesanan hanya dikembalikan bila platform dan pembeli cocok
  const row = await prisma.order.findFirst({
    where: { id: params.id, source: platform, buyerRef: buyerId },
    select: orderSelect,
  });
  if (!row) return fail(404, "NOT_FOUND", "Pesanan tidak ditemukan.");
  return json({ order: serializeOrder(row) });
}
