import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Rezaxd Official - Eva Bot";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", color: "#fff",
          background: "linear-gradient(160deg, #0F172A, #1E1B4B)",
        }}
      >
        <div style={{ fontSize: 88, fontWeight: 700, color: "#8B5CF6" }}>Rezaxd Official</div>
        <div style={{ fontSize: 36, marginTop: 16 }}>Eva Bot - Solusi Digital Bot dan Panel Terlengkap</div>
      </div>
    ),
    { ...size }
  );
}
