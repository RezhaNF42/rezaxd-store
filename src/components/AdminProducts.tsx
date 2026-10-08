"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type P = {
  id: string;
  name: string;
  category: string;
  price: number | null;
  stock: number;
  badge: string | null;
  active: boolean;
};
type Draft = { name: string; price: string; stock: string; badge: string; active: boolean };

const toDraft = (p: P): Draft => ({
  name: p.name,
  price: p.price === null ? "" : String(p.price),
  stock: String(p.stock),
  badge: p.badge ?? "",
  active: p.active,
});

const input =
  "mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white";

export default function AdminProducts() {
  const [items, setItems] = useState<P[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState("");

  const load = useCallback(async () => {
    setMsg("Memuat...");
    const res = await fetch("/api/admin/products");
    if (!res.ok) {
      setMsg("Gagal memuat data.");
      return;
    }
    const data: P[] = await res.json();
    setItems(data);
    setDrafts(Object.fromEntries(data.map((p) => [p.id, toDraft(p)])));
    setMsg("");
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function edit(id: string, patch: Partial<Draft>) {
    setDrafts((d) => ({ ...d, [id]: { ...d[id], ...patch } }));
  }

  async function save(id: string) {
    const d = drafts[id];
    const price = d.price.trim() === "" ? null : Number(d.price);
    setBusy(id);
    const res = await fetch(`/api/admin/products/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: d.name,
        price,
        stock: Number(d.stock),
        badge: d.badge.trim() || null,
        active: d.active,
      }),
    });
    setBusy("");
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      setMsg(e.error ?? "Gagal menyimpan.");
      return;
    }
    await load();
    setMsg("Tersimpan.");
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 text-slate-300">
      <Link href="/admin" className="text-sm text-slate-400 hover:text-white">
        ← Kembali ke panel
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-white">Kelola Produk</h1>
      <p className="mt-2 text-sm text-slate-400">
        Harga dikosongkan = hubungi owner (tidak bisa dibeli online). Produk nonaktif tidak bisa dibeli.
      </p>
      {msg && <p className="mt-3 text-sm text-yellow-300">{msg}</p>}

      <div className="mt-4 space-y-3">
        {items.map((p) => {
          const d = drafts[p.id];
          if (!d) return null;
          return (
            <div key={p.id} className="glass p-4">
              <p className="text-xs text-slate-500">
                {p.id} | {p.category}
              </p>
              <label className="mt-2 block text-sm">
                Nama
                <input className={input} value={d.name} onChange={(e) => edit(p.id, { name: e.target.value })} />
              </label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <label className="block text-sm">
                  Harga (Rp)
                  <input
                    className={input}
                    type="number"
                    inputMode="numeric"
                    value={d.price}
                    onChange={(e) => edit(p.id, { price: e.target.value })}
                  />
                </label>
                <label className="block text-sm">
                  Stok
                  <input
                    className={input}
                    type="number"
                    inputMode="numeric"
                    value={d.stock}
                    onChange={(e) => edit(p.id, { stock: e.target.value })}
                  />
                </label>
              </div>
              <label className="mt-2 block text-sm">
                Label (opsional)
                <input className={input} value={d.badge} onChange={(e) => edit(p.id, { badge: e.target.value })} />
              </label>
              <label className="mt-3 flex items-center gap-2 text-sm">
                <input type="checkbox" checked={d.active} onChange={(e) => edit(p.id, { active: e.target.checked })} />
                Aktif (tampil dan bisa dibeli)
              </label>
              <button
                disabled={busy === p.id}
                onClick={() => save(p.id)}
                className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {busy === p.id ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          );
        })}
      </div>
    </main>
  );
}
