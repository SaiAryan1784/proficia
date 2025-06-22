// src/app/api/register/route.ts
import { NextResponse } from "next/server";
import { createUser } from "@/lib/utils";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { name, username, email, password } = await request.json();

    // Validate required fields
    if (!username || !email || !password || !name) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate username format
    if (username.length < 3 || !/^[a-z0-9_]+$/.test(username)) {
      return NextResponse.json(
        { message: "Username must be at least 3 characters and contain only lowercase letters, numbers, and underscores" },
        { status: 400 }
      );
    }

    // Check if user already exists (email or username)
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json(
          { message: "User with this email already exists" },
          { status: 400 }
        );
      }
      if (existingUser.username === username) {
        return NextResponse.json(
          { message: "Username is already taken" },
          { status: 400 }
        );
      }
    }

    // Create new user
    await createUser(email, password, name, username);

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error},
      { status: 500 }
    );
  }
}