import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    // Get the current session to verify the user
    const session = await getServerSession(authOptions);

    // If no session exists, return unauthorized
    if (!session?.user) {
      return NextResponse.json(
        { message: "You must be logged in to update your profile" },
        { status: 401 }
      );
    }

    // Get the user ID from the session
    const userId = session.user.id;

    // Parse the request body
    const { name } = await request.json();

    // Validate input
    if (typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }

    // Update the user in the database
    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: { name: name.trim() },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    // Return success response
    return NextResponse.json(
      { message: "Profile updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { message: "An error occurred while updating your profile" },
      { status: 500 }
    );
  }
} 