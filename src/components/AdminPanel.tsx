"use client";
import Link from "next/link";
import AdminNote from "@/components/AdminNote";
import { useCallback, useEffect, useState } from "react";

type Order = {
  id: string;
  status: string;
  contact: string;
  payment: string | null;
  createdAt: string;
  product: { name: string; price: number | null };
  user: { email: string; name: string | null } | null;
  testimonial: { id: string } | null;
  deliveryNote: string | null;
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

const rupiah = (n: number | null) =>
  n === null ? "-" : new Intl.NumberFormat("id-ID").format(n);
const fmt = (s: string) => new Date(s).toLocaleString("id-ID");
const tabCls = (on: boolean) =>
  `rounded-lg px-3 py-1.5 text-sm font-semibold ${on ? "bg-primary text-white" : "border border-white/20"}`;
const btn =
  "rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50";
const btnGhost =
  "rounded-lg border border-white/20 px-3 py-1.5 text-sm disabled:opacity-50";

export default function AdminPanel() {
  const [tab, setTab] = useState<"orders" | "testi">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [testi, setTesti] = useState<Testi[]>([]);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setMsg("Memuat...");
    const [a, b] = await Promise.all([
      fetch("/api/admin/orders"),
      fetch("/api/admin/testimonials"),
    ]);
    if (!a.ok || !b.ok) {
      setMsg("Gagal memuat data.");
      return;
    }
    setOrders(await a.json());
    setTesti(await b.json());
    setMsg("");
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function act(url: string, method: "PATCH" | "DELETE", body?: object) {
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
    await load();
  }

  const waiting = testi.filter((t) => t.status === "PENDING").length;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 text-slate-300">
      <h1 className="text-2xl font-bold text-white">Panel Admin</h1>
      <Link href="/admin/produk" className="mt-2 inline-block text-sm text-primary underline">Kelola produk</Link>
      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => setTab("orders")} className={tabCls(tab === "orders")}>
          Pesanan ({orders.length})
        </button>
        <button onClick={() => setTab("testi")} className={tabCls(tab === "testi")}>
          Testimoni ({waiting} menunggu)
        </button>
        <button onClick={load} className={`ml-auto ${btnGhost}`}>
          Muat ulang
        </button>
      </div>
      {msg && <p className="mt-3 text-sm text-yellow-300">{msg}</p>}

      {tab === "orders" && (
        <div className="mt-4 space-y-3">
          {orders.length === 0 && !msg && <p className="text-sm">Belum ada pesanan.</p>}
          {orders.map((o) => (
            <div key={o.id} className="glass p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold text-white">{o.product.name}</p>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${BADGE[o.status] ?? ""}`}>
                  {o.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-400">
                Rp {rupiah(o.product.price)} | {o.payment ?? "belum bayar"}
              </p>
              <p className="mt-2 text-sm">
                Kontak: <span className="text-white">{o.contact}</span>
              </p>
              <p className="text-sm text-slate-400">
                {o.user?.name ?? "-"} | {o.user?.email ?? "-"}
              </p>
              <p className="text-xs text-slate-500">{fmt(o.createdAt)}</p>
              {(o.status === "PAID" || o.status === "DONE") && (
                <AdminNote id={o.id} initial={o.deliveryNote ?? ""} />
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {(NEXT[o.status] ?? []).map((n) => (
                  <button
                    key={n.to}
                    disabled={busy}
                    className={n.to === "DONE" ? btn : btnGhost}
                    onClick={() => act(`/api/admin/orders/${o.id}`, "PATCH", { status: n.to })}
                  >
                    {n.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "testi" && (
        <div className="mt-4 space-y-3">
          {testi.length === 0 && !msg && <p className="text-sm">Belum ada testimoni.</p>}
          {testi.map((t) => (
            <div key={t.id} className="glass p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold text-white">{t.displayName}</p>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${BADGE[t.status] ?? ""}`}>
                  {t.status}
                </span>
              </div>
              <p className="mt-1 text-yellow-300">
                {"★".repeat(t.rating)}
                {"☆".repeat(5 - t.rating)}
              </p>
              <p className="mt-2 text-sm text-slate-200">{t.message}</p>
              <p className="mt-1 text-xs text-slate-500">{fmt(t.createdAt)}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {t.status === "PENDING" && (
                  <button
                    disabled={busy}
                    className={btn}
                    onClick={() => act(`/api/admin/testimonials/${t.id}`, "PATCH", { status: "APPROVED" })}
                  >
                    Setujui
                  </button>
                )}
                {t.status === "APPROVED" && (
                  <button
                    disabled={busy}
                    className={btnGhost}
                    onClick={() => act(`/api/admin/testimonials/${t.id}`, "PATCH", { status: "PENDING" })}
                  >
                    Sembunyikan
                  </button>
                )}
                <button
                  disabled={busy}
                  className={btnGhost}
                  onClick={() => {
                    if (window.confirm("Hapus testimoni ini?")) {
                      act(`/api/admin/testimonials/${t.id}`, "DELETE");
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
