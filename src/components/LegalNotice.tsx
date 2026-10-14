import Link from "next/link";

export default function LegalNotice() {
  return (
    <p className="mt-3 text-xs text-slate-500">
      Dengan masuk, Anda menyetujui <Link href="/syarat-layanan" className="underline">Syarat Layanan</Link> dan{" "}
      <Link href="/kebijakan-privasi" className="underline">Kebijakan Privasi</Link>.
    </p>
  );
}
