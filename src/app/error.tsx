"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-md px-5 pt-32 text-center">
      <h2 className="font-head text-2xl font-bold">Terjadi kendala</h2>
      <p className="mt-2 text-slate-400">Halaman gagal dimuat. Silakan coba lagi.</p>
      <button onClick={reset} className="mt-6 rounded-xl bg-primary px-6 py-2.5 font-semibold">
        Muat ulang
      </button>
    </div>
  );
}
