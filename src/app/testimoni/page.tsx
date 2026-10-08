import type { Metadata } from "next";
import Link from "next/link";
import TestimonialList from "@/components/TestimonialList";

export const metadata: Metadata = {
  title: "Testimoni Pelanggan | Rezaxd Official",
  description: "Ulasan dari pembeli yang pesanannya sudah selesai di Rezaxd Official.",
};

export default function TestimoniPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 pb-28 pt-10">
      <Link href="/" className="text-sm text-slate-400 hover:text-cyan">← Beranda</Link>
      <h1 className="mt-4 text-center font-head text-3xl font-bold md:text-4xl">
        Testimoni <span className="text-gradient">Pelanggan</span>
      </h1>
      <p className="mt-2 text-center text-sm text-slate-400">
        Hanya ditulis oleh pembeli yang pesanannya sudah selesai.
      </p>
      <TestimonialList />
    </main>
  );
}
