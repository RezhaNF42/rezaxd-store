import Link from "next/link";

const items = [
  ["Kebijakan Privasi", "/kebijakan-privasi"],
  ["Syarat Layanan", "/syarat-layanan"],
  ["Kebijakan Refund", "/kebijakan-refund"],
];

export default function LegalLinks() {
  return (
    <p className="mb-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
      {items.map(([l, h]) => <Link key={h} href={h} className="hover:text-cyan">{l}</Link>)}
    </p>
  );
}
