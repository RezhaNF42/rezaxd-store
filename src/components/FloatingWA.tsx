"use client";
import { MessageCircle } from "lucide-react";
import { waLink } from "@/lib/config";

export default function FloatingWA() {
  return (
    <a
      href={waLink("Halo Kak Rezha, saya mau tanya layanan di Rezaxd Official 🙏")}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat WhatsApp"
      className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,.5)] transition hover:scale-110"
    >
      <MessageCircle className="text-white" />
    </a>
  );
}