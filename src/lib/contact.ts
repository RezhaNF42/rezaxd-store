// nomor pembeli bot: hanya angka 6-15 digit; nilai lain diabaikan (tidak menggagalkan pesanan)
export function cleanPhone(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  return /^\d{6,15}$/.test(s) ? s : null;
}

type ContactFields = {
  source: string;
  contact: string;
  buyerPhone: string | null;
  buyerRef: string | null;
};

// kontak untuk admin: pesanan website memakai kontak yang diisi pembeli;
// pesanan bot memakai nomor (buyerPhone) bila ada, jika tidak ID pembeli (buyerRef)
export function displayContact(o: ContactFields): string {
  if (o.source === "web") return o.contact;
  return o.buyerPhone ?? o.buyerRef ?? o.contact;
}
