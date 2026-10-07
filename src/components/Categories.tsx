import { categories } from "@/lib/content";
import { waLink } from "@/lib/config";

export default function Categories() {
  return (
    <section id="kategori" className="mx-auto max-w-6xl px-5 py-16">
      <h2 className="text-center font-head text-3xl font-bold md:text-4xl">
        Kategori <span className="text-gradient">Script Bot</span>
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-center text-slate-400">
        Pilih sesuai kebutuhan bisnis atau komunitas Anda.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((c) => (
          <a
            key={c.title}
            href={waLink(`Halo Kak Rezha, saya tertarik script bot kategori *${c.title}*. Boleh info detailnya?`)}
            target="_blank"
            rel="noreferrer"
            className="glass block p-6"
          >
            <c.icon className="text-cyan" size={30} />
            <h3 className="mt-4 font-head text-lg font-semibold">{c.title}</h3>
            <p className="mt-2 text-sm text-slate-400">{c.desc}</p>
            <span className="mt-4 inline-block text-sm font-semibold text-primary">Tanya script ini →</span>
          </a>
        ))}
      </div>
    </section>
  );
}
