// Desain ikon: gradien indigo-violet dengan huruf R di zona aman (tahan dipotong bentuk bulat)
export function iconJsx(size: number) {
  return (
    <div
      style={{
        width: "100%", height: "100%", display: "flex",
        alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
        color: "#fff", fontSize: size * 0.5, fontWeight: 700,
      }}
    >
      R
    </div>
  );
}
