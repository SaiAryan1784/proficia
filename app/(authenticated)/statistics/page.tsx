import React from 'react';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import TestHistory from "@/components/TestHistory";
import { StatsOverview, Badge } from "@/components/Gamification";
import { getUserStats } from "@/lib/gamification";
import AccessibilityPanel from "@/components/AccessibilityPanel";
import AnalyticsCharts from "@/components/AnalyticsCharts";
import { FaArrowUp, FaArrowDown, FaLightbulb, FaBullseye, FaTrophy } from 'react-icons/fa';

function safeNumber(value: number | null | undefined, defaultValue: number = 0): number {
  if (value === null || value === undefined || isNaN(value) || !isFinite(value)) {
    return defaultValue;
  }
  return Math.round(value);
}

async function getAnalyticsData(userId: string) {
  try {
    const userStats = await getUserStats(userId);

    const tests = await prisma.test.findMany({
      where: { userId: userId, status: "COMPLETED" },
      include: { topic: { select: { name: true, category: true } } },
      orderBy: { completedAt: 'desc' }
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const performanceData = tests
      .filter(test => test.completedAt && test.completedAt >= thirtyDaysAgo)
      .reduce((acc: Array<{ date: string, score: number, testsCount: number, totalScore: number }>, test) => {
        const date = test.completedAt!.toISOString().split('T')[0];
        const existing = acc.find(item => item.date === date);
        const testScore = safeNumber(test.score);

        if (existing) {
          existing.totalScore += testScore;
          existing.testsCount += 1;
          existing.score = safeNumber(existing.totalScore / existing.testsCount);
        } else {
          acc.push({ date, score: testScore, testsCount: 1, totalScore: testScore });
        }
        return acc;
      }, [])
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const topicPerformance = tests.reduce((acc: Array<{ topic: string, averageScore: number, testsCount: number, timeSpent: number, totalScore: number, trend: 'up' | 'down' | 'stable' }>, test) => {
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
          totalScore: testScore,
          trend: 'stable'
        });
      }
      return acc;
    }, []);

    // Calculate trends
    topicPerformance.forEach(topic => {
      const topicTests = tests
        .filter(t => t.topic.name === topic.topic)
        .sort((a, b) => new Date(a.completedAt!).getTime() - new Date(b.completedAt!).getTime());

      if (topicTests.length >= 2) {
        const firstScore = safeNumber(topicTests[0]?.score);
        const latestScore = safeNumber(topicTests[topicTests.length - 1]?.score);
        topic.trend = latestScore > firstScore + 5 ? 'up' : latestScore < firstScore - 5 ? 'down' : 'stable';
      }
    });

    const totalTimeSpent = safeNumber(tests.reduce((sum, test) => sum + safeNumber(test.timeSpent), 0));
    const allTests = await prisma.test.count({ where: { userId } });
    const completedTests = tests.length;
    const completionRate = allTests > 0 ? safeNumber((completedTests / allTests) * 100) : 100;

    // Generate insights
    const weakTopics = topicPerformance.filter(t => t.averageScore < 60).sort((a, b) => a.averageScore - b.averageScore).slice(0, 3);
    const strongTopics = topicPerformance.filter(t => t.averageScore >= 80).sort((a, b) => b.averageScore - a.averageScore).slice(0, 3);
    const improvingTopics = topicPerformance.filter(t => t.trend === 'up').slice(0, 3);

    return {
      performanceOverTime: performanceData,
      topicPerformance: topicPerformance.sort((a, b) => b.averageScore - a.averageScore),
      stats: {
        totalTests: safeNumber(completedTests),
        averageScore: safeNumber(userStats.averageScore),
        totalTimeSpent,
        streak: safeNumber(userStats.streak),
        level: safeNumber(userStats.level),
        xp: safeNumber(userStats.xp),
        completionRate,
        improvedTopics: improvingTopics.length,
      },
      insights: {
        weakTopics,
        strongTopics,
        improvingTopics
      },
      userStats,
      allBadges: userStats.badges
    };
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return {
      performanceOverTime: [],
      topicPerformance: [],
      stats: { totalTests: 0, averageScore: 0, totalTimeSpent: 0, streak: 0, level: 1, xp: 0, completionRate: 0, improvedTopics: 0 },
      insights: { weakTopics: [], strongTopics: [], improvingTopics: [] },
      userStats: { totalTests: 0, averageScore: 0, streak: 0, level: 1, xp: 0, badges: [] },
      allBadges: []
    };
  }
}

export default async function StatisticsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const analyticsData = await getAnalyticsData(session.user.id);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Your Learning Dashboard</h1>
          <p className="text-muted-foreground">Personalized insights to accelerate your progress</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Overview */}
            <StatsOverview stats={analyticsData.stats} />

            {/* Actionable Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Focus Areas */}
              <div className="bg-card p-5 rounded-lg shadow-sm border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <FaBullseye className="text-red-500" />
                  <h3 className="font-semibold text-card-foreground">Focus Areas</h3>
                </div>
                {analyticsData.insights.weakTopics.length > 0 ? (
                  <div className="space-y-2">
                    {analyticsData.insights.weakTopics.map((topic, i) => (
                      <div key={i} className="text-sm">
                        <div className="flex justify-between">
                          <span className="text-foreground font-medium">{topic.topic}</span>
                          <span className="text-destructive">{topic.averageScore}%</span>
                        </div>
                      </div>
                    ))}
                    <p className="text-xs text-muted-foreground mt-3">Practice these to improve your overall score</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Great job! No weak areas detected.</p>
                )}
              </div>

              {/* Strengths */}
              <div className="bg-card p-5 rounded-lg shadow-sm border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <FaTrophy className="text-yellow-500" />
                  <h3 className="font-semibold text-card-foreground">Your Strengths</h3>
                </div>
                {analyticsData.insights.strongTopics.length > 0 ? (
                  <div className="space-y-2">
                    {analyticsData.insights.strongTopics.map((topic, i) => (
                      <div key={i} className="text-sm">
                        <div className="flex justify-between">
                          <span className="text-foreground font-medium">{topic.topic}</span>
                          <span className="text-green-600 dark:text-green-400">{topic.averageScore}%</span>
                        </div>
                      </div>
                    ))}
                    <p className="text-xs text-muted-foreground mt-3">Keep up the excellent work!</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Complete more tests to identify your strengths</p>
                )}
              </div>

              {/* Improving */}
              <div className="bg-card p-5 rounded-lg shadow-sm border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <FaArrowUp className="text-green-500" />
                  <h3 className="font-semibold text-card-foreground">Improving</h3>
                </div>
                {analyticsData.insights.improvingTopics.length > 0 ? (
                  <div className="space-y-2">
                    {analyticsData.insights.improvingTopics.map((topic, i) => (
                      <div key={i} className="text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-foreground font-medium">{topic.topic}</span>
                          <FaArrowUp className="text-green-500 text-xs" />
                        </div>
                      </div>
                    ))}
                    <p className="text-xs text-muted-foreground mt-3">You&apos;re making great progress!</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Take more tests to track improvement</p>
                )}
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <h3 className="text-lg font-semibold mb-4 text-card-foreground">Performance Trend</h3>
                <div className="h-64">
                  {analyticsData.performanceOverTime.length > 0 ? (
                    <AnalyticsCharts
                      performanceData={analyticsData.performanceOverTime}
                      topicData={analyticsData.topicPerformance}
                    />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <FaLightbulb className="text-4xl text-muted-foreground mb-2" />
                      <p className="text-muted-foreground text-sm">Take more tests to see your progress</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <h3 className="text-lg font-semibold mb-4 text-card-foreground">Topic Mastery</h3>
                <div className="space-y-3">
                  {analyticsData.topicPerformance.slice(0, 5).map((topic, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{topic.topic}</span>
                          {topic.trend === 'up' && <FaArrowUp className="text-green-500 text-xs" />}
                          {topic.trend === 'down' && <FaArrowDown className="text-red-500 text-xs" />}
                        </div>
                        <span className="text-muted-foreground">{topic.averageScore}%</span>
                      </div>
                      <div className="w-full bg-secondary/30 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${topic.averageScore >= 80 ? 'bg-green-500' :
                            topic.averageScore >= 60 ? 'bg-yellow-500' : 'bg-destructive'
                            }`}
                          style={{ width: `${topic.averageScore}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  {analyticsData.topicPerformance.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center py-8">
                      <p className="text-muted-foreground text-sm">No topics practiced yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Test History */}
            <TestHistory />

            {/* Achievements */}
            {analyticsData.allBadges.length > 0 && (
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <h3 className="text-lg font-semibold mb-4 text-card-foreground">Achievements</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <AccessibilityPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}