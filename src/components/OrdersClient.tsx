"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { RefreshCw } from "lucide-react";
import { rupiah } from "@/lib/config";
import { fmtDate, type OrderItem } from "@/lib/api";
import TestimonialForm from "@/components/TestimonialForm";

const STATUS: Record<OrderItem["status"], { label: string; cls: string }> = {
  PENDING: { label: "Menunggu pembayaran", cls: "bg-amber/20 text-amber" },
  PAID: { label: "Dibayar, menunggu aktivasi", cls: "bg-cyan/20 text-cyan" },
  DONE: { label: "Selesai, layanan aktif", cls: "bg-green-500/20 text-green-400" },
  CANCEL: { label: "Dibatalkan", cls: "bg-red-500/20 text-red-400" },
};

const card = "rounded-2xl border border-primary/30 bg-white/5 p-5";

export default function OrdersClient() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<OrderItem[] | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [openForm, setOpenForm] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const r = await fetch("/api/orders", { cache: "no-store" });
      const d = await r.json().catch(() => ({}));
      if (r.status === 401) throw new Error("Sesi berakhir, silakan masuk lagi.");
      if (!r.ok) throw new Error(d.error ?? "Gagal memuat pesanan.");
      setOrders(d);
      setError("");
    } catch (e) {
      if (!silent) setError(e instanceof Error ? e.message : "Terjadi kendala.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") load();
  }, [status, load]);

  // Notifikasi Midtrans bisa terlambat beberapa detik: segarkan tiap 8 detik, maksimal 15 kali
  const waiting = !!orders?.some((o) => o.status === "PENDING" || o.status === "PAID");
  useEffect(() => {
    if (!waiting) return;
    let n = 0;
    const t = setInterval(() => {
      if (++n > 15) clearInterval(t);
      else load(true);
    }, 8000);
    return () => clearInterval(t);
  }, [waiting, load]);

  if (status === "loading")
    return <div className="mt-8 h-32 animate-pulse rounded-2xl bg-white/10" />;

  if (status === "unauthenticated")
    return (
      <div className={`${card} mt-8 text-center`}>
        <p className="font-semibold">Masuk untuk melihat pesanan Anda</p>
        <p className="mt-2 text-sm text-slate-400">Gunakan akun Google yang dipakai saat memesan.</p>
        <button onClick={() => signIn("google", { callbackUrl: "/pesanan" })}
          className="mt-5 rounded-xl bg-primary px-6 py-3 font-semibold">
          Masuk dengan Google
        </button>
      </div>
    );

  const firstName = (session?.user?.name ?? "").split(" ")[0];

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="truncate text-slate-400">Masuk sebagai {session?.user?.name}</span>
        <div className="flex shrink-0 gap-2">
          <button onClick={() => load()} disabled={loading} aria-label="Muat ulang"
            className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5">
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
          <button onClick={() => signOut({ callbackUrl: "/" })}
            className="rounded-lg border border-white/10 bg-white/5 px-3">
            Keluar
          </button>
        </div>
      </div>

      {notice && <p className="mt-4 rounded-xl bg-green-500/10 p-3 text-sm text-green-400">{notice}</p>}
      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      {orders === null && !error && <div className="mt-6 h-32 animate-pulse rounded-2xl bg-white/10" />}

      {orders?.length === 0 && (
        <div className={`${card} mt-6 text-center`}>
          <p className="font-semibold">Belum ada pesanan online</p>
          <Link href="/#layanan" className="mt-3 inline-block font-semibold text-primary">Lihat layanan →</Link>
        </div>
      )}

      <div className="mt-6 space-y-4">
        {orders?.map((o) => {
          const st = STATUS[o.status];
          return (
            <div key={o.id} className={card}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold">{o.product.name}</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {o.product.price != null && `${rupiah(o.product.price)} · `}{fmtDate(o.createdAt)}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${st.cls}`}>{st.label}</span>
              </div>

              {o.status === "PAID" && (
                <p className="mt-3 text-sm text-slate-400">Pembayaran diterima. Layanan segera diaktifkan.</p>
              )}

              {o.status === "DONE" && o.testimonial && (
                <p className="mt-3 text-sm text-green-400">✓ Testimoni terkirim</p>
              )}

              {o.status === "DONE" && !o.testimonial && (
                openForm === o.id ? (
                  <TestimonialForm
                    orderId={o.id}
                    defaultName={firstName}
                    onDone={(msg) => { setNotice(msg); setOpenForm(null); load(true); }}
                  />
                ) : (
                  <button onClick={() => setOpenForm(o.id)}
                    className="mt-4 w-full rounded-xl bg-primary py-2.5 font-semibold">
                    Tulis testimoni
                  </button>
                )
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
