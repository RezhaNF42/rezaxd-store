"use client";
import { useState } from "react";

export default function AdminNote({ id, initial }: { id: string; initial: string }) {
  const [v, setV] = useState(initial);
  const [msg, setMsg] = useState("");

  async function save() {
    setMsg("Menyimpan...");
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deliveryNote: v }),
    });
    setMsg(res.ok ? "Catatan tersimpan." : "Gagal menyimpan.");
  }

  return (
    <div className="mt-3">
      <label className="block text-sm">
        Catatan serah layanan (dilihat pembeli setelah DONE)
        <textarea
          rows={3}
          maxLength={1000}
          value={v}
          onChange={(e) => setV(e.target.value)}
          className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white"
        />
      </label>
      <button
        onClick={save}
        className="mt-2 rounded-lg border border-white/20 px-3 py-1.5 text-sm"
      >
        Simpan catatan
      </button>
      {msg && <span className="ml-3 text-xs text-yellow-300">{msg}</span>}
    </div>
  );
}
