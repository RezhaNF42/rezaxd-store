import { ImageResponse } from "next/og";
import { iconJsx } from "@/lib/pwa-icon";

export const runtime = "edge";

const ALLOWED = [192, 512];

export function GET(_req: Request, { params }: { params: { size: string } }) {
  const size = Number(params.size);
  if (!ALLOWED.includes(size)) return new Response("Not found", { status: 404 });
  return new ImageResponse(iconJsx(size), {
    width: size,
    height: size,
    headers: { "Cache-Control": "public, max-age=604800, immutable" },
  });
}
