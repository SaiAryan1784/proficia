import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import AdminNav from "@/components/AdminNav"; // Ensure this component exists

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get session on the server
  const session = await getServerSession(authOptions);
  
  // Redirect if not logged in
  if (!session?.user) {
    redirect("/login");
  }
  
  // Check if user is admin
  const user = await prisma.users.findUnique({
    where: { id: session.user.id },
    select: { isAdmin: true }
  });
  
  if (!user?.isAdmin) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <AdminNav />
      
      {/* Main Content */}
      <main className="flex-1 transition-all duration-300 lg:ml-60">
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
