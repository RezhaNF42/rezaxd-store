"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const input =
  "mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white";

export default function AdminStats() {
  const [orders, setOrders] = useState("");
  const [customers, setCustomers] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/stats-base");
      if (!res.ok) {
        setMsg("Gagal memuat.");
        return;
      }
      const d = await res.json();
      setOrders(d.orders === null ? "" : String(d.orders));
      setCustomers(d.customers === null ? "" : String(d.customers));
    })();
  }, []);

  async function save() {
    setMsg("Menyimpan...");
    const res = await fetch("/api/admin/stats-base", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orders: orders.trim() === "" ? null : Number(orders),
        customers: customers.trim() === "" ? null : Number(customers),
      }),
    });
    const d = await res.json().catch(() => ({}));
    setMsg(res.ok ? "Tersimpan." : d.error ?? "Gagal menyimpan.");
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-10 text-slate-300">
      <Link href="/admin" className="text-sm text-slate-400 hover:text-white">
        ← Kembali ke panel
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-white">Angka Beranda</h1>
      <p className="mt-2 text-sm text-slate-400">
        Riwayat nyata sebelum website ada. Angka ini ditambahkan ke jumlah pesanan dan
        pelanggan dari database. Kosong berarti 0.
      </p>
      <div className="glass mt-4 p-4">
        <label className="block text-sm">
          Total order sebelum website
          <input
            className={input}
            type="number"
            inputMode="numeric"
            value={orders}
            onChange={(e) => setOrders(e.target.value)}
          />
        </label>
        <label className="mt-3 block text-sm">
          Pelanggan sebelum website
          <input
            className={input}
            type="number"
            inputMode="numeric"
            value={customers}
            onChange={(e) => setCustomers(e.target.value)}
          />
        </label>
        <button
          onClick={save}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
        >
          Simpan
        </button>
        {msg && <p className="mt-3 text-sm text-yellow-300">{msg}</p>}
      </div>
    </main>
  );
}
