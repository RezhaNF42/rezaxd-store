import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export function isAdminEmail(email?: string | null) {
  const admin = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  return !!admin && !!email && email.toLowerCase() === admin;
}

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return isAdminEmail(session?.user?.email) ? session : null;
}
