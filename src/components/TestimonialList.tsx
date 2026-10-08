"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Stars from "@/components/Stars";
import { fmtDate, getTestimonials, type TestimonialsResponse } from "@/lib/api";

export default function TestimonialList() {
  const [data, setData] = useState<TestimonialsResponse | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    getTestimonials().then(setData).catch((e: Error) => setErr(e.message));
  }, []);

  if (err) return <p className="mt-10 text-center text-red-400">{err}</p>;

  if (!data)
    return (
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => <div key={i} className="h-36 animate-pulse rounded-2xl bg-white/10" />)}
      </div>
    );

  if (data.count === 0)
    return (
      <div className="mt-10 rounded-2xl border border-primary/30 bg-white/5 p-8 text-center">
        <p className="font-semibold">Belum ada testimoni</p>
        <p className="mt-2 text-sm text-slate-400">
          Testimoni hanya dapat ditulis oleh pembeli yang pesanannya sudah selesai.
        </p>
        <Link href="/#layanan" className="mt-5 inline-block font-semibold text-primary">Lihat layanan →</Link>
      </div>
    );

  return (
    <>
      {/* Ringkasan rating */}
      <div className="mx-auto mt-8 max-w-xs rounded-2xl border border-primary/30 bg-white/5 p-5 text-center">
        <div className="font-head text-4xl font-bold text-amber">{data.average.toFixed(1)}</div>
        <div className="mt-2 flex justify-center"><Stars value={data.average} size={20} /></div>
        <div className="mt-2 text-sm text-slate-400">dari {data.count} testimoni</div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {data.items.map((t) => (
          <figure key={t.id} className="rounded-2xl border border-primary/30 bg-white/5 p-5">
            <Stars value={t.rating} />
            <blockquote className="mt-3 break-words text-sm text-slate-300">“{t.message}”</blockquote>
            <figcaption className="mt-4 text-xs text-slate-400">
              <span className="font-semibold text-slate-200">{t.displayName}</span> · {fmtDate(t.createdAt)}
            </figcaption>
          </figure>
        ))}
      </div>
    </>
  );
}
