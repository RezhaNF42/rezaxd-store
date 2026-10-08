"use client";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { products as fallback, tabs, type Tab } from "@/lib/data";
import { rupiah, waLink } from "@/lib/config";

interface Item {
  id: string;
  tab: Tab;
  name: string;
  price: number | null; // null = hubungi owner
  stock: number;        // 0 = habis
  badge?: string | null;
  description?: string | null;
  features: string[];
}

// Cadangan: hanya dipakai bila API gagal
const FALLBACK: Item[] = fallback.map((p) => ({ ...p, stock: 999 }));

// Validasi bentuk data dari API sebelum ditampilkan
function normalize(raw: unknown): Item[] | null {
  if (!Array.isArray(raw)) return null;
  const out: Item[] = [];
  for (const p of raw) {
    if (!p || typeof p.id !== "string" || typeof p.name !== "string" || typeof p.tab !== "string") continue;
    const price = p.price == null ? null : Number(p.price);
    out.push({
      id: p.id,
      tab: p.tab as Tab,
      name: p.name,
      price: price !== null && Number.isFinite(price) ? price : null,
      stock: typeof p.stock === "number" ? p.stock : 999,
      badge: p.badge ?? null,
      description: p.description ?? null,
      features: Array.isArray(p.features) ? p.features.filter((f: unknown) => typeof f === "string") : [],
    });
  }
  return out;
}

export default function Services() {
  const [active, setActive] = useState<Tab>("wa");
  const [items, setItems] = useState<Item[] | null>(null); // null = sedang memuat

  useEffect(() => {
    let alive = true;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 6000); // batas waktu 6 detik

    fetch("/api/products", { cache: "no-store", signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data) => { if (alive) setItems(normalize(data) ?? FALLBACK); })
      .catch(() => { if (alive) setItems(FALLBACK); })
      .finally(() => clearTimeout(timer));

    return () => { alive = false; clearTimeout(timer); ctrl.abort(); };
  }, []);

  const list = items ? items.filter((p) => p.tab === active) : [];

  return (
    <section id="layanan" className="mx-auto max-w-6xl px-5 py-16">
      <h2 className="text-center font-head text-3xl font-bold md:text-4xl">
        Menu <span className="text-gradient">Layanan</span>
      </h2>

      {/* Tab filter: scroll horizontal di HP */}
      <div className="mt-8 flex gap-2 overflow-x-auto pb-2 md:justify-center">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm transition ${
              active === t.key
                ? "border-primary bg-primary shadow-[0_0_16px_rgba(99,102,241,.6)]"
                : "border-white/10 bg-white/5 hover:border-primary/50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Skeleton saat memuat */}
        {items === null &&
          [0, 1, 2, 3].map((i) => (
            <div key={i} className="h-72 animate-pulse rounded-2xl bg-white/10" />
          ))}

        {list.map((p) => {
          const isPanel = p.price === null;
          const soldOut = p.stock <= 0;
          const msg = isPanel
            ? `Halo Kak Rezha, saya mau request harga *${p.name}* per bulan. Boleh info?`
            : `Halo Kak Rezha, saya mau order *${p.name}* (${rupiah(p.price!)}). Mohon info pembayaran 🙏`;
          const cta = isPanel ? "Request Harga" : p.tab.startsWith("script") ? "Beli Script" : "Order";

          return (
            <div key={p.id} className={`glass relative flex flex-col p-6 ${soldOut ? "opacity-60" : ""}`}>
              {p.badge && !soldOut && (
                <span className="absolute -top-3 right-4 rounded-full bg-amber px-3 py-0.5 text-xs font-bold text-black">
                  {p.badge}
                </span>
              )}
              <h3 className="font-head text-lg font-semibold">{p.name}</h3>
              {p.description && <p className="mt-1 line-clamp-2 text-xs text-slate-400">{p.description}</p>}
              <div className="mt-2 font-head text-3xl font-bold text-amber">
                {isPanel ? "Hubungi Owner" : rupiah(p.price!)}
              </div>
              <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-300">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check size={16} className="mt-0.5 shrink-0 text-cyan" /> {f}
                  </li>
                ))}
              </ul>

              {soldOut ? (
                <span aria-disabled="true"
                  className="mt-6 cursor-not-allowed rounded-xl bg-white/10 py-2.5 text-center font-semibold text-slate-400">
                  Habis
                </span>
              ) : (
                <a
                  href={waLink(msg)}
                  target="_blank" rel="nofollow noopener"
                  className="mt-6 rounded-xl bg-primary py-2.5 text-center font-semibold transition hover:shadow-[0_0_20px_rgba(99,102,241,.7)]"
                >
                  {cta}
                </a>
              )}
            </div>
          );
        })}

        {items !== null && list.length === 0 && (
          <p className="col-span-full py-10 text-center text-slate-400">
            Belum ada produk di kategori ini.
          </p>
        )}
      </div>
    </section>
  );
}
