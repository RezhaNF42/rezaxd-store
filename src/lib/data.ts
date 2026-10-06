export type Tab = "wa" | "tg" | "panel" | "script-wa" | "script-tg";

export interface Product {
  id: string;
  tab: Tab;
  name: string;
  price: number | null; // null = hubungi owner
  badge?: string;
  features: string[];
}

const botFeatures = [
  "Semua fitur bot aktif",
  "Anti banned",
  "Support 24/7",
  "Garansi aktif",
];

const rent = (tab: "wa" | "tg", label: string) => [
  { d: "7 Hari", p: 10000 },
  { d: "30 Hari", p: 25000, badge: "Terlaris" },
  { d: "90 Hari", p: 60000 },
  { d: "Lifetime", p: 150000, badge: "Hemat" },
].map((x) => ({
  id: `${tab}-${x.d}`,
  tab,
  name: `Sewa Bot ${label} ${x.d}`,
  price: x.p,
  badge: x.badge,
  features: botFeatures,
}));

export const products: Product[] = [
  ...rent("wa", "WhatsApp"),
  ...rent("tg", "Telegram"),
  {
    id: "panel-1",
    tab: "panel",
    name: "Panel 1GB",
    price: null,
    features: ["1GB RAM", "1 CPU", "5GB Disk", "Port tersedia", "Request harga/bulan"],
  },
  {
    id: "script-wa-1",
    tab: "script-wa",
    name: "Script Bot WhatsApp Premium",
    price: 75000,
    features: ["Source code lengkap", "Multi-fitur", "Free update", "Panduan install"],
  },
  {
    id: "script-tg-1",
    tab: "script-tg",
    name: "Script Bot Telegram Premium",
    price: 65000,
    features: ["Source code lengkap", "Downloader & AI", "Free update", "Panduan install"],
  },
];

export const tabs: { key: Tab; label: string }[] = [
  { key: "wa", label: "🤖 Bot WhatsApp" },
  { key: "tg", label: "✈️ Bot Telegram" },
  { key: "panel", label: "🖥️ Panel" },
  { key: "script-wa", label: "📜 Script WA" },
  { key: "script-tg", label: "📜 Script TG" },
];