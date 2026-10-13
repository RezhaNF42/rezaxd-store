"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { waLink } from "@/lib/config";
import { getTestimonials } from "@/lib/api";
import { getBotStatus, getStats, type BotStatus, type SiteStats } from "@/lib/live";

// Angka kecil disembunyikan sampai mencapai batas ini. Ubah sesuai selera.
const MIN_COUNT = 10;   // pesanan selesai dan pelanggan
const MIN_REVIEWS = 3;  // jumlah testimoni minimal agar rating tampil

// Hitung naik sederhana (langsung ke angka akhir bila "kurangi gerakan" aktif)
function Counter({ to }: { to: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setN(to); return; }
    let cur = 0;
    const step = Math.max(1, Math.floor(to / 60));
    const t = setInterval(() => {
      cur += step;
      if (cur >= to) { cur = to; clearInterval(t); }
      setN(cur);
    }, 25);
    return () => clearInterval(t);
  }, [to]);
  return <>{n.toLocaleString("id-ID")}</>;
}

function ago(iso: string): string {
  const m = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
  if (m < 1) return "baru saja";
  if (m < 60) return `${m} menit lalu`;
  if (m < 1440) return `${Math.floor(m / 60)} jam lalu`;
  return `${Math.floor(m / 1440)} hari lalu`;
}

export default function Hero() {
  const [status, setStatus] = useState<BotStatus | null>(null); // null = belum ada / tidak tersedia
  const [stats, setStats] = useState<SiteStats | null>(null);
  const [rating, setRating] = useState<{ average: number; count: number } | null>(null);

  // Status bot: periksa tiap 60 detik selama tab terlihat
  useEffect(() => {
    let alive = true;
    const load = () => {
      if (document.hidden) return;
      getBotStatus().then((s) => { if (alive) setStatus(s); });
    };
    load();
    const t = setInterval(load, 60000);
    return () => { alive = false; clearInterval(t); };
  }, []);

  // Statistik dan rating (rating memakai data testimoni yang sudah disetujui)
  useEffect(() => {
    let alive = true;
    getStats().then((s) => { if (alive) setStats(s); });
    getTestimonials()
      .then((d) => { if (alive && d.count >= MIN_REVIEWS) setRating({ average: d.average, count: d.count }); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  const cards: { key: string; label: string; value: React.ReactNode }[] = [];
  if (stats && stats.orders >= MIN_COUNT) cards.push({ key: "o", label: "Pesanan Selesai", value: <Counter to={stats.orders} /> });
  if (stats && stats.customers >= MIN_COUNT) cards.push({ key: "c", label: "Pelanggan", value: <Counter to={stats.customers} /> });
  if (rating) cards.push({ key: "r", label: `Rating (${rating.count} ulasan)`, value: <>{rating.average.toFixed(1)}★</> });
  // Dibulatkan ke bawah agar tidak melebih-lebihkan (99,97 menjadi 99,9)
  if (stats && stats.uptime !== null) cards.push({ key: "u", label: "Uptime Bot", value: <>{(Math.floor(stats.uptime * 10) / 10).toFixed(1)}%</> });

  return (
    <section className="mx-auto max-w-5xl px-5 pb-16 pt-12 text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Tinggi tetap agar halaman tidak bergeser saat status muncul */}
        <div className="flex h-9 justify-center">
          {status && (
            <span className="glass inline-flex items-center gap-2 px-4 py-1.5 text-sm">
              <span className={`h-2 w-2 rounded-full ${status.online ? "animate-pulse bg-green-400" : "bg-red-500"}`} />
              Eva Bot {status.online ? "Online" : "Offline"}
              {!status.online && status.lastSeen && (
                <span className="text-xs text-slate-400">· aktif {ago(status.lastSeen)}</span>
              )}
            </span>
          )}
        </div>

        <h1 className="mt-6 font-head text-5xl font-bold md:text-7xl">
          <span className="text-gradient">Rezaxd Official</span>
        </h1>
        <p className="mt-4 text-lg text-slate-300 md:text-xl">
          Eva Bot, Solusi Bot &amp; Panel Terlengkap
        </p>
        <p className="mx-auto mt-2 max-w-xl text-slate-400">
          Bot jalan 24 jam, anti banned, harga bersahabat. Order sekarang, langsung aktif!
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={waLink("Halo Kak Rezha, saya mau order layanan di Rezaxd Official 🚀")}
            target="_blank" rel="nofollow noopener"
            className="rounded-xl bg-primary px-7 py-3 font-semibold shadow-[0_0_24px_rgba(99,102,241,.6)] transition hover:scale-105"
          >
            Order Sekarang
          </a>
          <a href="#layanan" className="glass px-7 py-3 font-semibold">
            Lihat Layanan
          </a>
        </div>
      </motion.div>

      {/* Hanya angka nyata yang tersedia dan memenuhi batas; sisanya tidak ditampilkan */}
      {cards.length > 0 && (
        <div className="mt-14 flex flex-wrap justify-center gap-3">
          {cards.map((c) => (
            <div key={c.key} className="glass min-w-[140px] max-w-[220px] flex-1 p-4">
              <div className="font-head text-2xl font-bold text-amber md:text-4xl">{c.value}</div>
              <div className="mt-1 text-xs text-slate-400 md:text-sm">{c.label}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
