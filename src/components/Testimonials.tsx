"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Stars from "@/components/Stars";
import { getTestimonials, type PublicTestimonial } from "@/lib/api";

export default function Testimonials() {
  const [items, setItems] = useState<PublicTestimonial[]>([]);

  useEffect(() => {
    getTestimonials().then((d) => setItems(d.items.slice(0, 6))).catch(() => {});
  }, []);

  if (!items.length) return null; // belum ada testimoni: bagian ini tidak tampil

  return (
    <section id="testimoni" className="mx-auto max-w-6xl px-5 py-16">
      <h2 className="text-center font-head text-3xl font-bold md:text-4xl">
        Kata <span className="text-gradient">Pelanggan</span>
      </h2>
      <p className="mt-2 text-center text-sm text-slate-400">Geser untuk melihat lainnya →</p>

      <div className="no-scrollbar -mx-5 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 pt-3">
        {items.map((t) => (
          <figure key={t.id} className="glass w-[85%] shrink-0 snap-center p-6 sm:w-[48%] lg:w-[32%]">
            <Stars value={t.rating} />
            {/* Teks biasa, tanpa dangerouslySetInnerHTML */}
            <blockquote className="mt-4 text-sm text-slate-300">“{t.message}”</blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-primary font-bold">
                {t.displayName.charAt(0).toUpperCase()}
              </span>
              <span className="text-sm font-semibold">{t.displayName}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-4 text-center">
        <Link href="/testimoni" className="font-semibold text-primary">Lihat semua testimoni →</Link>
      </div>
    </section>
  );
}
