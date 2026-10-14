export async function notifyAdmin(subject: string, text: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const to = (process.env.ADMIN_EMAIL ?? "").trim();
  if (!key || !to) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM ?? "Rezaxd Official <onboarding@resend.dev>",
        to: [to],
        subject,
        text,
      }),
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) console.error("notifyAdmin gagal, status", res.status);
    return res.ok;
  } catch (e) {
    console.error("notifyAdmin error", e);
    return false;
  }
}
