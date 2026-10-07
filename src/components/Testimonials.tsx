import { Star } from "lucide-react";
import { sampleTestimonials, type TestimonialItem } from "@/lib/content";

// Sambungkan ke database nanti: <Testimonials items={dataDariDB} />
export default function Testimonials({ items = sampleTestimonials }: { items?: TestimonialItem[] }) {
  if (!items.length) return null; // sembunyikan bila belum ada testimoni

  return (
    <section id="testimoni" className="mx-auto max-w-6xl px-5 py-16">
      <h2 className="text-center font-head text-3xl font-bold md:text-4xl">
        Kata <span className="text-gradient">Pelanggan</span>
      </h2>
      <p className="mt-2 text-center text-sm text-slate-400">Geser untuk melihat lainnya →</p>

      <div className="no-scrollbar -mx-5 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 pt-3">
        {items.map((t) => (
          <figure key={t.id} className="glass w-[85%] shrink-0 snap-center p-6 sm:w-[48%] lg:w-[32%]">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} className={i < t.rating ? "fill-amber text-amber" : "text-slate-600"} />
              ))}
            </div>
            <blockquote className="mt-4 text-sm text-slate-300">“{t.message}”</blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              {t.avatar ? (
                <img src={t.avatar} alt={t.name} loading="lazy" className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <span className="grid h-10 w-10 place-items-center rounded-full bg-primary font-bold">
                  {t.name.charAt(0)}
                </span>
              )}
              <span className="text-sm font-semibold">{t.name}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
