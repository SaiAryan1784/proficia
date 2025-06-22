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
    const { name, username } = await request.json();

    // Validate input
    if (typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: { name: string; username?: string } = { name: name.trim() };

    // If username is provided, validate and check availability
    if (username !== undefined) {
      if (typeof username !== 'string' || username.trim().length < 3) {
        return NextResponse.json(
          { message: "Username must be at least 3 characters long" },
          { status: 400 }
        );
      }

      const cleanUsername = username.toLowerCase().trim();
      
      // Validate username format
      if (!/^[a-z0-9_]+$/.test(cleanUsername)) {
        return NextResponse.json(
          { message: "Username can only contain lowercase letters, numbers, and underscores" },
          { status: 400 }
        );
      }

      // Check if username is already taken by another user
      const existingUser = await prisma.users.findUnique({
        where: { username: cleanUsername },
        select: { id: true }
      });

      if (existingUser && existingUser.id !== userId) {
        return NextResponse.json(
          { message: "Username is already taken" },
          { status: 409 }
        );
      }

      updateData.username = cleanUsername;
    }

    // Update the user in the database
    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        username: true,
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