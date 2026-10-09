"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import Avatar from "@/components/Avatar";

export default function AccountButton() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Tidak tampil saat memuat, di panel admin, dan di halaman akun itu sendiri
  if (status === "loading" || pathname?.startsWith("/admin") || pathname?.startsWith("/akun")) return null;

  const base = "fixed right-3 top-3 z-40 rounded-full border border-primary/40 bg-slate-900/90";

  if (status === "authenticated") {
    return (
      <Link href="/akun" aria-label="Akun saya" className={`${base} p-1`}>
        <Avatar src={session?.user?.image} name={session?.user?.name} size={36} />
      </Link>
    );
  }
  return (
    <button onClick={() => signIn("google")} className={`${base} px-4 py-2 text-sm font-semibold`}>
      Masuk
    </button>
  );
}
