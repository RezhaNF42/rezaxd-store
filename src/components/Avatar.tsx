"use client";
import { useState } from "react";

export default function Avatar({ src, name, size = 40 }: { src?: string | null; name?: string | null; size?: number }) {
  const [failed, setFailed] = useState(false);
  const initial = (name ?? "?").trim().charAt(0).toUpperCase() || "?";
  const style = { width: size, height: size };

  if (src && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt="" style={style} loading="lazy"
        referrerPolicy="no-referrer" onError={() => setFailed(true)}
        className="shrink-0 rounded-full object-cover" />
    );
  }
  return (
    <span style={{ ...style, fontSize: size * 0.4 }}
      className="grid shrink-0 place-items-center rounded-full bg-primary font-bold">
      {initial}
    </span>
  );
}
