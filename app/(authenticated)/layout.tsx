// src/app/admin/layout.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import SideNav from "@/components/SideNav"; // Make sure to update the import

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  // Redirect if not logged in
  if (!session?.user) {
    redirect("/login");
  }
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <SideNav />
      
      {/* Main Content with proper margin */}
      <main className="flex-1 transition-all duration-300 lg:ml-60">
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}