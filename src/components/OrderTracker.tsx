import { Check } from "lucide-react";
import type { OrderItem } from "@/lib/api";

const STEPS = ["Dipesan", "Dibayar", "Diproses", "Selesai"];

// Jumlah tahap yang sudah selesai untuk tiap status
const DONE_COUNT = { PENDING: 1, PAID: 2, DONE: 4 } as const;

export default function OrderTracker({ status }: { status: OrderItem["status"] }) {
  if (status === "CANCEL") return null;
  const done = DONE_COUNT[status];

  return (
    <ol className="mt-4 flex" aria-label="Tahap pesanan">
      {STEPS.map((label, i) => {
        const complete = i < done;
        const current = i === done; // tahap yang sedang ditunggu
        return (
          <li key={label} className="relative flex flex-1 flex-col items-center text-center">
            {/* Garis penghubung ke tahap berikutnya */}
            {i < STEPS.length - 1 && (
              <span className={`absolute left-1/2 top-3 h-0.5 w-full ${i + 1 < done ? "bg-primary" : "bg-white/10"}`} />
            )}
            <span className={`relative z-10 grid h-6 w-6 place-items-center rounded-full ${
              complete
                ? "bg-primary"
                : current
                ? "animate-pulse border-2 border-amber bg-slate-900 motion-reduce:animate-none"
                : "border border-white/20 bg-slate-900"
            }`}>
              {complete && <Check size={14} />}
            </span>
            <span className={`mt-1.5 text-[11px] ${complete || current ? "text-slate-200" : "text-slate-500"}`}>
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
