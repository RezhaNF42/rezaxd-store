"use client";
import Link from "next/link";
import AdminNote from "@/components/AdminNote";
import SourceBadge from "@/components/SourceBadge";
import { parseBuyer, stripJid, toSource, type Source } from "@/lib/buyer";
import { useCallback, useEffect, useRef, useState } from "react";

type Order = {
  id: string;
  status: string;
  source: string;
  buyerRef: string | null;
  buyerName: string | null;
  contact: string;
  payment: string | null;
  amount: number | null;
  createdAt: string;
  paidAt: string | null;
  fulfilledAt: string | null;
  deliveryNote: string | null;
  product: { name: string; price: number | null };
  user: { email: string; name: string | null } | null; // pesanan bot bisa tanpa akun Google
  testimonial: { id: string } | null;
};
type Testi = {
  id: string;
  displayName: string;
  rating: number;
  message: string;
  status: string;
  createdAt: string;
};

const NEXT: Record<string, { to: string; label: string }[]> = {
  PENDING: [{ to: "CANCEL", label: "Batalkan" }],
  PAID: [{ to: "DONE", label: "Tandai selesai" }],
  DONE: [{ to: "PAID", label: "Kembalikan ke PAID" }],
  CANCEL: [],
};

const BADGE: Record<string, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-300",
  PAID: "bg-blue-500/20 text-blue-300",
  DONE: "bg-green-500/20 text-green-300",
  CANCEL: "bg-red-500/20 text-red-300",
  APPROVED: "bg-green-500/20 text-green-300",
};
const STATUS_LABEL: Record<string, string> = {
  PENDING: "Menunggu bayar",
  PAID: "Dibayar",
  DONE: "Diserahkan",
  CANCEL: "Dibatalkan",
};

const SOURCE_CHIPS: { key: "" | Source; label: string }[] = [
  { key: "", label: "Semua" },
  { key: "web", label: "Website" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "telegram", label: "Telegram" },
];
const STATUS_CHIPS = [
  { key: "", label: "Semua" },
  { key: "PENDING", label: "Menunggu" },
  { key: "PAID", label: "Dibayar" },
  { key: "DONE", label: "Diserahkan" },
  { key: "CANCEL", label: "Dibatalkan" },
];

const rupiah = (n: number | null) =>
  n === null ? "-" : new Intl.NumberFormat("id-ID").format(n);
const fmt = (s: string) => new Date(s).toLocaleString("id-ID");
// Target sentuh minimal 44px
const tabCls = (on: boolean) =>
  `min-h-[44px] rounded-lg px-4 text-sm font-semibold ${on ? "bg-primary text-white" : "border border-white/20"}`;
const chipCls = (on: boolean) =>
  `inline-flex min-h-[44px] shrink-0 items-center whitespace-nowrap rounded-full px-4 text-sm font-semibold ${on ? "bg-primary text-white" : "border border-white/20"}`;
const btn =
  "min-h-[44px] rounded-lg bg-primary px-4 text-sm font-semibold text-white disabled:opacity-50";
const btnGhost =
  "min-h-[44px] rounded-lg border border-white/20 px-4 text-sm disabled:opacity-50";

export default function AdminPanel() {
  const [tab, setTab] = useState<"orders" | "testi">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [source, setSource] = useState<"" | Source>("");
  const [status, setStatus] = useState("");
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [testi, setTesti] = useState<Testi[]>([]);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const reqId = useRef(0);

  // Halaman pertama (tanpa cursor) atau halaman berikutnya (dengan cursor), mengikuti filter aktif
  const loadOrders = useCallback(
    async (opts: { cursor?: string | null } = {}) => {
      const id = ++reqId.current;
      setLoadingOrders(true);
      setMsg("");
      const p = new URLSearchParams({ limit: "30" });
      if (source) p.set("source", source);
      if (status) p.set("status", status);
      if (opts.cursor) p.set("cursor", opts.cursor);
      try {
        const res = await fetch(`/api/admin/orders?${p}`, { cache: "no-store" });
        const d = await res.json().catch(() => ({}));
        if (id !== reqId.current) return; // jawaban lama diabaikan
        if (!res.ok) {
          setMsg(d.error ?? "Gagal memuat pesanan.");
          return;
        }
        const items: Order[] = Array.isArray(d.items) ? d.items : [];
        setOrders((prev) => (opts.cursor ? [...prev, ...items] : items));
        setNextCursor(typeof d.nextCursor === "string" ? d.nextCursor : null);
      } catch {
        if (id === reqId.current) setMsg("Gagal memuat pesanan.");
      } finally {
        if (id === reqId.current) setLoadingOrders(false);
      }
    },
    [source, status]
  );

  const loadTesti = useCallback(async () => {
    const res = await fetch("/api/admin/testimonials", { cache: "no-store" });
    if (!res.ok) {
      setMsg("Gagal memuat testimoni.");
      return;
    }
    setTesti(await res.json());
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);
  useEffect(() => {
    loadTesti();
  }, [loadTesti]);

  async function act(
    url: string,
    method: "PATCH" | "DELETE",
    after: "orders" | "testi",
    body?: object
  ) {
    setBusy(true);
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    setBusy(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setMsg(d.error ?? "Gagal.");
      return;
    }
    if (after === "testi") await loadTesti();
    else await loadOrders();
  }

  const waiting = testi.filter((t) => t.status === "PENDING").length;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 text-slate-300">
      <h1 className="text-2xl font-bold text-white">Panel Admin</h1>
      <Link href="/admin/produk" className="mt-2 inline-block text-sm text-primary underline">Kelola produk</Link>
      <Link href="/admin/statistik" className="ml-4 mt-2 inline-block text-sm text-primary underline">Angka beranda</Link>
      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => setTab("orders")} className={tabCls(tab === "orders")}>
          Pesanan ({orders.length}{nextCursor ? "+" : ""})
        </button>
        <button onClick={() => setTab("testi")} className={tabCls(tab === "testi")}>
          Testimoni ({waiting} menunggu)
        </button>
        <button onClick={() => { loadOrders(); loadTesti(); }} className={`ml-auto ${btnGhost}`}>
          Muat ulang
        </button>
      </div>
      {msg && <p className="mt-3 text-sm text-yellow-300">{msg}</p>}

      {tab === "orders" && (
        <>
          {/* Filter: chip yang bisa digulir ke samping di HP */}
          <p className="mt-4 text-xs text-slate-500">Sumber</p>
          <div className="no-scrollbar -mx-4 mt-1 flex gap-2 overflow-x-auto px-4 pb-1" role="group" aria-label="Filter sumber">
            {SOURCE_CHIPS.map((c) => (
              <button key={c.key || "all"} aria-pressed={source === c.key} onClick={() => setSource(c.key)} className={chipCls(source === c.key)}>
                {c.label}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-500">Status</p>
          <div className="no-scrollbar -mx-4 mt-1 flex gap-2 overflow-x-auto px-4 pb-1" role="group" aria-label="Filter status">
            {STATUS_CHIPS.map((c) => (
              <button key={c.key || "all"} aria-pressed={status === c.key} onClick={() => setStatus(c.key)} className={chipCls(status === c.key)}>
                {c.label}
              </button>
            ))}
          </div>

          <div className={`mt-4 space-y-3 ${loadingOrders && orders.length > 0 ? "opacity-60" : ""}`}>
            {loadingOrders && orders.length === 0 && <div className="h-28 animate-pulse rounded-2xl bg-white/10" />}
            {!loadingOrders && orders.length === 0 && !msg && (
              <p className="text-sm">Belum ada pesanan{source || status ? " untuk filter ini" : ""}.</p>
            )}
            {orders.map((o) => {
              const src = toSource(o.source);
              const b = parseBuyer(o);
              // Kontak pesanan bot: buang akhiran JID, tampilkan hanya bila berbeda dari ID pembeli
              const contact = src === "web" ? o.contact : stripJid(o.contact);
              const showContact = !!contact && contact !== b.id && contact !== (b.id ?? "").replace(/^\+/, "");
              return (
                <div key={o.id} className="glass p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="min-w-0 break-words font-semibold text-white">{o.product.name}</p>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${BADGE[o.status] ?? ""}`}>
                      {STATUS_LABEL[o.status] ?? o.status}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-400">
                    <SourceBadge source={src} />
                    <span>Rp {rupiah(o.amount ?? o.product.price)} | {o.payment ?? "belum bayar"}</span>
                  </div>

                  <p className="mt-2 break-words text-sm text-white">{b.title}</p>
                  <p className="break-all text-sm text-slate-400">
                    {b.kind}:{" "}
                    {b.href ? (
                      <a href={b.href} target="_blank" rel="noreferrer" className="text-primary underline">{b.id}</a>
                    ) : (
                      b.id ?? "-"
                    )}
                  </p>
                  {showContact && (
                    <p className="break-words text-sm text-slate-400">
                      Kontak: <span className="text-white">{contact}</span>
                    </p>
                  )}

                  <p className="mt-1 text-xs text-slate-500">
                    {fmt(o.createdAt)}
                    {o.fulfilledAt && ` · Diserahkan ${fmt(o.fulfilledAt)}`}
                  </p>
                  {(o.status === "PAID" || o.status === "DONE") && (
                    <AdminNote id={o.id} initial={o.deliveryNote ?? ""} />
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(NEXT[o.status] ?? []).map((n) => (
                      <button
                        key={n.to}
                        disabled={busy}
                        className={n.to === "DONE" ? btn : btnGhost}
                        onClick={() => {
                          if (n.to === "PAID" && !window.confirm(
                            src === "web" ? "Kembalikan pesanan ke PAID?" : "Kembalikan ke PAID? Pembeli bot tidak dikabari ulang."
                          )) return;
                          act(`/api/admin/orders/${o.id}`, "PATCH", "orders", { status: n.to });
                        }}
                      >
                        {n.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {nextCursor && (
            <button onClick={() => loadOrders({ cursor: nextCursor })} disabled={loadingOrders} className={`mt-4 w-full ${btnGhost}`}>
              {loadingOrders ? "Memuat..." : "Muat lebih banyak"}
            </button>
          )}
        </>
      )}

      {tab === "testi" && (
        <div className="mt-4 space-y-3">
          {testi.length === 0 && !msg && <p className="text-sm">Belum ada testimoni.</p>}
          {testi.map((t) => (
            <div key={t.id} className="glass p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="min-w-0 break-words font-semibold text-white">{t.displayName}</p>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${BADGE[t.status] ?? ""}`}>
                  {t.status}
                </span>
              </div>
              <p className="mt-1 text-yellow-300">
                {"★".repeat(t.rating)}
                {"☆".repeat(5 - t.rating)}
              </p>
              <p className="mt-2 break-words text-sm text-slate-200">{t.message}</p>
              <p className="mt-1 text-xs text-slate-500">{fmt(t.createdAt)}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {t.status === "PENDING" && (
                  <button
                    disabled={busy}
                    className={btn}
                    onClick={() => act(`/api/admin/testimonials/${t.id}`, "PATCH", "testi", { status: "APPROVED" })}
                  >
                    Setujui
                  </button>
                )}
                {t.status === "APPROVED" && (
                  <button
                    disabled={busy}
                    className={btnGhost}
                    onClick={() => act(`/api/admin/testimonials/${t.id}`, "PATCH", "testi", { status: "PENDING" })}
                  >
                    Sembunyikan
                  </button>
                )}
                <button
                  disabled={busy}
                  className={btnGhost}
                  onClick={() => {
                    if (window.confirm("Hapus testimoni ini?")) {
                      act(`/api/admin/testimonials/${t.id}`, "DELETE", "testi");
                    }
                  }}
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
