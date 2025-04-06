// src/app/api/admin/users/[id]/toggle-admin/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  // Check if user is logged in and is an admin
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const currentUser = await prisma.users.findUnique({
    where: { id: session.user.id },
    select: { isAdmin: true }
  });
  
  if (!currentUser?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  
  try {
    const userId = params.id;
    
    // Get current admin status
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { isAdmin: true }
    });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Toggle admin status
    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: { isAdmin: !user.isAdmin },
      select: { id: true, email: true, isAdmin: true }
    });
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unknown error occurred."},
      { status: 500 }
    );
  }
}