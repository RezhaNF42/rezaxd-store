"use client";
import { useState } from "react";
import { Check } from "lucide-react";
import { products, tabs, type Tab } from "@/lib/data";
import { rupiah, waLink } from "@/lib/config";

export default function Services() {
  const [active, setActive] = useState<Tab>("wa");
  const list = products.filter((p) => p.tab === active);

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
        {list.map((p) => {
          const isPanel = p.price === null;
          // Pesan WhatsApp otomatis terisi
          const msg = isPanel
            ? `Halo Kak Rezha, saya mau request harga *${p.name}* per bulan. Boleh info?`
            : `Halo Kak Rezha, saya mau order *${p.name}* (${rupiah(p.price!)}). Mohon info pembayaran 🙏`;
          const cta = isPanel ? "Request Harga" : p.tab.startsWith("script") ? "Beli Script" : "Order";

          return (
            <div key={p.id} className="glass relative flex flex-col p-6">
              {p.badge && (
                <span className="absolute -top-3 right-4 rounded-full bg-amber px-3 py-0.5 text-xs font-bold text-black">
                  {p.badge}
                </span>
              )}
              <h3 className="font-head text-lg font-semibold">{p.name}</h3>
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
              <a
                href={waLink(msg)}
                target="_blank" rel="noreferrer"
                className="mt-6 rounded-xl bg-primary py-2.5 text-center font-semibold transition hover:shadow-[0_0_20px_rgba(99,102,241,.7)]"
              >
                {cta}
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}