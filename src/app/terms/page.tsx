import Legal, { type Section } from "@/components/Legal";

export const metadata = { title: "Syarat Layanan | Rezaxd Official" };

const sections: Section[] = [
  { h: "1. Penerimaan syarat", p: [
    "Dengan menggunakan situs dan layanan Rezaxd Official, Anda menyetujui syarat berikut. Jika tidak setuju, mohon tidak menggunakan layanan ini.",
  ]},
  { h: "2. Layanan", p: [
    "Kami menyediakan sewa bot WhatsApp dan Telegram, panel, serta script bot. Rincian, harga, dan masa aktif setiap produk tertera pada halaman produk dan dapat berubah sewaktu-waktu.",
  ]},
  { h: "3. Akun", p: [
    "Anda masuk menggunakan akun Google dan bertanggung jawab atas keamanan akun tersebut serta atas informasi yang Anda berikan saat memesan.",
  ]},
  { h: "4. Pesanan dan pembayaran", p: [
    "Pesanan dianggap berhasil setelah pembayaran terkonfirmasi. Pembayaran diproses melalui penyedia pembayaran pihak ketiga. Kami berhak menolak atau membatalkan pesanan yang mencurigakan atau salah harga, dengan pengembalian dana bila pembayaran sudah diterima.",
  ]},
  { h: "5. Garansi dan pengembalian dana", p: [
    "Garansi dan pengembalian dana mengikuti ketentuan yang tercantum pada produk atau yang disepakati saat pemesanan. Karena produk bersifat digital, pengembalian dana setelah layanan aktif ditentukan secara kasus per kasus.",
  ]},
  { h: "6. Penggunaan yang dilarang", p: [
    "Layanan tidak boleh dipakai untuk kegiatan melanggar hukum, penipuan, spam, pelecehan, atau pelanggaran syarat platform WhatsApp dan Telegram. Pelanggaran dapat mengakibatkan layanan dihentikan tanpa pengembalian dana.",
  ]},
  { h: "7. Batasan tanggung jawab", p: [
    "Layanan disediakan sebagaimana adanya. Kami tidak dapat menjamin akun pada platform pihak ketiga bebas dari pembatasan oleh platform tersebut. Tanggung jawab kami terbatas pada nilai pesanan yang bersangkutan, sejauh diizinkan hukum.",
  ]},
  { h: "8. Testimoni", p: [
    "Testimoni hanya dapat dibuat oleh pembeli dengan pesanan berhasil dan dapat ditinjau sebelum ditampilkan. Kami berhak menolak testimoni yang mengandung spam, ujaran kasar, atau data pribadi.",
  ]},
  { h: "9. Hukum yang berlaku", p: [
    "Syarat ini tunduk pada hukum Republik Indonesia.",
  ]},
  { h: "10. Kontak", p: [
    "Pertanyaan tentang syarat ini dapat dikirim ke rezhastore142@gmail.com.",
  ]},
];

export default function Page() {
  return <Legal title="Syarat Layanan" sections={sections} />;
}
