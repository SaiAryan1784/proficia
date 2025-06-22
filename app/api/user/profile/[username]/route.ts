import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserStats } from "@/lib/gamification";

// Helper function to ensure safe numeric values
function safeNumber(value: number | null | undefined, defaultValue: number = 0): number {
  if (value === null || value === undefined || isNaN(value) || !isFinite(value)) {
    return defaultValue;
  }
  return Math.round(value);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const cleanUsername = username.toLowerCase();

    // Find user by username
    const user = await prisma.users.findUnique({
      where: { username: cleanUsername },
      select: {
        id: true,
        name: true,
        username: true,
        createdAt: true,
        xp: true,
        level: true,
        streak: true,
        totalTests: true,
        averageScore: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get user stats including badges
    const userStats = await getUserStats(user.id);

    // Get completed tests for additional stats
    const tests = await prisma.test.findMany({
      where: {
        userId: user.id,
        status: "COMPLETED"
      },
      include: {
        topic: {
          select: {
            name: true,
            category: true
          }
        }
      },
      orderBy: {
        completedAt: 'desc'
      }
    });

    // Calculate topic performance
    const topicPerformance = tests.reduce((acc: Array<{topic: string, averageScore: number, testsCount: number, timeSpent: number, totalScore: number}>, test) => {
      const topicName = test.topic.name;
      const existing = acc.find(item => item.topic === topicName);
      const testScore = safeNumber(test.score);
      const testTimeSpent = safeNumber(test.timeSpent);
      
      if (existing) {
        existing.totalScore += testScore;
        existing.testsCount += 1;
        existing.timeSpent += testTimeSpent;
        existing.averageScore = safeNumber(existing.totalScore / existing.testsCount);
      } else {
        acc.push({
          topic: topicName,
          averageScore: testScore,
          testsCount: 1,
          timeSpent: testTimeSpent,
          totalScore: testScore
        });
      }
      
      return acc;
    }, []);

    // Calculate total time spent
    const totalTimeSpent = safeNumber(tests.reduce((sum, test) => sum + safeNumber(test.timeSpent), 0));
    
    // Calculate completion rate
    const allTests = await prisma.test.count({ where: { userId: user.id } });
    const completedTests = tests.length;
    const completionRate = allTests > 0 ? safeNumber((completedTests / allTests) * 100) : 100;
    
    // Calculate improved topics
    const improvedTopics = topicPerformance.filter(topic => {
      if (topic.testsCount < 2) return false;
      const topicTests = tests
        .filter(test => test.topic.name === topic.topic)
        .sort((a, b) => new Date(a.completedAt!).getTime() - new Date(b.completedAt!).getTime());
      
      const firstScore = safeNumber(topicTests[0]?.score);
      const latestScore = safeNumber(topicTests[topicTests.length - 1]?.score);
      return latestScore > firstScore;
    }).length;

    // Get recent achievements (last 5 badges)
    const recentBadges = userStats.badges.slice(0, 5).map(badge => ({
      name: badge.name,
      icon: badge.icon,
      description: badge.description,
      unlockedAt: badge.unlockedAt
    }));

    const publicProfile = {
      user: {
        name: user.name,
        username: user.username,
        joinedAt: user.createdAt,
        level: safeNumber(user.level),
        xp: safeNumber(user.xp),
        streak: safeNumber(user.streak)
      },
      stats: {
        totalTests: safeNumber(completedTests),
        averageScore: safeNumber(user.averageScore),
        totalTimeSpent,
        completionRate,
        improvedTopics: safeNumber(improvedTopics),
        level: safeNumber(user.level),
        xp: safeNumber(user.xp),
        streak: safeNumber(user.streak)
      },
      topicPerformance,
      recentBadges,
      totalBadges: userStats.badges.length,
      allBadges: userStats.badges
    };

    return NextResponse.json(publicProfile);

  } catch (error) {
    console.error("Error fetching public profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
