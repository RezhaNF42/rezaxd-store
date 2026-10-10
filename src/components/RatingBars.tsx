"use client";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import type { PublicTestimonial } from "@/lib/api";

export default function RatingBars({ items, count }: { items: PublicTestimonial[]; count: number }) {
  const [ready, setReady] = useState(false);
  // Batang tumbuh dari 0 setelah tampil
  useEffect(() => {
    const t = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(t);
  }, []);

  if (!items.length) return null;
  const total = items.length;

  return (
    <div className="mx-auto mt-6 max-w-sm space-y-2">
      {[5, 4, 3, 2, 1].map((n) => {
        const c = items.filter((t) => t.rating === n).length;
        const pct = Math.round((c / total) * 100);
        return (
          <div key={n} className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex w-8 shrink-0 items-center gap-1">
              {n}<Star size={12} className="fill-amber text-amber" />
            </span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-amber transition-[width] duration-700 motion-reduce:transition-none"
                   style={{ width: ready ? `${pct}%` : "0%" }} />
            </div>
            <span className="w-8 shrink-0 text-right">{c}</span>
          </div>
        );
      })}
      {count > total && (
        <p className="pt-1 text-center text-[11px] text-slate-500">Dihitung dari {total} testimoni terbaru.</p>
      )}
    </div>
  );
}
