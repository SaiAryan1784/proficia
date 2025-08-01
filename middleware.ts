// src/middleware.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname;
  
  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  // Handle authenticated routes
  if (path.startsWith("/authenticated") || path === "/dashboard" || path === "/profile" || path === "/statistics" || path === "/practice") {
    // Redirect to login if not authenticated
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    
    // Skip username check for setup-username page
    if (path === "/setup-username") {
      return NextResponse.next();
    }
    
    // Check if user has username (for Google sign-in users)
    if (!session.username) {
      return NextResponse.redirect(new URL("/setup-username", request.url));
    }
  }
  
  // Handle admin routes
  if (path.startsWith("/admin")) {
    // Redirect to login if not authenticated
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    
    // Check if user has username first
    if (!session.username) {
      return NextResponse.redirect(new URL("/setup-username", request.url));
    }
    
    // Check if user is admin (this will be validated server-side in the layout)
    // The middleware just ensures authentication, the layout handles admin verification
  }
  
  // Allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/authenticated/:path*", 
    "/dashboard",
    "/profile", 
    "/statistics", 
    "/practice",
    "/setup-username"
  ]
};