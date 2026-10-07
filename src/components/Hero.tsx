"use client";
import { useEffect, useState } from "react";
import { STORE, waLink } from "@/lib/config";

// Counter animasi sederhana
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let cur = 0;
    const step = Math.max(1, Math.floor(to / 40));
    const t = setInterval(() => {
      cur += step;
      if (cur >= to) { cur = to; clearInterval(t); }
      setN(cur);
    }, 40);
    return () => clearInterval(t);
  }, [to]);
  return <>{n.toLocaleString("id-ID")}{suffix}</>;
}

export default function Hero() {
  // TODO Bagian 2: ambil status asli dari /api/status
  const online = true;

  return (
    <section className="mx-auto max-w-5xl px-5 pb-16 pt-24 text-center">
      <div className="fade-in">
        <span className="glass inline-flex items-center gap-2 px-4 py-1.5 text-sm">
          <span className={`h-2 w-2 rounded-full ${online ? "bg-green-400 animate-pulse" : "bg-red-500"}`} />
          Eva Bot {online ? "Online" : "Offline"}
        </span>

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
            target="_blank" rel="noreferrer"
            className="rounded-xl bg-primary px-7 py-3 font-semibold shadow-[0_0_24px_rgba(99,102,241,.6)] transition hover:scale-105"
          >
            Order Sekarang
          </a>
          <a href="#layanan" className="glass px-7 py-3 font-semibold">
            Lihat Layanan
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-14 grid grid-cols-3 gap-3">
        {[
          { v: 1200, s: "+", l: "Total Order" },
          { v: 850, s: "+", l: "Pelanggan Aktif" },
          { v: 99, s: "%", l: "Uptime Bot" },
        ].map((x) => (
          <div key={x.l} className="glass p-4">
            <div className="font-head text-2xl font-bold text-amber md:text-4xl">
              <Counter to={x.v} suffix={x.s} />
            </div>
            <div className="mt-1 text-xs text-slate-400 md:text-sm">{x.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}