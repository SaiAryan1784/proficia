// src/app/api/admin/users/update/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  // Check admin permissions
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isAdmin: true }
  });
  
  if (!currentUser?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  
  // Get form data
  const formData = await request.formData();
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const isAdmin = formData.get("isAdmin") === "on";
  
  try {
    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        isAdmin
      }
    });
    
    return NextResponse.json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}