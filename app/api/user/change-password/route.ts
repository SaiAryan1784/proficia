import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { compare, hash } from "bcrypt";

export async function POST(request: Request) {
  try {
    // Get the current session to verify the user
    const session = await getServerSession(authOptions);

    // If no session exists, return unauthorized
    if (!session?.user) {
      return NextResponse.json(
        { message: "You must be logged in to change your password" },
        { status: 401 }
      );
    }

    // Get the user ID from the session
    const userId = session.user.id;

    // Parse the request body
    const { currentPassword, newPassword } = await request.json();

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "Current password and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { message: "New password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Fetch the user from the database
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { message: "User not found or password not set (social login)" },
        { status: 404 }
      );
    }

    // Verify the current password
    const isValidPassword = await compare(currentPassword, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { message: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await hash(newPassword, 10);

    // Update the user's password
    await prisma.users.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Return success response
    return NextResponse.json(
      { message: "Password changed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json(
      { message: "An error occurred while changing your password" },
      { status: 500 }
    );
  }
} 