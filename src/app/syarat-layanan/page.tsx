import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { LEGAL, contactWay, type Section } from "@/lib/legal";

export const metadata: Metadata = {
  title: `Syarat Layanan | ${LEGAL.brand}`,
  description: `Syarat dan ketentuan memakai layanan dan memesan di ${LEGAL.brand}.`,
};

const sections: Section[] = [
  {
    h: "Layanan kami",
    body: [
      [
        "Sewa bot WhatsApp dan Telegram dengan pilihan durasi sesuai paket (misalnya 7 hari, 30 hari, 90 hari, atau Lifetime).",
        "Panel server (Pterodactyl) dengan spesifikasi dan harga sesuai permintaan.",
        "Script bot WhatsApp dan Telegram berupa berkas kode sumber.",
      ],
      "Rincian, fitur, dan harga tampil di halaman Layanan dan dapat berubah sewaktu-waktu. Harga yang berlaku adalah harga saat pesanan dibuat.",
      "Paket Lifetime berarti masa sewa tanpa batas waktu selama layanan bot tersebut masih kami operasikan. Bila layanan akan dihentikan, kami memberi pemberitahuan terlebih dahulu.",
    ],
  },
  {
    h: "Akun",
    body: [
      "Anda masuk menggunakan akun Google. Anda bertanggung jawab atas akun Anda dan atas kebenaran data kontak yang Anda berikan. Kami berhak menangguhkan akun yang menyalahgunakan layanan.",
    ],
  },
  {
    h: "Pemesanan dan pembayaran",
    body: [
      "Pesanan dapat dibuat melalui pembayaran online di situs atau melalui WhatsApp. Pembayaran online diproses oleh Midtrans dengan metode yang tersedia di halaman pembayaran. Semua harga dalam Rupiah.",
      "Pesanan dianggap sah setelah pembayaran terkonfirmasi. Pesanan yang tidak dibayar dalam batas waktu pembayaran akan kedaluwarsa dan dibatalkan otomatis.",
    ],
  },
  {
    h: "Aktivasi dan penyerahan layanan",
    body: [
      `Layanan diaktifkan atau diserahkan secara manual ke kontak tujuan yang Anda isi, umumnya dalam ${LEGAL.activationHours} jam setelah pembayaran terkonfirmasi. Ini adalah perkiraan, bukan jaminan, dan dapat lebih lama di luar jam operasional.`,
      "Anda bertanggung jawab atas kebenaran kontak tujuan. Kesalahan kontak dari sisi Anda dapat menunda atau menggagalkan penyerahan. Status pesanan dapat dilihat di halaman Pesanan Saya.",
    ],
  },
  {
    h: "Penggunaan yang dilarang",
    body: [
      "Anda dilarang memakai layanan untuk:",
      [
        "mengirim pesan massal atau spam tanpa persetujuan penerima;",
        "penipuan, konten ilegal, pelecehan, atau pelanggaran hak pihak lain;",
        "melanggar ketentuan WhatsApp, Telegram, atau penyedia layanan lain yang terkait;",
        "menjual ulang atau membagikan script tanpa izin tertulis dari kami;",
        "mengganggu, merusak, atau mencoba mengakses sistem kami secara tidak sah.",
      ],
      "Pelanggaran dapat berakibat penghentian layanan tanpa pengembalian dana.",
    ],
  },
  {
    h: "Platform pihak ketiga dan risiko",
    body: [
      "Bot bekerja di atas WhatsApp dan Telegram, yang aturannya dapat berubah sewaktu-waktu. Fitur anti banned berarti upaya mengurangi risiko pembatasan akun, bukan jaminan. Pembatasan atau pemblokiran nomor dan akun oleh platform sebagian besar berada di luar kendali kami. Kami menyarankan memakai nomor khusus untuk bot.",
    ],
  },
  {
    h: "Garansi dan dukungan",
    body: [
      "Garansi berlaku selama masa layanan untuk kendala dari sisi kami, misalnya bot tidak berfungsi karena kesalahan sistem kami. Bentuk garansi adalah perbaikan atau penggantian layanan.",
      "Garansi tidak mencakup penyalahgunaan, perubahan yang Anda lakukan sendiri, atau pembatasan oleh platform pihak ketiga.",
      `Dukungan tersedia ${contactWay()}. Waktu respons dapat bervariasi.`,
    ],
  },
  {
    h: "Script bot",
    body: [
      "Pembelian script memberi Anda lisensi penggunaan pribadi yang tidak eksklusif. Hak cipta tetap pada kami. Pembaruan gratis diberikan sesuai yang kami umumkan untuk paket tersebut.",
    ],
  },
  {
    h: "Testimoni",
    body: [
      "Testimoni hanya dapat ditulis oleh pembeli yang pesanannya telah selesai dan ditampilkan setelah moderasi. Kami berhak menolak atau menyembunyikan testimoni yang tidak pantas atau melanggar hukum. Dengan mengirim testimoni, Anda mengizinkan penayangan nama tampilan, rating, dan komentar Anda di situs.",
    ],
  },
  {
    h: "Batasan tanggung jawab",
    body: [
      "Sepanjang diizinkan hukum, tanggung jawab kami terbatas pada nilai yang Anda bayarkan untuk pesanan terkait. Kami tidak bertanggung jawab atas kerugian tidak langsung, gangguan akibat pihak ketiga (WhatsApp, Telegram, penyedia internet atau hosting), maupun keadaan di luar kendali kami.",
      "Ketentuan ini tidak mengurangi hak Anda sebagai konsumen berdasarkan peraturan perundang-undangan yang berlaku.",
    ],
  },
  {
    h: "Perubahan layanan dan syarat",
    body: [
      "Kami dapat mengubah layanan atau syarat ini. Perubahan berlaku sejak dipublikasikan. Pesanan yang sudah dibayar tetap tunduk pada syarat yang berlaku saat pesanan dibuat.",
    ],
  },
  {
    h: "Hukum yang berlaku dan kontak",
    body: [
      "Syarat ini tunduk pada hukum Republik Indonesia. Sengketa diupayakan diselesaikan secara musyawarah terlebih dahulu.",
      `Pertanyaan dapat disampaikan ${contactWay()}. Pengelola: ${LEGAL.owner} (${LEGAL.brand}).`,
    ],
  },
];

export default function Page() {
  return (
    <LegalPage
      title="Syarat Layanan"
      intro={`Dengan mengakses atau memesan di ${LEGAL.site}, Anda menyetujui syarat berikut. Mohon dibaca sebelum memesan. Syarat ini berlaku bersama Kebijakan Privasi dan Kebijakan Refund kami.`}
      sections={sections}
    />
  );
}
