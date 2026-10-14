import Link from "next/link";
import { LEGAL, type Section } from "@/lib/legal";

const pages = [
  ["Kebijakan Privasi", "/kebijakan-privasi"],
  ["Syarat Layanan", "/syarat-layanan"],
  ["Kebijakan Refund", "/kebijakan-refund"],
];

export default function LegalPage({
  title, intro, sections,
}: { title: string; intro: string; sections: Section[] }) {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-28 pt-10">
      <Link href="/" className="text-sm text-slate-400 hover:text-cyan">← Beranda</Link>
      <h1 className="mt-4 font-head text-3xl font-bold">{title}</h1>
      <p className="mt-2 text-xs text-slate-500">Terakhir diperbarui: {LEGAL.updated}</p>
      <p className="mt-6 text-slate-300">{intro}</p>

      {sections.map((s, i) => (
        <section key={s.h} className="mt-8">
          <h2 className="font-head text-xl font-semibold">{i + 1}. {s.h}</h2>
          {s.body.map((b, j) =>
            Array.isArray(b) ? (
              <ul key={j} className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-slate-300">
                {b.map((li) => <li key={li}>{li}</li>)}
              </ul>
            ) : (
              <p key={j} className="mt-3 text-sm leading-relaxed text-slate-300">{b}</p>
            )
          )}
        </section>
      ))}

      <nav className="mt-12 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 pt-6 text-sm text-slate-400">
        {pages.map(([l, h]) => <Link key={h} href={h} className="hover:text-cyan">{l}</Link>)}
      </nav>
    </main>
  );
}
