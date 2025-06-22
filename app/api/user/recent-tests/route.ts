import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch recent completed tests for the user
    const recentTests = await prisma.test.findMany({
      where: {
        userId: session.user.id,
        status: "COMPLETED",
      },
      select: {
        id: true,
        title: true,
        score: true,
        completedAt: true,
        timeSpent: true,
        isTimedOut: true,
      },
      orderBy: {
        completedAt: 'desc',
      },
      take: 10, // Get last 10 tests
    });

    // Format the data for the frontend
    const formattedTests = recentTests.map(test => ({
      id: test.id,
      title: test.title,
      score: test.score || 0,
      completedAt: test.completedAt?.toISOString() || '',
      timeSpent: test.timeSpent || 0,
      isTimedOut: test.isTimedOut || false,
    }));

    return NextResponse.json(formattedTests);
  } catch (error) {
    console.error('Error fetching recent tests:', error);
    return NextResponse.json(
      { error: "Failed to fetch recent tests" },
      { status: 500 }
    );
  }
}
