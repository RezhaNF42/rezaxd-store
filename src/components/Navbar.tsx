"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Menu, X } from "lucide-react";
import Avatar from "@/components/Avatar";

// "/#..." agar tautan tetap benar saat dibuka dari halaman lain
const links = [
  { href: "/#layanan", label: "Layanan" },
  { href: "/#kategori", label: "Kategori" },
  { href: "/#fitur", label: "Fitur" },
  { href: "/testimoni", label: "Testimoni" },
  { href: "/#faq", label: "FAQ" },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Tutup menu saat pindah halaman atau menekan Esc
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Panel admin punya tampilan sendiri
  if (pathname?.startsWith("/admin")) return null;

  const user = session?.user;
  const authed = status === "authenticated";
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0F172A]">
      {/* Ketuk di luar menu untuk menutup */}
      {open && <button aria-label="Tutup menu" onClick={close} className="fixed inset-0 -z-10 cursor-default bg-black/50 md:hidden" />}

      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <Link href="/" onClick={close} className="font-head text-lg font-bold">
          <span className="text-gradient">Rezaxd Official</span>
        </Link>

        {/* Layar lebar: tautan sejajar */}
        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-cyan">{l.label}</Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 md:flex">
            {authed && (
              <>
                <Link href="/pesanan" className="text-sm text-slate-300 hover:text-cyan">Pesanan</Link>
                <Link href="/akun" aria-label="Akun saya" className="rounded-full border border-primary/40 p-0.5">
                  <Avatar src={user?.image} name={user?.name} size={32} />
                </Link>
              </>
            )}
            {status === "unauthenticated" && (
              <button onClick={() => signIn("google")}
                className="rounded-full bg-primary px-4 py-1.5 text-sm font-semibold">
                Masuk
              </button>
            )}
          </div>

          {/* HP: tombol menu */}
          <button onClick={() => setOpen(!open)} aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open} aria-controls="mobile-menu"
            className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/5 md:hidden">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" className="border-t border-white/10 bg-[#0F172A] px-5 pb-5 pt-3 md:hidden">
          {authed && (
            <Link href="/akun" onClick={close} className="mb-2 flex items-center gap-3 rounded-xl bg-white/5 p-3">
              <Avatar src={user?.image} name={user?.name} size={40} />
              <span className="min-w-0">
                <span className="block truncate font-semibold">{user?.name}</span>
                <span className="block text-xs text-slate-400">Lihat akun</span>
              </span>
            </Link>
          )}

          <ul className="divide-y divide-white/10">
            {links.map((l) => (
              <li key={l.href}><Link href={l.href} onClick={close} className="block py-3">{l.label}</Link></li>
            ))}
            {authed && <li><Link href="/pesanan" onClick={close} className="block py-3">Pesanan Saya</Link></li>}
          </ul>

          {status === "unauthenticated" && (
            <button onClick={() => { close(); signIn("google"); }}
              className="mt-4 w-full rounded-xl bg-primary py-3 font-semibold">
              Masuk dengan Google
            </button>
          )}
        </nav>
      )}
    </header>
  );
}
