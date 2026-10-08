export interface PublicTestimonial {
  id: string;
  displayName: string;
  rating: number;
  message: string;
  createdAt: string;
}
export interface TestimonialsResponse {
  items: PublicTestimonial[];
  count: number;
  average: number; // 0 jika belum ada testimoni
}
export interface OrderItem {
  id: string;
  status: "PENDING" | "PAID" | "DONE" | "CANCEL";
  createdAt: string;
  product: { name: string; price: number | null };
  testimonial: { id: string } | null;
}

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

export async function getTestimonials(): Promise<TestimonialsResponse> {
  const r = await fetch("/api/testimonials", { cache: "no-store" });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error ?? "Gagal memuat testimoni.");
  return d;
}
