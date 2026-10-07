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
