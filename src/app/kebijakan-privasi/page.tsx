import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { LEGAL, contactWay, type Section } from "@/lib/legal";

export const metadata: Metadata = {
  title: `Kebijakan Privasi | ${LEGAL.brand}`,
  description: `Cara ${LEGAL.brand} mengumpulkan, memakai, dan menjaga data pribadi pengguna.`,
};

const sections: Section[] = [
  {
    h: "Data yang kami kumpulkan",
    body: [
      "Saat Anda memakai situs ini, kami dapat mengumpulkan data berikut:",
      [
        "Data akun Google: nama, alamat email, dan foto profil dasar saat Anda masuk dengan Google. Kami tidak meminta atau mengakses Gmail, Google Drive, kontak, kalender, atau data Google lainnya.",
        "Data pesanan: produk yang dipesan, nominal pembayaran, status pesanan, waktu pembayaran, dan kontak tujuan layanan (nomor WhatsApp atau username Telegram) yang Anda isi.",
        "Testimoni: nama tampilan, rating, dan komentar yang Anda kirim.",
        "Data teknis: cookie sesi login dan log server standar (misalnya alamat IP, jenis perangkat dan peramban, waktu akses) yang dicatat oleh penyedia hosting.",
      ],
      "Kami tidak menyimpan nomor kartu, kredensial dompet digital, atau detail rekening Anda. Pembayaran diproses oleh Midtrans.",
    ],
  },
  {
    h: "Cara kami menggunakan data",
    body: [
      [
        "Menyediakan akun, riwayat pesanan, dan fitur testimoni.",
        "Memproses pembayaran serta mengaktifkan atau menyerahkan layanan ke kontak tujuan yang Anda isi.",
        "Memberikan dukungan dan garansi.",
        "Menampilkan testimoni yang telah disetujui.",
        "Menjaga keamanan dan mencegah penyalahgunaan.",
        "Memenuhi kewajiban hukum dan pembukuan.",
      ],
      "Kami tidak menjual data pribadi Anda dan tidak memakainya untuk iklan.",
    ],
  },
  {
    h: "Pihak ketiga yang memproses data",
    body: [
      "Untuk menjalankan layanan, data diproses oleh penyedia berikut:",
      [
        "Google: autentikasi saat Anda masuk dengan Google.",
        "Midtrans: pemrosesan pembayaran. Data yang diperlukan untuk transaksi diteruskan ke Midtrans.",
        "Vercel: hosting situs dan log akses.",
        "Supabase: penyimpanan basis data.",
        "Penyedia layanan email: dapat kami pakai untuk notifikasi pesanan kepada pengelola.",
      ],
      "Masing-masing memiliki kebijakan privasi sendiri dan dapat memproses data di luar Indonesia. Kami hanya membagikan data seperlunya, dan dapat mengungkapkannya bila diwajibkan oleh hukum.",
    ],
  },
  {
    h: "Cookie dan penyimpanan lokal",
    body: [
      "Kami memakai cookie sesi agar Anda tetap masuk; tanpanya fitur akun tidak berfungsi. Penyimpanan lokal peramban dipakai untuk preferensi kecil, misalnya menutup banner pemasangan aplikasi. Kami tidak memakai cookie iklan atau pelacak lintas situs. Bila kami menambahkan alat analitik, kebijakan ini akan diperbarui.",
    ],
  },
  {
    h: "Penyimpanan dan keamanan",
    body: [
      "Data disimpan pada basis data dengan kontrol akses, panel admin hanya dapat dibuka oleh akun admin, dan akses situs memakai HTTPS. Tidak ada sistem yang sepenuhnya aman, sehingga kami tidak dapat menjamin keamanan mutlak.",
      "Data pesanan disimpan selama diperlukan untuk layanan, garansi, pembukuan, dan kewajiban hukum. Testimoni yang disetujui tetap tampil sampai Anda meminta penghapusan.",
    ],
  },
  {
    h: "Hak Anda",
    body: [
      "Anda dapat meminta akses, perbaikan, atau penghapusan data pribadi, menarik persetujuan, serta meminta testimoni Anda disembunyikan atau dihapus, sesuai peraturan pelindungan data pribadi yang berlaku di Indonesia, termasuk UU No. 27 Tahun 2022.",
      [
        "Kontak tersimpan dapat diubah atau dihapus sendiri di halaman Akun.",
        "Akses Google dapat dicabut kapan saja lewat pengaturan Akun Google Anda (bagian keamanan, akses aplikasi pihak ketiga).",
        `Untuk permintaan lain, hubungi kami ${contactWay()}.`,
      ],
      "Sebagian catatan transaksi dapat tetap kami simpan bila masih diwajibkan oleh hukum atau diperlukan untuk menyelesaikan sengketa.",
    ],
  },
  {
    h: "Anak-anak",
    body: [
      "Layanan kami tidak ditujukan bagi anak di bawah 18 tahun tanpa persetujuan orang tua atau wali. Kami tidak dengan sengaja mengumpulkan data anak.",
    ],
  },
  {
    h: "Perubahan kebijakan",
    body: [
      "Kami dapat memperbarui kebijakan ini dari waktu ke waktu. Tanggal pembaruan terakhir tercantum di bagian atas halaman. Perubahan yang material akan kami umumkan di situs.",
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
      title="Kebijakan Privasi"
      intro={`${LEGAL.brand} ("kami") adalah toko digital independen yang dikelola oleh ${LEGAL.owner} di ${LEGAL.site}, menyediakan sewa bot WhatsApp dan Telegram, panel server, dan script bot. Kebijakan ini menjelaskan data apa yang kami kumpulkan, untuk apa, dan bagaimana kami menjaganya. Dengan memakai situs ini, Anda menyetujui kebijakan ini.`}
      sections={sections}
    />
  );
}
