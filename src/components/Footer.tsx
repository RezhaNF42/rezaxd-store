import { STORE, waLink } from "@/lib/config";
import { socials } from "@/lib/content";

const nav = [
  ["Layanan", "#layanan"],
  ["Kategori", "#kategori"],
  ["Fitur", "#fitur"],
  ["FAQ", "#faq"],
];

const btn = "glass block px-4 py-2.5 text-center text-sm font-semibold";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-white/10 bg-black/20">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-3">
        <div>
          <div className="font-head text-xl font-bold">
            <span className="text-gradient">Rezaxd Official</span>
          </div>
          <p className="mt-2 text-sm text-slate-400">{STORE.tagline}</p>
        </div>

        <div>
          <h4 className="font-semibold">Navigasi</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            {nav.map(([l, h]) => (
              <li key={h}><a href={h} className="hover:text-cyan">{l}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold">Kontak</h4>
          <div className="mt-3 space-y-3">
            <a className={btn} target="_blank" rel="nofollow noopener"
               href={waLink("Halo Kak Rezha, saya mau tanya layanan 🙏", "owner")}>
              Chat Owner ({STORE.owner})
            </a>
            <a className={btn} target="_blank" rel="nofollow noopener"
               href={waLink("Halo Eva Bot, saya mau tanya layanan 🙏", "bot")}>
              Chat Eva Bot
            </a>
          </div>

          <div className="mt-4 flex gap-3">
            {socials.filter((s) => s.href).map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                 aria-label={s.label} className="glass grid h-10 w-10 place-items-center">
                <s.icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-5 pb-24 pt-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Rezaxd Official. All rights reserved.
      </div>
    </footer>
  );
}
