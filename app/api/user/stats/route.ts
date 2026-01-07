import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getUserStats } from "@/lib/gamification";
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

    // Get user stats using the gamification function
    const userStats = await getUserStats(session.user.id);

    // Get actual completed tests count from database for accuracy
    const actualCompletedTests = await prisma.test.count({
      where: {
        userId: session.user.id,
        status: "COMPLETED"
      }
    });

    // Calculate start of the current week (Sunday)
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);

    // Get tests completed this week
    const testsThisWeek = await prisma.test.count({
      where: {
        userId: session.user.id,
        status: "COMPLETED",
        completedAt: {
          gte: startOfWeek
        }
      }
    });

    // Return stats with corrected totalTests count and new testsThisWeek
    return NextResponse.json({
      ...userStats,
      totalTests: actualCompletedTests, // Override with actual count
      testsThisWeek
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { error: "Failed to fetch user stats" },
      { status: 500 }
    );
  }
}
