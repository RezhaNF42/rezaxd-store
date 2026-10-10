"use client";
import { useCallback, useEffect, useState } from "react";
import { Check } from "lucide-react";
import { products as fallback, tabs, type Tab } from "@/lib/data";
import { rupiah, waLink } from "@/lib/config";
import { ctaLabel, orderMsg, priceMeta, type Item } from "@/lib/products";
import CheckoutButton from "@/components/CheckoutButton";
import ProductSheet from "@/components/ProductSheet";

// Tombol Bayar Online hanya tampil bila penanda ini bernilai "true" di Vercel
const ONLINE = process.env.NEXT_PUBLIC_ONLINE_CHECKOUT === "true";

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

const PREVIEW = 3; // jumlah fitur yang tampil di kartu

export default function Services() {
  const [active, setActive] = useState<Tab>("wa");
  const [items, setItems] = useState<Item[] | null>(null); // null = sedang memuat
  const [detail, setDetail] = useState<Item | null>(null);
  const closeDetail = useCallback(() => setDetail(null), []);

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
          [0, 1, 2, 3].map((i) => <div key={i} className="h-72 animate-pulse rounded-2xl bg-white/10" />)}

        {items && list.map((p) => {
          const isPanel = p.price === null;
          const soldOut = p.stock <= 0;
          const meta = priceMeta(p, items);
          const extra = p.features.length - PREVIEW;

          return (
            <div key={p.id} onClick={() => setDetail(p)}
              className={`glass relative flex cursor-pointer flex-col p-6 ${soldOut ? "opacity-60" : ""}`}>
              {p.badge && !soldOut && (
                <span className="absolute -top-3 right-4 rounded-full bg-amber px-3 py-0.5 text-xs font-bold text-black">
                  {p.badge}
                </span>
              )}
              <h3 className="font-head text-lg font-semibold">{p.name}</h3>
              {p.description && <p className="mt-1 line-clamp-2 text-xs text-slate-400">{p.description}</p>}

              <div className="mt-2 font-head text-3xl font-bold text-amber">
                {isPanel ? "Hubungi Owner" : rupiah(p.price as number)}
              </div>
              {meta && (
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <span>≈ {rupiah(Math.round(meta.perDay))}/hari</span>
                  {meta.saving && (
                    <span className="rounded-full bg-green-500/20 px-2 py-0.5 font-semibold text-green-400">
                      Hemat {meta.saving}%
                    </span>
                  )}
                </div>
              )}

              <div className="mt-4 flex-1">
                <ul className="space-y-2 text-sm text-slate-300">
                  {p.features.slice(0, PREVIEW).map((f) => (
                    <li key={f} className="flex gap-2">
                      <Check size={16} className="mt-0.5 shrink-0 text-cyan" /> {f}
                    </li>
                  ))}
                </ul>
                {extra > 0 && <p className="mt-2 text-xs text-slate-500">+{extra} fitur lainnya</p>}
                <button onClick={() => setDetail(p)} className="mt-3 text-sm font-semibold text-primary">
                  Lihat rincian →
                </button>
              </div>

              {/* Klik tombol order tidak ikut membuka rincian */}
              <div className="contents" onClick={(e) => e.stopPropagation()}>
                {ONLINE && !soldOut && !isPanel && <CheckoutButton productId={p.id} productName={p.name} />}
                {soldOut ? (
                  <span aria-disabled="true"
                    className="mt-6 cursor-not-allowed rounded-xl bg-white/10 py-2.5 text-center font-semibold text-slate-400">
                    Habis
                  </span>
                ) : (
                  <a href={waLink(orderMsg(p))} target="_blank" rel="nofollow noopener"
                    className="mt-6 rounded-xl bg-primary py-2.5 text-center font-semibold transition hover:shadow-[0_0_20px_rgba(99,102,241,.7)]">
                    {ctaLabel(p)}
                  </a>
                )}
              </div>
            </div>
          );
        })}

        {items !== null && list.length === 0 && (
          <p className="col-span-full py-10 text-center text-slate-400">Belum ada produk di kategori ini.</p>
        )}
      </div>

      <ProductSheet item={detail} meta={detail && items ? priceMeta(detail, items) : null} onClose={closeDetail} />
    </section>
  );
}
