"use client";
import { useEffect, useState } from "react";

type S = {
  orders: number;
  customers: number;
  uptime: number | null;
  bySource?: Record<string, number>;
};

const LABEL: Record<string, string> = {
  web: "Website",
  whatsapp: "WhatsApp",
  telegram: "Telegram",
};

export default function AdminSourceStats() {
  const [s, setS] = useState<S | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then(setS)
      .catch(() => setS(null));
  }, []);

  if (!s) return null;
  const by = s.bySource ?? {};

  return (
    <div className="glass mt-4 p-4 text-sm">
      <p className="font-semibold text-white">Angka beranda saat ini</p>
      <p className="mt-1">
        Total order: {s.orders} | Pelanggan: {s.customers}
      </p>
      <p className="mt-3 font-semibold text-white">Pesanan selesai per sumber</p>
      <ul className="mt-1 space-y-1">
        {["web", "whatsapp", "telegram"].map((k) => (
          <li key={k}>
            {LABEL[k]}: {by[k] ?? 0}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-slate-500">
        Total sudah menyertakan angka dasar sebelum website. Rincian per sumber hanya dari
        pesanan sungguhan.
      </p>
    </div>
  );
}
