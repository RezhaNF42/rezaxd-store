import type { Metadata } from "next";
import Link from "next/link";
import OrdersClient from "@/components/OrdersClient";

// Halaman pribadi: jangan diindeks mesin pencari
export const metadata: Metadata = {
  title: "Pesanan Saya | Rezaxd Official",
  robots: { index: false, follow: false },
};

export default function PesananPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 pb-28 pt-10">
      <Link href="/" className="text-sm text-slate-400 hover:text-cyan">← Beranda</Link>
      <h1 className="mt-4 font-head text-3xl font-bold">
        Pesanan <span className="text-gradient">Saya</span>
      </h1>
      <OrdersClient />
    </main>
  );
}
