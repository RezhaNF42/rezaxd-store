import Legal, { type Section } from "@/components/Legal";

export const metadata = { title: "Kebijakan Privasi | Rezaxd Official" };

const sections: Section[] = [
  { h: "1. Tentang kami", p: [
    "Situs ini dikelola oleh Rezaxd Official, penyedia layanan digital berupa sewa bot WhatsApp dan Telegram, panel, serta script bot. Pertanyaan tentang kebijakan ini dapat dikirim ke rezhastore142@gmail.com.",
  ]},
  { h: "2. Data yang kami kumpulkan", p: [
    "Saat Anda masuk dengan Google, kami menerima nama, alamat email, dan foto profil akun Google Anda. Kami tidak menerima kata sandi Google Anda.",
    "Saat Anda memesan, kami menyimpan produk yang dipilih, kontak yang Anda isi, status pesanan, dan status pembayaran.",
    "Jika Anda menulis testimoni, kami menyimpan nama tampilan, rating, dan komentar Anda.",
    "Kami tidak menyimpan nomor kartu atau data rekening Anda. Pembayaran diproses oleh penyedia pembayaran pihak ketiga.",
  ]},
  { h: "3. Cara kami memakai data", p: [
    "Data dipakai untuk membuat dan mengelola akun, memproses dan mengirimkan pesanan, menghubungi Anda terkait pesanan, menampilkan testimoni yang sudah disetujui, serta menjaga keamanan layanan.",
  ]},
  { h: "4. Berbagi data dengan pihak ketiga", p: [
    "Kami tidak menjual data pribadi Anda. Data hanya diproses oleh penyedia layanan yang kami gunakan untuk menjalankan situs: Google (login), Midtrans (pembayaran), Supabase (penyimpanan database), dan Vercel (hosting). Setiap penyedia memiliki kebijakan privasinya sendiri.",
    "Kami juga dapat membuka data bila diwajibkan oleh hukum yang berlaku di Indonesia.",
  ]},
  { h: "5. Testimoni publik", p: [
    "Testimoni yang disetujui akan tampil di situs dengan nama tampilan, rating, komentar, dan tanggal. Alamat email Anda tidak ditampilkan.",
  ]},
  { h: "6. Cookie", p: [
    "Kami memakai cookie sesi yang diperlukan agar Anda tetap masuk setelah login. Kami tidak memakai cookie iklan.",
  ]},
  { h: "7. Penyimpanan dan keamanan", p: [
    "Data disimpan selama akun atau pesanan Anda aktif dan selama diperlukan untuk keperluan layanan dan kewajiban hukum. Kami menerapkan pembatasan akses dan koneksi terenkripsi, namun tidak ada sistem yang sepenuhnya bebas risiko.",
  ]},
  { h: "8. Hak Anda", p: [
    "Anda dapat meminta akses, perbaikan, atau penghapusan data pribadi Anda dengan menghubungi rezhastore142@gmail.com. Kami akan menanggapi sesuai peraturan pelindungan data pribadi yang berlaku di Indonesia.",
  ]},
  { h: "9. Perubahan kebijakan", p: [
    "Kebijakan ini dapat diperbarui sewaktu-waktu. Versi terbaru selalu tersedia di halaman ini beserta tanggal pembaruannya.",
  ]},
];

export default function Page() {
  return <Legal title="Kebijakan Privasi" sections={sections} />;
}
