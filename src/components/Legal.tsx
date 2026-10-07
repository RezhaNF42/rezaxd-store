import Link from "next/link";

export type Section = { h: string; p: string[] };

export default function Legal({ title, sections }: { title: string; sections: Section[] }) {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16 text-slate-300">
      <Link href="/" className="text-sm text-slate-400 hover:text-white">
        ← Kembali ke beranda
      </Link>
      <h1 className="mt-6 font-head text-3xl font-bold text-white">{title}</h1>
      <p className="mt-2 text-sm text-slate-400">Terakhir diperbarui: 7 Oktober 2026</p>
      {sections.map((s) => (
        <section key={s.h} className="mt-8">
          <h2 className="text-lg font-semibold text-white">{s.h}</h2>
          {s.p.map((t, i) => (
            <p key={i} className="mt-2 leading-relaxed">{t}</p>
          ))}
        </section>
      ))}
    </main>
  );
}
