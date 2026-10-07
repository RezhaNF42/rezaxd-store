// Identitas toko. Nomor WhatsApp TIDAK disimpan di sini (ada di env server).
export const STORE = {
  name: "Rezaxd Official - Eva Bot",
  tagline: "Solusi Digital Bot & Panel Terlengkap",
  owner: "RezhaNF",
};

type Target = "owner" | "bot";

// Semua tombol WhatsApp lewat /wa/<owner|bot>, nomor disembunyikan di server
export const waLink = (msg: string, to: Target = "owner") =>
  `/wa/${to}?text=${encodeURIComponent(msg)}`;

export const rupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
