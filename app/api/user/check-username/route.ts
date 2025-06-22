import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const usernameRegex = /^[a-z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        { 
          available: false, 
          error: "Username must be 3-20 characters long and contain only lowercase letters, numbers, and underscores" 
        },
        { status: 400 }
      );
    }

    const existingUser = await prisma.users.findUnique({
      where: { username: username.toLowerCase() },
      select: { id: true }
    });

    return NextResponse.json({
      available: !existingUser,
      message: existingUser ? "Username is already taken" : "Username is available"
    });

  } catch (error) {
    console.error("Error checking username:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
