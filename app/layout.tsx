// layout.tsx - Version 2
import type { Metadata } from "next";
import { Syne } from "next/font/google";
import AuthProvider from "@/components/SessionProvider";
import "./globals.css";
import RouteLoader from "@/components/RouteLoader";

export const metadata: Metadata = {
  title: "Proficia",
  description: "A GenAI based test taking app to improve your skills",
};

const syne = Syne({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`min-h-screen bg-gradient-to-r from-[#88aee179] via-[#5838d850] to-[#d8b4fe5a] ${syne.className}`}>
        <AuthProvider>
          <RouteLoader />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
