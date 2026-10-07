import { ChevronDown } from "lucide-react";
import { sampleFaqs, type FaqItem } from "@/lib/content";

export default function Faq({ items = sampleFaqs }: { items?: FaqItem[] }) {
  if (!items.length) return null;

  // Data terstruktur agar FAQ bisa tampil di hasil pencarian Google
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <section id="faq" className="mx-auto max-w-3xl px-5 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }}
      />
      <h2 className="text-center font-head text-3xl font-bold md:text-4xl">
        Pertanyaan <span className="text-gradient">Umum</span>
      </h2>

      <div className="mt-8 space-y-3">
        {items.map((f) => (
          <details key={f.id} className="group rounded-2xl border border-primary/30 bg-white/5 p-4 open:border-primary/70">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold [&::-webkit-details-marker]:hidden">
              {f.question}
              <ChevronDown size={18} className="shrink-0 text-cyan transition group-open:rotate-180" />
            </summary>
            <p className="mt-3 text-sm text-slate-300">{f.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
