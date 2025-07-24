// layout.tsx - Enhanced with SEO optimizations
import type { Metadata } from "next";
import { Syne } from "next/font/google";
import AuthProvider from "@/components/SessionProvider";
import { ThemeProvider } from "@/contexts/ThemeContext";
import "./globals.css";
import RouteLoader from "@/components/RouteLoader";
import { generateHomeMetadata } from "@/lib/seo";
import { generateOrganizationSchema } from "@/lib/schema";

export const metadata: Metadata = generateHomeMetadata();

const syne = Syne({ 
  subsets: ["latin"],
  display: "swap", // Optimize font loading for better Core Web Vitals
  preload: true
});

// Add structured data for organization
const organizationSchema = generateOrganizationSchema();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Organization Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema)
          }}
        />
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#456cc5" />
        {/* Additional SEO meta tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={`min-h-screen ${syne.className}`}>
        <a href="#main-content" className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-blue-600 text-white px-4 py-2 rounded">
          Skip to main content
        </a>
        <AuthProvider>
          <ThemeProvider>
            <RouteLoader />
            <main id="main-content">
              {children}
            </main>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
