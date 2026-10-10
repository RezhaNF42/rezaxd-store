"use client";
import { useEffect } from "react";

// Getar singkat (Android Chrome) saat menekan tombol WhatsApp atau elemen bertanda data-haptic
export default function Interactions() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>('a[href^="/wa/"], [data-haptic]');
      if (!el) return;
      try { navigator.vibrate?.(15); } catch {}
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
