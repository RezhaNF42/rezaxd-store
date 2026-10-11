import { ImageResponse } from "next/og";
import { iconJsx } from "@/lib/pwa-icon";

export const runtime = "edge";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(iconJsx(64), { ...size });
}
