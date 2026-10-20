// Identitas pembeli untuk tampilan admin.
// - WhatsApp nomor biasa (...@s.whatsapp.net): tampilkan nomor, boleh ditautkan ke wa.me
// - WhatsApp LID (...@lid): TIDAK punya nomor telepon; tampilkan ID apa adanya, JANGAN buat tautan
// - Telegram (tg:123): tampilkan ID angka tanpa awalan, tanpa tautan
// - JID mentah tidak ditampilkan di tampilan umum
export type Source = "web" | "whatsapp" | "telegram";

export function toSource(v: unknown): Source {
  const s = String(v ?? "").toLowerCase();
  return s === "whatsapp" || s === "telegram" ? s : "web";
}

export interface Buyer {
  title: string;       // nama pembeli
  kind: string;        // jenis identitas: Email, WhatsApp, ID WhatsApp (LID), Telegram
  id: string | null;   // nilai yang tampil, tanpa akhiran JID atau awalan tg:
  href: string | null; // tautan wa.me, hanya untuk nomor WhatsApp biasa
  raw: string | null;  // nilai mentah, khusus bagian detail teknis (Bagian 2)
}

// Membuang akhiran JID dan awalan tg: dari teks bebas (mis. kolom kontak)
export function stripJid(text: string | null | undefined): string {
  return (text ?? "").replace(/@(s\.whatsapp\.net|lid)\b/gi, "").replace(/\btg:/gi, "").trim();
}

export function parseBuyer(o: {
  source: unknown;
  buyerRef: string | null;
  buyerName: string | null;
  user: { email: string; name: string | null } | null;
}): Buyer {
  const source = toSource(o.source);
  const name = o.buyerName?.trim() || o.user?.name?.trim() || null;
  const ref = o.buyerRef?.trim() || null;

  if (source === "web") {
    return { title: name ?? "-", kind: "Email", id: o.user?.email ?? null, href: null, raw: null };
  }

  const title = name ?? "Tanpa nama";

  if (source === "telegram") {
    const id = ref ? ref.replace(/^tg:/i, "") : "";
    return { title, kind: "Telegram", id: id || null, href: null, raw: ref };
  }

  const m = ref?.match(/^([^@]+)@(s\.whatsapp\.net|lid)$/i);
  if (m && m[2].toLowerCase() === "lid") {
    return { title, kind: "ID WhatsApp (LID)", id: m[1], href: null, raw: ref };
  }
  if (m) {
    const digits = m[1].split(":")[0].replace(/\D/g, "");
    if (digits) return { title, kind: "WhatsApp", id: `+${digits}`, href: `https://wa.me/${digits}`, raw: ref };
  }
  // Format tidak dikenal: tampilkan tanpa tautan
  return { title, kind: "ID WhatsApp", id: ref ? stripJid(ref) || null : null, href: null, raw: ref };
}
