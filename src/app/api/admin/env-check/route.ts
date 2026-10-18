import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

const val = (k: string) => (process.env[k] ?? "").trim();

function dbInfo(raw: string) {
  if (!raw) return { diatur: false };
  try {
    const u = new URL(raw);
    const pw = decodeURIComponent(u.password);
    return {
      diatur: true,
      protokol: u.protocol.replace(":", ""),
      port: u.port || "(bawaan)",
      pooler: u.hostname.includes("pooler"),
      passwordTerisi: pw.length > 0,
      passwordAdaKurungSiku: /[\[\]]/.test(pw),
      parameterPgbouncer: u.searchParams.get("pgbouncer") === "true",
    };
  } catch {
    return {
      diatur: true,
      formatValid: false,
      catatan: "Alamat tidak bisa dibaca; biasanya karena kata sandi memuat simbol seperti @ atau #.",
    };
  }
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }

  const mid = val("MIDTRANS_SERVER_KEY");
  const jenis = mid.startsWith("SB-Mid-server-")
    ? "sandbox"
    : mid.startsWith("Mid-server-")
    ? "produksi"
    : mid
    ? "tidak dikenal"
    : "kosong";
  const produksi = val("MIDTRANS_IS_PRODUCTION") === "true";

  return NextResponse.json(
    {
      database: dbInfo(val("DATABASE_URL")),
      midtrans: {
        jenisKunciServer: jenis,
        isProduction: produksi,
        pasanganCocok: (jenis === "produksi" && produksi) || (jenis === "sandbox" && !produksi),
      },
      nextauth: {
        url: val("NEXTAUTH_URL") || null,
        secretPanjang: val("NEXTAUTH_SECRET").length,
      },
      google: {
        clientId: !!val("GOOGLE_CLIENT_ID"),
        clientSecret: !!val("GOOGLE_CLIENT_SECRET"),
      },
      admin: { adminEmailTerisi: !!val("ADMIN_EMAIL") },
      resend: { apiKeyTerisi: val("RESEND_API_KEY").startsWith("re_") },
      bot: {
        apiSecretPanjang: val("BOT_API_SECRET").length,
        apiSecretPanjangMentah: (process.env.BOT_API_SECRET ?? "").length,
        apiSecretAdaSpasiAtauKutip: /^\s|\s$|["']/.test(process.env.BOT_API_SECRET ?? ""),
        heartbeatSecretPanjang: val("BOT_HEARTBEAT_SECRET").length,
      },
      frontend: { onlineCheckout: val("NEXT_PUBLIC_ONLINE_CHECKOUT") || null },
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
