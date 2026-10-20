import { Globe, MessageCircle, Send } from "lucide-react";
import type { Source } from "@/lib/buyer";

const META = {
  web: { label: "Website", Icon: Globe, cls: "bg-indigo-500/20 text-indigo-300" },
  whatsapp: { label: "WhatsApp", Icon: MessageCircle, cls: "bg-green-500/20 text-green-300" },
  telegram: { label: "Telegram", Icon: Send, cls: "bg-sky-500/20 text-sky-300" },
} as const;

export default function SourceBadge({ source }: { source: Source }) {
  const { label, Icon, cls } = META[source];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${cls}`}>
      <Icon size={12} aria-hidden="true" /> {label}
    </span>
  );
}
