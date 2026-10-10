"use client";
import { useEffect, useRef, useState } from "react";

// Bagian tetap terlihat di HTML awal. Disembunyikan hanya jika di luar layar,
// lalu muncul halus saat digulir mendekat.
export default function Reveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "hidden" | "shown">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { setState("shown"); return; }

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { setState("shown"); io.disconnect(); }
        else setState((s) => (s === "idle" ? "hidden" : s));
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cls = state === "idle" ? "" : state === "hidden" ? "reveal" : "reveal reveal-in";
  return <div ref={ref} className={cls}>{children}</div>;
}
