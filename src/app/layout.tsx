import Providers, { HideOnAdmin } from "@/components/Providers";
import type { Metadata } from "next";
import "./globals.css";
import FloatingWA from "@/components/FloatingWA";
import { STORE } from "@/lib/config";

export const metadata: Metadata = {
  title: `${STORE.name} | ${STORE.tagline}`,
  description:
    "Sewa bot WhatsApp & Telegram, panel Pterodactyl, dan script bot siap pakai. Anti banned, garansi aktif, support 24/7.",
  openGraph: { title: STORE.name, description: STORE.tagline, type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        {/* Font dimuat lewat Google Fonts, bukan next/font (butuh SWC) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&family=Space+Grotesk:wght@500;700&display=swap"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
        <HideOnAdmin><FloatingWA /></HideOnAdmin>
      </body>
    </html>
  );
}
