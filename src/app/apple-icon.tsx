import { ImageResponse } from "next/og";
import { iconJsx } from "@/lib/pwa-icon";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(iconJsx(180), { ...size });
}
