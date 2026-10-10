export interface BotStatus { online: boolean; lastSeen: string | null }
export interface SiteStats { orders: number; customers: number; uptime: number | null }

const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) && v >= 0 ? v : null);

// Mengembalikan null bila endpoint belum ada atau gagal: tampilan akan menyembunyikan bagiannya
async function getJson(url: string): Promise<unknown | null> {
  try {
    const r = await fetch(url, { cache: "no-store" });
    return r.ok ? await r.json() : null;
  } catch {
    return null;
  }
}

export async function getBotStatus(): Promise<BotStatus | null> {
  const d = (await getJson("/api/bot-status")) as { online?: unknown; lastSeen?: unknown } | null;
  if (!d || typeof d.online !== "boolean") return null;
  return { online: d.online, lastSeen: typeof d.lastSeen === "string" ? d.lastSeen : null };
}

export async function getStats(): Promise<SiteStats | null> {
  const d = (await getJson("/api/stats")) as { orders?: unknown; customers?: unknown; uptime?: unknown } | null;
  const orders = num(d?.orders);
  const customers = num(d?.customers);
  if (orders === null || customers === null) return null;
  const up = num(d?.uptime);
  return { orders, customers, uptime: up !== null && up <= 100 ? up : null };
}
