"use client";
import { useState } from "react";
import { MessageCircle, X, User, Bot } from "lucide-react";
import { STORE, waLink } from "@/lib/config";

export default function FloatingWA() {
  const [open, setOpen] = useState(false);

  const items = [
    {
      icon: User,
      title: `Chat Owner (${STORE.owner})`,
      sub: "Order, tanya harga, request panel",
      href: waLink("Halo Kak Rezha, saya mau tanya layanan di Rezaxd Official 🙏", "owner"),
    },
    {
      icon: Bot,
      title: "Chat Eva Bot",
      sub: "Info bot dan layanan",
      href: waLink("Halo Eva Bot, saya mau tanya layanan 🙏", "bot"),
    },
  ];

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {/* Ketuk di luar menu untuk menutup */}
      {open && (
        <button aria-label="Tutup menu" onClick={() => setOpen(false)}
                className="fixed inset-0 -z-10 cursor-default" />
      )}

      {open && (
        <div className="w-72 rounded-2xl border border-primary/30 bg-slate-900/95 p-3 shadow-xl">
          <p className="px-2 pb-2 text-sm font-semibold">Hubungi Kami</p>
          {items.map((it) => (
            <a key={it.title} href={it.href} target="_blank" rel="nofollow noopener"
               className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-white/10">
              <it.icon size={20} className="shrink-0 text-cyan" />
              <span>
                <span className="block text-sm font-semibold">{it.title}</span>
                <span className="block text-xs text-slate-400">{it.sub}</span>
              </span>
            </a>
          ))}
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        aria-label="Menu kontak"
        aria-expanded={open}
        className="grid h-14 w-14 place-items-center rounded-full bg-green-500 shadow-[0_0_24px_rgba(34,197,94,.6)] transition hover:scale-110"
      >
        {open ? <X className="text-white" /> : <MessageCircle className="text-white" />}
      </button>
    </div>
  );
}
