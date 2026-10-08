"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Star } from "lucide-react";

const input =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base outline-none focus:border-primary";

export default function TestimonialForm({
  orderId, defaultName, onDone,
}: { orderId: string; defaultName: string; onDone: (msg: string) => void }) {
  const [rating, setRating] = useState(0);
  const [name, setName] = useState(defaultName);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    const msg = message.trim();
    const dn = name.trim();

    // Validasi awal, aturan sama dengan server (server tetap memeriksa ulang)
    if (rating < 1) { setError("Pilih rating bintang terlebih dahulu."); return; }
    if (msg.length < 10 || msg.length > 500) { setError("Komentar harus 10–500 karakter."); return; }
    if (dn && (dn.length < 2 || dn.length > 30)) { setError("Nama tampilan harus 2–30 karakter."); return; }

    setError("");
    setBusy(true);
    try {
      const r = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, rating, message: msg, ...(dn ? { displayName: dn } : {}) }),
      });
      const d = await r.json().catch(() => ({}));
      if (r.status === 401) { await signIn("google", { callbackUrl: "/pesanan" }); return; }
      if (!r.ok) throw new Error(d.error ?? "Gagal mengirim testimoni.");
      onDone(d.message ?? "Terima kasih! Testimoni Anda menunggu persetujuan.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kendala. Coba lagi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-4 space-y-4 border-t border-white/10 pt-4">
      <div>
        <p className="mb-1 text-sm text-slate-300">Rating</p>
        <div role="radiogroup" aria-label="Rating" className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" role="radio" aria-checked={rating === n}
              aria-label={`${n} bintang`} onClick={() => setRating(n)} className="p-1">
              <Star size={32} className={n <= rating ? "fill-amber text-amber" : "text-slate-600"} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm text-slate-300" htmlFor={`nm-${orderId}`}>Nama tampilan</label>
        <input id={`nm-${orderId}`} className={input} value={name} maxLength={30}
          onChange={(e) => setName(e.target.value)} placeholder="Nama yang tampil di testimoni" />
      </div>

      <div>
        <label className="mb-1 block text-sm text-slate-300" htmlFor={`ms-${orderId}`}>Komentar</label>
        <textarea id={`ms-${orderId}`} className={input} rows={4} maxLength={500} value={message}
          onChange={(e) => setMessage(e.target.value)} placeholder="Ceritakan pengalaman Anda (minimal 10 karakter)" />
        <div className="mt-1 text-right text-xs text-slate-500">{message.trim().length}/500</div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button onClick={submit} disabled={busy}
        className="w-full rounded-xl bg-primary py-3 font-semibold transition disabled:opacity-50">
        {busy ? "Mengirim…" : "Kirim testimoni"}
      </button>
      <p className="text-xs text-slate-500">Testimoni tampil setelah disetujui admin.</p>
    </div>
  );
}
