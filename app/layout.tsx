import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import AuthProvider from "@/components/SessionProvider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js Auth App",
  description: "Next.js app with authentication",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <AuthProvider session={session}>{children}</AuthProvider>
      </body>
    </html>
  );
}
