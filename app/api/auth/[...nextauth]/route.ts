// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Create the handler with the authOptions
const handler = NextAuth(authOptions);

// Export the handler as GET and POST
export { handler as GET, handler as POST };