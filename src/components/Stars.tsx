import { Star } from "lucide-react";

export default function Stars({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <div className="flex gap-1" role="img" aria-label={`Rating ${value} dari 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} className={i < Math.round(value) ? "fill-amber text-amber" : "text-slate-600"} />
      ))}
    </div>
  );
}
