import type { Tab } from "@/lib/data";
import { rupiah } from "@/lib/config";

export interface Item {
  id: string;
  tab: Tab;
  name: string;
  price: number | null; // null = hubungi owner
  stock: number;        // 0 = habis
  badge?: string | null;
  description?: string | null;
  features: string[];
}

// Durasi (hari) dibaca dari nama paket, mis. "Sewa Bot WhatsApp 30 Hari". Hanya untuk sewa bot.
function daysOf(p: Item): number | null {
  if (p.tab !== "wa" && p.tab !== "tg") return null;
  const m = p.name.match(/(\d+)\s*hari/i);
  return m ? Number(m[1]) : null;
}

export interface PriceMeta {
  perDay: number;
  saving: number | null;   // persen hemat dibanding paket terpendek
  baseDays: number | null; // durasi paket pembanding
}

// Dihitung dari harga yang tampil, jadi ikut berubah saat harga diubah di panel
export function priceMeta(p: Item, all: Item[]): PriceMeta | null {
  const d = daysOf(p);
  if (!d || p.price == null || p.price <= 0) return null;
  const perDay = p.price / d;

  let base = p;
  for (const x of all) {
    const xd = daysOf(x);
    if (x.tab === p.tab && xd && (x.price ?? 0) > 0 && xd < (daysOf(base) as number)) base = x;
  }

  let saving: number | null = null;
  if (base.id !== p.id) {
    const s = Math.round((1 - perDay / ((base.price as number) / (daysOf(base) as number))) * 100);
    if (s >= 5) saving = s;
  }
  return { perDay, saving, baseDays: daysOf(base) };
}

export function orderMsg(p: Item): string {
  return p.price === null
    ? `Halo Kak Rezha, saya mau request harga *${p.name}* per bulan. Boleh info?`
    : `Halo Kak Rezha, saya mau order *${p.name}* (${rupiah(p.price)}). Mohon info pembayaran 🙏`;
}

export function ctaLabel(p: Item): string {
  return p.price === null ? "Request Harga" : p.tab.startsWith("script") ? "Beli Script" : "Order";
}
