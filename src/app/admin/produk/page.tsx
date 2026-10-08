import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import AdminProducts from "@/components/AdminProducts";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Kelola Produk | Rezaxd Official",
  robots: { index: false, follow: false },
};

export default async function ProdukAdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/api/auth/signin?callbackUrl=/admin/produk");
  if (!isAdminEmail(session.user.email)) notFound();
  return <AdminProducts />;
}
