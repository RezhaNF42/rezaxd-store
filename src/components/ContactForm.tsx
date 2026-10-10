"use client";
import { useEffect, useState } from "react";

const input =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base outline-none focus:border-primary";

export default function ContactForm() {
  const [saved, setSaved] = useState<string | null>(null); // nilai yang tersimpan di server
  const [value, setValue] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/profile", { cache: "no-store" })
      .then(async (r) => {
        const d = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(d.error ?? "Gagal memuat profil.");
        return d;
      })
      .then((d) => {
        if (!alive) return;
        setSaved(d.contact ?? null);
        setValue(d.contact ?? "");
        setLoaded(true);
      })
      .catch((e: Error) => {
        if (!alive) return;
        setMsg({ ok: false, text: e.message });
        setLoaded(true);
      });
    return () => { alive = false; };
  }, []);

  // next = null berarti hapus kontak
  async function save(next: string | null) {
    const v = next === null ? null : next.trim();
    if (v !== null && (v.length < 3 || v.length > 100)) {
      setMsg({ ok: false, text: "Kontak harus 3–100 karakter." });
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      const r = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact: v }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error ?? "Gagal menyimpan kontak.");
      setSaved(d.contact ?? null);
      setValue(d.contact ?? "");
      setMsg({ ok: true, text: v === null ? "Kontak dihapus." : "Kontak tersimpan." });
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : "Terjadi kendala. Coba lagi." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-primary/30 bg-white/5 p-5">
      <h3 className="font-semibold">Kontak layanan</h3>
      <p className="mt-1 text-xs text-slate-400">
        Nomor WhatsApp atau username Telegram. Terisi otomatis saat Bayar Online.
      </p>

      {!loaded ? (
        <div className="mt-4 h-12 animate-pulse rounded-xl bg-white/10" />
      ) : (
        <>
          <input className={`${input} mt-4`} value={value} maxLength={100}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Nomor WhatsApp atau username Telegram" aria-label="Kontak layanan" />
          <div className="mt-3 flex gap-2">
            <button onClick={() => save(value)} disabled={busy || value.trim() === (saved ?? "")}
              className="flex-1 rounded-xl bg-primary py-2.5 font-semibold disabled:opacity-50">
              {busy ? "Menyimpan…" : "Simpan"}
            </button>
            {saved && (
              <button onClick={() => save(null)} disabled={busy}
                className="rounded-xl border border-white/10 px-4 disabled:opacity-50">
                Hapus
              </button>
            )}
          </div>
          {msg && <p className={`mt-3 text-sm ${msg.ok ? "text-green-400" : "text-red-400"}`}>{msg.text}</p>}
        </>
      )}
    </div>
  );
}
