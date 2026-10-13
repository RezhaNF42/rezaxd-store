import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import AdminStats from "@/components/AdminStats";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Angka Beranda | Rezaxd Official",
  robots: { index: false, follow: false },
};

export default async function StatistikPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/api/auth/signin?callbackUrl=/admin/statistik");
  if (!isAdminEmail(session.user.email)) notFound();
  return <AdminStats />;
}
