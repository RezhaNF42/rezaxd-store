"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Download, X } from "lucide-react";

interface InstallEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const KEY = "pwa-install-dismissed";
const HIDE_DAYS = 14;

const remember = () => {
  try { localStorage.setItem(KEY, String(Date.now())); } catch {}
};

export default function InstallPrompt() {
  const pathname = usePathname();
  const [evt, setEvt] = useState<InstallEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Sudah terpasang, atau baru saja ditutup: jangan tampilkan
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    try {
      const t = Number(localStorage.getItem(KEY));
      if (t && Date.now() - t < HIDE_DAYS * 86400000) return;
    } catch {}

    let timer: ReturnType<typeof setTimeout>;
    const onPrompt = (e: Event) => {
      e.preventDefault(); // tahan banner bawaan Chrome, pakai banner sendiri
      setEvt(e as InstallEvent);
      timer = setTimeout(() => setShow(true), 15000); // tunggu 15 detik agar tidak mengganggu
    };
    const onInstalled = () => { setShow(false); setEvt(null); };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function install() {
    if (!evt) return;
    setShow(false);
    try {
      await evt.prompt();
      const { outcome } = await evt.userChoice;
      if (outcome === "dismissed") remember();
    } catch {}
    setEvt(null);
  }

  if (!show || !evt || pathname?.startsWith("/admin")) return null;

  return (
    <div role="dialog" aria-label="Pasang aplikasi"
      className="fixed bottom-4 left-4 right-24 z-50 flex items-center gap-3 rounded-2xl border border-primary/40 bg-slate-900 p-3 shadow-xl">
      <Download size={20} className="shrink-0 text-cyan" />
      <p className="min-w-0 flex-1 text-xs text-slate-300">Pasang Rezaxd di layar utama</p>
      <button data-haptic onClick={install}
        className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold">
        Pasang
      </button>
      <button aria-label="Tutup" onClick={() => { remember(); setShow(false); }}
        className="shrink-0 p-1 text-slate-400">
        <X size={16} />
      </button>
    </div>
  );
}
