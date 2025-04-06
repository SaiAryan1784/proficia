import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hash } from "bcrypt";

// WARNING: This is only for development purposes
// In production, this endpoint should be disabled or protected
export async function POST() {
  try {
    // Only allow in development
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json(
        { error: "This endpoint is only available in development mode" },
        { status: 403 }
      );
    }

    // Check if any user exists
    const userCount = await prisma.users.count();

    if (userCount > 0) {
      return NextResponse.json({
        message: "Users already exist in the database",
        userCount
      });
    }

    // Create a test user
    const hashedPassword = await hash("password123", 10);
    
    const testUser = await prisma.users.create({
      data: {
        name: "Test User",
        email: "test@example.com",
        password: hashedPassword,
        isAdmin: true
      }
    });

    return NextResponse.json({
      success: true,
      message: "Test user created successfully",
      user: {
        id: testUser.id,
        email: testUser.email,
        name: testUser.name
      }
    });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { error: "Failed to set up test user" },
      { status: 500 }
    );
  }
} 