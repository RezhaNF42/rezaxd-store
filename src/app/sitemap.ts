import type { MetadataRoute } from "next";

// Ganti ke domain sendiri nanti lewat env NEXT_PUBLIC_SITE_URL
const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rezaxd-store-kvpk.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 }];
}
