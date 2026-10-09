import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rezaxd-store-kvpk.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    // /wa/ diblokir agar pengalih kontak tidak dirayapi mesin pencari
    rules: { userAgent: "*", allow: "/", disallow: ["/wa/", "/admin", "/api/", "/akun", "/pesanan"] },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
