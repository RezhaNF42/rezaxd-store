// Satu tempat untuk mengubah identitas dan angka yang dipakai di halaman hukum
export const LEGAL = {
  brand: "Rezaxd Official",
  owner: "RezhaNF",
  site: "rezaxd-store-kvpk.vercel.app", // ganti setelah memakai domain sendiri
  updated: "14 Oktober 2026",
  // Opsional: isi NEXT_PUBLIC_CONTACT_EMAIL di Vercel untuk menampilkan email resmi
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  activationHours: 24, // perkiraan waktu aktivasi setelah pembayaran terkonfirmasi
  claimDays: 3,        // batas waktu mengajukan kendala atau pengembalian dana
  refundDays: 14,      // batas hari kerja pengembalian dana setelah disetujui
};

export type Block = string | string[]; // string = paragraf, string[] = daftar poin
export interface Section { h: string; body: Block[] }

export function contactWay(): string {
  return LEGAL.email
    ? `melalui email ${LEGAL.email} atau menu "Hubungi Kami" (tombol WhatsApp di situs ini)`
    : `melalui menu "Hubungi Kami" (tombol WhatsApp di pojok kanan bawah situs ini)`;
}
