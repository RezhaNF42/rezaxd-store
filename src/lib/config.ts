// Identitas toko, ubah di sini saja
export const STORE = {
  name: "Rezaxd Official - Eva Bot",
  tagline: "Solusi Digital Bot & Panel Terlengkap",
  owner: "RezhaNF",
  ownerWA: "6285724700472",
  botWA: "62882005784004",
};

// Semua tombol order memakai helper ini: pesan sudah terisi otomatis
export const waLink = (msg: string, to: string = STORE.ownerWA) =>
  `https://wa.me/${to}?text=${encodeURIComponent(msg)}`;

export const rupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);