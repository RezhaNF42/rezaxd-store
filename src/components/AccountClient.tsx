"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { ChevronRight, LogOut } from "lucide-react";
import Avatar from "@/components/Avatar";
import { rupiah } from "@/lib/config";
import { fmtDate, type OrderItem } from "@/lib/api";

const LABEL: Record<OrderItem["status"], { t: string; cls: string }> = {
  PENDING: { t: "Menunggu pembayaran", cls: "bg-amber/20 text-amber" },
  PAID: { t: "Dibayar", cls: "bg-cyan/20 text-cyan" },
  DONE: { t: "Selesai", cls: "bg-green-500/20 text-green-400" },
  CANCEL: { t: "Dibatalkan", cls: "bg-red-500/20 text-red-400" },
};

const card = "rounded-2xl border border-primary/30 bg-white/5 p-5";

const menu = [
  { href: "/pesanan", label: "Pesanan Saya" },
  { href: "/testimoni", label: "Testimoni Pelanggan" },
  { href: "/#layanan", label: "Lihat Layanan" },
];

export default function AccountClient() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<OrderItem[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status !== "authenticated") return;
    let alive = true;
    fetch("/api/orders", { cache: "no-store" })
      .then(async (r) => {
        const d = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(d.error ?? "Gagal memuat pesanan.");
        return d as OrderItem[];
      })
      .then((d) => { if (alive) setOrders(d); })
      .catch((e: Error) => { if (alive) setError(e.message); });
    return () => { alive = false; };
  }, [status]);

  if (status === "loading")
    return <div className="mt-8 h-40 animate-pulse rounded-2xl bg-white/10" />;

  if (status === "unauthenticated")
    return (
      <div className={`${card} mt-8 text-center`}>
        <p className="font-semibold">Masuk untuk membuka akun Anda</p>
        <p className="mt-2 text-sm text-slate-400">Gunakan akun Google Anda.</p>
        <button onClick={() => signIn("google", { callbackUrl: "/akun" })}
          className="mt-5 rounded-xl bg-primary px-6 py-3 font-semibold">
          Masuk dengan Google
        </button>
      </div>
    );

  const user = session?.user;
  const stats: [string, number | undefined][] = [
    ["Total", orders?.length],
    ["Diproses", orders?.filter((o) => o.status === "PENDING" || o.status === "PAID").length],
    ["Selesai", orders?.filter((o) => o.status === "DONE").length],
  ];
  const toReview = orders?.filter((o) => o.status === "DONE" && !o.testimonial).length ?? 0;

  return (
    <div className="mt-6 space-y-5">
      {/* Identitas dari akun Google */}
      <div className={`${card} flex items-center gap-4`}>
        <Avatar src={user?.image} name={user?.name} size={64} />
        <div className="min-w-0">
          <h2 className="truncate font-head text-xl font-semibold">{user?.name}</h2>
          <p className="break-all text-sm text-slate-400">{user?.email}</p>
          <p className="mt-1 text-xs text-slate-500">Masuk dengan Google</p>
        </div>
      </div>

      {/* Ringkasan pesanan */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map(([label, v]) => (
          <div key={label} className="rounded-2xl border border-primary/30 bg-white/5 p-4 text-center">
            <div className="font-head text-2xl font-bold text-amber">{v ?? "–"}</div>
            <div className="mt-1 text-xs text-slate-400">{label}</div>
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {/* Pengingat testimoni */}
      {toReview > 0 && (
        <Link href="/pesanan" className="block rounded-2xl bg-primary/20 p-4 text-sm">
          Anda punya <b>{toReview}</b> pesanan selesai yang belum diberi testimoni.{" "}
          <span className="font-semibold text-primary">Tulis testimoni →</span>
        </Link>
      )}

      {/* Pesanan terbaru */}
      <div className={card}>
        <h3 className="font-semibold">Pesanan terbaru</h3>
        {orders === null && !error && <div className="mt-3 h-16 animate-pulse rounded-xl bg-white/10" />}
        {orders?.length === 0 && (
          <p className="mt-3 text-sm text-slate-400">
            Belum ada pesanan online.{" "}
            <Link href="/#layanan" className="font-semibold text-primary">Lihat layanan →</Link>
          </p>
        )}
        <ul className="mt-3 space-y-3">
          {orders?.slice(0, 3).map((o) => (
            <li key={o.id} className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{o.product.name}</p>
                <p className="text-xs text-slate-400">
                  {o.product.price != null && `${rupiah(o.product.price)} · `}{fmtDate(o.createdAt)}
                </p>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${LABEL[o.status].cls}`}>
                {LABEL[o.status].t}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Menu pintasan */}
      <div className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-primary/30 bg-white/5">
        {menu.map((m) => (
          <Link key={m.href} href={m.href} className="flex items-center justify-between px-5 py-4 hover:bg-white/5">
            {m.label}
            <ChevronRight size={18} className="text-slate-500" />
          </Link>
        ))}
      </div>

      <button onClick={() => signOut({ callbackUrl: "/" })}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-400/40 py-3 font-semibold text-red-400">
        <LogOut size={18} /> Keluar
      </button>
    </div>
  );
}
