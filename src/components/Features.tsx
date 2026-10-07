import { features } from "@/lib/content";

export default function Features() {
  return (
    <section id="fitur" className="mx-auto max-w-6xl px-5 py-16">
      <h2 className="text-center font-head text-3xl font-bold md:text-4xl">
        Kenapa Pilih <span className="text-gradient">Rezaxd Official</span>?
      </h2>

      {/* 2 kolom di HP, 3 kolom di layar lebar */}
      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
        {features.map((f) => (
          <div key={f.title} className="glass p-4 md:p-6">
            <f.icon className="text-amber" size={26} />
            <h3 className="mt-3 font-head text-base font-semibold md:text-lg">{f.title}</h3>
            <p className="mt-1 text-xs text-slate-400 md:text-sm">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
