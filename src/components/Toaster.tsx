"use client";
import { useEffect, useState } from "react";

// Pemakaian di komponen client mana pun: toast("Tersimpan!")
export function toast(message: string) {
  window.dispatchEvent(new CustomEvent("app-toast", { detail: message }));
}

export default function Toaster() {
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const show = (m: string) => {
      setMsg(m);
      clearTimeout(timer);
      timer = setTimeout(() => setMsg(null), 2500);
    };
    const onToast = (e: Event) => show((e as CustomEvent<string>).detail);
    // Setiap klik tautan /wa/... memunculkan toast
    const onClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a[href^="/wa/"]')) show("Membuka WhatsApp…");
    };
    window.addEventListener("app-toast", onToast);
    document.addEventListener("click", onClick);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("app-toast", onToast);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-5">
      {msg && (
        <div className="rounded-xl border border-primary/40 bg-slate-900/95 px-4 py-2.5 text-sm shadow-lg">{msg}</div>
      )}
    </div>
  );
}
