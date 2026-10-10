"use client";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Check, X } from "lucide-react";
import CheckoutButton from "@/components/CheckoutButton";
import { rupiah, waLink } from "@/lib/config";
import { ctaLabel, orderMsg, type Item, type PriceMeta } from "@/lib/products";

const ONLINE = process.env.NEXT_PUBLIC_ONLINE_CHECKOUT === "true";

export default function ProductSheet({
  item, meta, onClose,
}: { item: Item | null; meta: PriceMeta | null; onClose: () => void }) {
  // Kunci gulir halaman di belakang, tutup dengan Esc atau saat kembali dari halaman lain (Back)
  useEffect(() => {
    if (!item) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    const onShow = (e: PageTransitionEvent) => { if (e.persisted) onClose(); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pageshow", onShow);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pageshow", onShow);
    };
  }, [item, onClose]);

  if (!item) return null;

  const isPanel = item.price === null;
  const soldOut = item.stock <= 0;

  return createPortal(
    <div className="fixed inset-0 z-[65] flex items-end justify-center bg-black/70 sm:items-center sm:p-5" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={`Rincian ${item.name}`}
        className="sheet max-h-[88vh] w-full max-w-md overflow-y-auto rounded-t-2xl border border-primary/30 bg-slate-900 p-6 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}>

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {item.badge && !soldOut && (
              <span className="mb-2 inline-block rounded-full bg-amber px-3 py-0.5 text-xs font-bold text-black">{item.badge}</span>
            )}
            <h3 className="font-head text-xl font-semibold">{item.name}</h3>
          </div>
          <button aria-label="Tutup rincian" onClick={onClose} className="shrink-0 p-1"><X size={22} /></button>
        </div>

        <div className="mt-3 font-head text-3xl font-bold text-amber">
          {isPanel ? "Hubungi Owner" : rupiah(item.price as number)}
        </div>
        {meta && (
          <p className="mt-1 text-sm text-slate-400">
            ≈ {rupiah(Math.round(meta.perDay))} per hari
            {meta.saving && (
              <span className="ml-2 rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-semibold text-green-400">
                Hemat {meta.saving}% dibanding paket {meta.baseDays} hari
              </span>
            )}
          </p>
        )}

        {/* Teks biasa dari server, tanpa dangerouslySetInnerHTML */}
        {item.description && (
          <p className="mt-4 whitespace-pre-line break-words text-sm text-slate-300">{item.description}</p>
        )}

        <h4 className="mt-5 text-sm font-semibold">Yang Anda dapatkan</h4>
        <ul className="mt-2 space-y-2 text-sm text-slate-300">
          {item.features.map((f) => (
            <li key={f} className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-cyan" /> {f}</li>
          ))}
        </ul>

        {soldOut ? (
          <span aria-disabled="true"
            className="mt-6 block cursor-not-allowed rounded-xl bg-white/10 py-3 text-center font-semibold text-slate-400">
            Habis
          </span>
        ) : (
          <>
            <a href={waLink(orderMsg(item))} target="_blank" rel="nofollow noopener"
              className="mt-6 block rounded-xl bg-primary py-3 text-center font-semibold">
              {ctaLabel(item)} via WhatsApp
            </a>
            {ONLINE && !isPanel && <CheckoutButton productId={item.id} productName={item.name} />}
            <p className="mt-3 text-center text-xs text-slate-500">Pesan WhatsApp sudah terisi otomatis.</p>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
