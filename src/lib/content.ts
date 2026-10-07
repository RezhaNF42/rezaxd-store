import {
  Store, ShieldCheck, CalendarClock, Search,
  Zap, Headphones, BadgeCheck, RefreshCw, Ban, Lock,
  Instagram, Send, Youtube, type LucideIcon,
} from "lucide-react";

export const categories: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Store, title: "Bot Khusus Store", desc: "Katalog, jualan otomatis, dan transaksi tanpa repot balas chat satu per satu." },
  { icon: ShieldCheck, title: "Bot Menjaga Group", desc: "Anti-link, anti-spam, dan welcome message agar grup tetap rapi." },
  { icon: CalendarClock, title: "Bot Kebutuhan Harian", desc: "Pengingat, jadwal, dan alarm yang membantu aktivitas sehari-hari." },
  { icon: Search, title: "Bot Pencari Informasi", desc: "Pencarian, cuaca, berita, dan AI chat langsung dari chat Anda." },
];

export const features: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Zap, title: "Fast Response", desc: "Server cepat, bot membalas dalam hitungan detik." },
  { icon: Headphones, title: "Support 24/7", desc: "Kendala? Chat kapan saja, kami bantu sampai beres." },
  { icon: BadgeCheck, title: "Garansi Aktif", desc: "Ada masalah di masa garansi, kami perbaiki." },
  { icon: RefreshCw, title: "Free Update", desc: "Fitur baru dan perbaikan tanpa biaya tambahan." },
  { icon: Ban, title: "Anti Banned", desc: "Dirancang untuk meminimalkan risiko banned." },
  { icon: Lock, title: "Sistem Aman", desc: "Data Anda dijaga, tanpa akses yang tidak perlu." },
];

// Isi href yang dimiliki. Yang kosong otomatis tidak ditampilkan di footer.
export const socials = [
  { label: "Instagram", icon: Instagram, href: "" },
  { label: "Telegram", icon: Send, href: "" },
  { label: "YouTube", icon: Youtube, href: "" },
];

export interface TestimonialItem {
  id: string;
  name: string;
  rating: number;
  message: string;
  avatar?: string | null;
}
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

// CONTOH FIKTIF: ganti dengan testimoni asli sebelum situs dipromosikan
export const sampleTestimonials: TestimonialItem[] = [
  { id: "t1", name: "Andi", rating: 5, message: "Bot jalan lancar dan responsnya cepat. Admin ramah dan sabar membantu." },
  { id: "t2", name: "Siti", rating: 5, message: "Proses order mudah lewat WhatsApp, langsung aktif tanpa ribet." },
  { id: "t3", name: "Budi", rating: 4, message: "Script-nya rapi dan ada panduan install. Sangat membantu pemula." },
  { id: "t4", name: "Rina", rating: 5, message: "Harga bersahabat, support responsif. Pasti order lagi." },
];

// Sesuaikan jawaban dengan kebijakan toko yang sebenarnya
export const sampleFaqs: FaqItem[] = [
  { id: "f1", question: "Bagaimana cara order?", answer: "Pilih layanan, ketuk tombol Order, lalu Anda diarahkan ke WhatsApp dengan pesan yang sudah terisi. Kirim pesan tersebut dan kami proses secepatnya." },
  { id: "f2", question: "Bagaimana cara pembayarannya?", answer: "Metode pembayaran dikonfirmasi langsung lewat WhatsApp setelah Anda memesan. Layanan diaktifkan setelah pembayaran terkonfirmasi." },
  { id: "f3", question: "Apakah ada garansi dan refund?", answer: "Garansi berlaku selama masa layanan untuk kendala dari sisi kami. Ketentuan refund disampaikan sebelum pembayaran agar jelas bagi kedua pihak." },
  { id: "f4", question: "Bagaimana cara memakai bot?", answer: "Setelah aktif, Anda menerima panduan singkat berisi daftar perintah dan cara memulainya. Jika ada kendala, chat kami kapan saja." },
];
