import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    // Get session data
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Not authenticated", status: "unauthenticated" },
        { status: 401 }
      );
    }

    // Try to find the user in the database
    const user = await prisma.users.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
        createdAt: true
      }
    });

    // Find all users in the database
    const allUsers = await prisma.users.findMany({
      select: {
        id: true,
        email: true
      }
    });

    // Count total tests
    const totalTests = await prisma.test.count();

    // Count total topics
    const totalTopics = await prisma.topic.count();

    return NextResponse.json({
      session: {
        ...session,
        user: {
          ...session.user,
          // Mask part of the ID for security
          id: session.user.id ? `${session.user.id.substring(0, 5)}...` : null
        }
      },
      databaseUser: user,
      userFound: !!user,
      totalUsers: allUsers.length,
      allUsers: allUsers.map(u => ({
        ...u,
        // Mask part of the ID for security
        id: u.id ? `${u.id.substring(0, 5)}...` : null
      })),
      totalTests,
      totalTopics
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json(
      { error: "Debug error", message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 