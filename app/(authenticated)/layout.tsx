// src/app/admin/layout.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { TopNav } from "@/components/TopNav";

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
    <div className="flex min-h-screen flex-col bg-background transition-colors duration-200">
      {/* Top Navigation */}
      <TopNav />

      {/* Main Content */}
      <main className="flex-1 w-full">
        <div className="container mx-auto px-4 py-4">
          {children}
        </div>
      </main>
    </div>
  );
}