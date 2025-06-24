// layout.tsx - Version 2
import type { Metadata } from "next";
import { Syne } from "next/font/google";
import AuthProvider from "@/components/SessionProvider";
import { ThemeProvider } from "@/contexts/ThemeContext";
import "./globals.css";
import RouteLoader from "@/components/RouteLoader";

export const metadata: Metadata = {
  title: "Proficia - AI-Powered Learning Platform",
  description: "Master any subject with AI-generated practice tests. Get instant feedback, track progress, and improve your skills with personalized learning.",
  keywords: "learning, education, practice tests, AI, skills improvement, online learning",
  authors: [{ name: "Proficia Team" }],
  openGraph: {
    title: "Proficia - AI-Powered Learning Platform",
    description: "Master any subject with AI-generated practice tests",
    type: "website",
    siteName: "Proficia",
  },
  twitter: {
    card: "summary_large_image",
    title: "Proficia - AI-Powered Learning Platform",
    description: "Master any subject with AI-generated practice tests",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const syne = Syne({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`min-h-screen ${syne.className}`}>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <AuthProvider>
          <ThemeProvider>
            <RouteLoader />
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
