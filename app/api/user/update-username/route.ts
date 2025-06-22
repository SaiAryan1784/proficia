import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { username } = await req.json();

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        { error: "Username must be 3-20 characters long and contain only letters, numbers, and underscores" },
        { status: 400 }
      );
    }

    // Check if username is already taken by another user
    const existingUser = await prisma.users.findUnique({
      where: { username: username.toLowerCase() },
      select: { id: true }
    });

    if (existingUser && existingUser.id !== session.user.id) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 409 }
      );
    }

    // Update the username
    const updatedUser = await prisma.users.update({
      where: { id: session.user.id },
      data: { username: username.toLowerCase() },
      select: {
        id: true,
        name: true,
        email: true,
        username: true
      }
    });

    return NextResponse.json({
      message: "Username updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error("Error updating username:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
