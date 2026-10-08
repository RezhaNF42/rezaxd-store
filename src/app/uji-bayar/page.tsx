"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function UjiBayar() {
  const [msg, setMsg] = useState("");

  async function bayar() {
    setMsg("Memproses...");
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: "wa-7 Hari", contact: "uji coba" }),
    });
    if (res.status === 401) return signIn("google");
    const data = await res.json();
    if (data.redirectUrl) window.location.href = data.redirectUrl;
    else setMsg(data.error ?? "Gagal.");
  }

  return (
    <main className="mx-auto max-w-md px-5 py-24 text-center text-slate-200">
      <h1 className="text-xl font-bold">Uji pembayaran (sementara)</h1>
      <button onClick={bayar} className="mt-6 rounded-xl bg-primary px-6 py-3 font-semibold">
        Bayar Sewa Bot WhatsApp 7 Hari
      </button>
      <p className="mt-4 text-sm text-slate-400">{msg}</p>
    </main>
  );
}
