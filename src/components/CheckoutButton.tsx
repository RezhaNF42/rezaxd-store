"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { signIn, useSession } from "next-auth/react";
import { X } from "lucide-react";

export default function CheckoutButton({ productId, productName }: { productId: string; productName: string }) {
  const { status } = useSession();
  const [open, setOpen] = useState(false);
  const [contact, setContact] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Tombol Back dari Midtrans memulihkan halaman dari cache dengan keadaan lama
  // (modal terbuka, tombol terkunci): reset agar tidak macet
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted) { setBusy(false); setOpen(false); }
    };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  // Fokus ke isian saat dibuka, tutup dengan tombol Esc
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, busy]);

  function start() {
    if (status === "unauthenticated") {
      signIn("google", { callbackUrl: "/#layanan" });
      return;
    }
    setError("");
    setOpen(true);
  }

  async function pay() {
    const c = contact.trim();
    if (c.length < 3 || c.length > 100) { setError("Kontak harus 3–100 karakter."); return; }

    setError("");
    setBusy(true);
    try {
      // Harga tidak dikirim dari sini: server mengambilnya dari database
      const r = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, contact: c }),
      });
      const d = await r.json().catch(() => ({}));
      if (r.status === 401) { await signIn("google", { callbackUrl: "/#layanan" }); return; }
      if (!r.ok) throw new Error(d.error ?? "Gagal membuat pesanan.");

      // Hanya arahkan ke alamat pembayaran Midtrans yang valid
      let url: URL | null = null;
      try { url = new URL(String(d.redirectUrl)); } catch {}
      if (!url || url.protocol !== "https:" || !url.hostname.endsWith("midtrans.com")) {
        throw new Error("Alamat pembayaran tidak valid.");
      }
      window.location.href = url.toString();
      return; // tombol tetap nonaktif sampai halaman berpindah
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kendala. Coba lagi.");
    }
    setBusy(false);
  }

  return (
    <>
      <button onClick={start} disabled={status === "loading"}
        className="mt-6 w-full rounded-xl border border-cyan py-2.5 text-center font-semibold text-cyan transition hover:bg-cyan/10 disabled:opacity-50">
        Bayar Online
      </button>

      {/* Portal: agar tidak terpengaruh efek kartu (blur/transform) */}
      {open && createPortal(
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/70 sm:items-center sm:p-5"
             onClick={() => !busy && setOpen(false)}>
          <div role="dialog" aria-modal="true" aria-label="Pembayaran online"
               className="w-full max-w-md rounded-t-2xl border border-primary/30 bg-slate-900 p-6 sm:rounded-2xl"
               onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-head text-lg font-semibold">Bayar Online</h3>
                <p className="mt-1 text-sm text-slate-400">{productName}</p>
              </div>
              <button aria-label="Tutup" onClick={() => !busy && setOpen(false)}><X size={20} /></button>
            </div>

            <label htmlFor="co-contact" className="mt-5 block text-sm text-slate-300">Kontak tujuan layanan</label>
            <input id="co-contact" ref={inputRef} value={contact} maxLength={100}
              onChange={(e) => setContact(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") pay(); }}
              placeholder="Nomor WhatsApp atau username Telegram"
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base outline-none focus:border-primary" />
            <p className="mt-2 text-xs text-slate-500">Layanan dikirim ke kontak ini setelah pembayaran terkonfirmasi.</p>

            {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

            <button onClick={pay} disabled={busy}
              className="mt-5 w-full rounded-xl bg-primary py-3 font-semibold disabled:opacity-50">
              {busy ? "Memproses…" : "Lanjut ke pembayaran"}
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
