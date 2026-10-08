import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import AdminPanel from "@/components/AdminPanel";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Admin | Rezaxd Official",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/api/auth/signin?callbackUrl=/admin");
  if (!isAdminEmail(session.user.email)) notFound();
  return <AdminPanel />;
}
