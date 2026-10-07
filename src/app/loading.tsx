export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse px-5 pt-24">
      <div className="mx-auto h-8 w-40 rounded-full bg-white/10" />
      <div className="mx-auto mt-6 h-14 w-3/4 rounded-xl bg-white/10" />
      <div className="mx-auto mt-4 h-5 w-1/2 rounded bg-white/10" />
      <div className="mt-12 grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => <div key={i} className="h-24 rounded-2xl bg-white/10" />)}
      </div>
    </div>
  );
}
