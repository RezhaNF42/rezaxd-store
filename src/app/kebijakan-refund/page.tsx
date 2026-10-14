import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { LEGAL, contactWay, type Section } from "@/lib/legal";

export const metadata: Metadata = {
  title: `Kebijakan Refund | ${LEGAL.brand}`,
  description: `Ketentuan pembatalan pesanan dan pengembalian dana di ${LEGAL.brand}.`,
};

const sections: Section[] = [
  {
    h: "Sebelum pembayaran",
    body: [
      "Pesanan yang belum dibayar dapat dibatalkan tanpa biaya. Pesanan yang tidak dibayar dalam batas waktu pembayaran kedaluwarsa dan dibatalkan otomatis.",
    ],
  },
  {
    h: "Dana dapat dikembalikan jika",
    body: [
      [
        "layanan tidak dapat kami aktifkan atau serahkan setelah pembayaran terkonfirmasi;",
        "terjadi pembayaran ganda untuk pesanan yang sama;",
        "berkas script yang Anda terima rusak atau tidak sesuai deskripsi dan tidak dapat kami perbaiki;",
        "layanan tidak berfungsi karena kesalahan kami dan tidak dapat diperbaiki dalam waktu wajar.",
      ],
      "Untuk kendala yang dapat diperbaiki, kami memprioritaskan perbaikan atau penggantian layanan. Pengembalian dana diberikan bila perbaikan tidak memungkinkan.",
    ],
  },
  {
    h: "Dana tidak dapat dikembalikan jika",
    body: [
      [
        "layanan sudah aktif dan digunakan, dan alasan pengajuan adalah berubah pikiran atau salah memilih paket;",
        "terjadi pembatasan atau pemblokiran nomor atau akun oleh WhatsApp atau Telegram akibat cara penggunaan Anda;",
        "terjadi pelanggaran Syarat Layanan;",
        "script sudah diserahkan dan berfungsi sesuai deskripsi;",
        "kendala disebabkan kesalahan kontak tujuan dari sisi Anda (kami tetap berupaya membantu aktivasi ulang).",
      ],
      "Kebijakan ini tidak mengurangi hak Anda berdasarkan peraturan perlindungan konsumen yang berlaku.",
    ],
  },
  {
    h: "Cara mengajukan",
    body: [
      `Hubungi kami ${contactWay()} dalam ${LEGAL.claimDays} hari sejak layanan aktif (atau sejak pembayaran bila layanan belum aktif). Sertakan ID pesanan dari halaman Pesanan Saya, penjelasan singkat, dan tangkapan layar bila ada.`,
    ],
  },
  {
    h: "Proses pengembalian dana",
    body: [
      `Kami meninjau pengajuan dan memberi jawaban. Bila disetujui, dana dikembalikan ke metode pembayaran asal atau cara lain yang disepakati, selambat-lambatnya ${LEGAL.refundDays} hari kerja sejak disetujui. Waktu dana masuk bergantung pada bank atau penyedia dompet digital Anda.`,
    ],
  },
  {
    h: "Kontak",
    body: [
      `Pertanyaan tentang kebijakan ini dapat disampaikan ${contactWay()}. Pengelola: ${LEGAL.owner} (${LEGAL.brand}).`,
    ],
  },
];

export default function Page() {
  return (
    <LegalPage
      title="Kebijakan Refund"
      intro={`Kebijakan ini menjelaskan kapan pesanan dapat dibatalkan dan dana dikembalikan di ${LEGAL.brand}. Pembayaran online diproses oleh Midtrans.`}
      sections={sections}
    />
  );
}
