import React from 'react';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import TestHistory from "@/components/TestHistory";
import { StatsOverview, Badge } from "@/components/Gamification";
import { getUserStats } from "@/lib/gamification";
import AccessibilityPanel from "@/components/AccessibilityPanel";

// Helper function to ensure safe numeric values for charts
function safeNumber(value: number | null | undefined, defaultValue: number = 0): number {
  if (value === null || value === undefined || isNaN(value) || !isFinite(value)) {
    return defaultValue;
  }
  return Math.round(value);
}

async function getAnalyticsData(userId: string) {
  try {
    // Get user stats
  const userStats = await getUserStats(userId);
  
  // Get test history
  const tests = await prisma.test.findMany({
    where: {
      userId: userId,
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

  // Calculate performance over time (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const performanceData = tests
    .filter(test => test.completedAt && test.completedAt >= thirtyDaysAgo)
    .reduce((acc: Array<{date: string, score: number, testsCount: number, totalScore: number}>, test) => {
      const date = test.completedAt!.toISOString().split('T')[0];
      const existing = acc.find(item => item.date === date);
      const testScore = safeNumber(test.score);
      
      if (existing) {
        existing.totalScore += testScore;
        existing.testsCount += 1;
        existing.score = safeNumber(existing.totalScore / existing.testsCount);
      } else {
        acc.push({
          date,
          score: testScore,
          testsCount: 1,
          totalScore: testScore
        });
      }
      
      return acc;
    }, [])
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

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

  // Calculate weekly activity
  const weeklyActivity = [];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const now = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dayName = days[date.getDay() === 0 ? 6 : date.getDay() - 1];
    
    const dayTests = tests.filter(test => {
      if (!test.completedAt) return false;
      const testDate = new Date(test.completedAt);
      return testDate.toDateString() === date.toDateString();
    });
    
    const avgScore = dayTests.length > 0 
      ? safeNumber(dayTests.reduce((sum, test) => sum + safeNumber(test.score), 0) / dayTests.length)
      : 0;
    
    weeklyActivity.push({
      day: dayName,
      tests: dayTests.length,
      avgScore
    });
  }

  // Get recent badges (last 5)
  const recentBadges = userStats.badges.slice(0, 5).map(badge => ({
    name: badge.name,
    icon: badge.icon,
    unlockedAt: badge.unlockedAt
  }));

  // Calculate total time spent
  const totalTimeSpent = safeNumber(tests.reduce((sum, test) => sum + safeNumber(test.timeSpent), 0));
  
  // Calculate completion rate (assuming this is percentage of started tests that were completed)
  const allTests = await prisma.test.count({ where: { userId } });
  const completedTests = tests.length;
  const completionRate = allTests > 0 ? safeNumber((completedTests / allTests) * 100) : 100;
  
  // Calculate actual total tests completed (more accurate than userStats.totalTests)
  const actualTotalTests = tests.length;
  
  // Calculate improved topics (topics where latest score > first score)
  const improvedTopics = topicPerformance.filter(topic => {
    if (topic.testsCount < 2) return false;
    const topicTests = tests
      .filter(test => test.topic.name === topic.topic)
      .sort((a, b) => new Date(a.completedAt!).getTime() - new Date(b.completedAt!).getTime());
    
    const firstScore = safeNumber(topicTests[0]?.score);
    const latestScore = safeNumber(topicTests[topicTests.length - 1]?.score);
    return latestScore > firstScore;
  }).length;

  return {
    performanceOverTime: performanceData,
    topicPerformance,
    weeklyActivity,
    recentBadges,
    stats: {
      totalTests: safeNumber(actualTotalTests), // Use actual count instead of userStats.totalTests
      averageScore: safeNumber(userStats.averageScore),
      totalTimeSpent,
      streak: safeNumber(userStats.streak),
      level: safeNumber(userStats.level),
      xp: safeNumber(userStats.xp),
      completionRate,
      improvedTopics: safeNumber(improvedTopics),
    },
    userStats,
    allBadges: userStats.badges
  };
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    
    // Return fallback data to prevent crashes
    return {
      performanceOverTime: [],
      topicPerformance: [],
      weeklyActivity: [
        { day: 'Mon', tests: 0, avgScore: 0 },
        { day: 'Tue', tests: 0, avgScore: 0 },
        { day: 'Wed', tests: 0, avgScore: 0 },
        { day: 'Thu', tests: 0, avgScore: 0 },
        { day: 'Fri', tests: 0, avgScore: 0 },
        { day: 'Sat', tests: 0, avgScore: 0 },
        { day: 'Sun', tests: 0, avgScore: 0 },
      ],
      recentBadges: [],
      stats: {
        totalTests: 0,
        averageScore: 0,
        totalTimeSpent: 0,
        streak: 0,
        level: 1,
        xp: 0,
        completionRate: 0,
        improvedTopics: 0,
      },
      userStats: {
        totalTests: 0,
        averageScore: 0,
        streak: 0,
        level: 1,
        xp: 0,
        badges: []
      },
      allBadges: []
    };
  }
}

export default async function StatisticsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/login");
  }

  const analyticsData = await getAnalyticsData(session.user.id);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Statistics & Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track your learning progress and achievements
            </p>
          </div>

          {/* Gamification Stats Overview */}
          <div className="mb-8">
            <StatsOverview stats={analyticsData.stats} />
          </div>

          {/* Simple Analytics Dashboard */}
          {/* <SimpleAnalyticsDashboard data={analyticsData} /> */}

          {/* Test History Section */}
          <div className="mt-8">
            <TestHistory />
          </div>

          {/* All Badges Section */}
          {analyticsData.allBadges.length > 0 && (
            <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Your Achievements
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {analyticsData.allBadges.map((badge) => (
                  <Badge
                    key={badge.id}
                    name={badge.name}
                    description={badge.description}
                    icon={badge.icon}
                    unlockedAt={badge.unlockedAt}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar with Accessibility Panel */}
        <div className="lg:w-80">
          <AccessibilityPanel />
        </div>
      </div>
    </div>
  );
}