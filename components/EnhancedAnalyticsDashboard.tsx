"use client";
import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { FaChartLine, FaTrophy, FaClock, FaFire, FaStar } from 'react-icons/fa';

interface AnalyticsData {
  performanceOverTime: Array<{
    date: string;
    score: number;
    testsCount: number;
  }>;
  topicPerformance: Array<{
    topic: string;
    averageScore: number;
    testsCount: number;
    timeSpent: number;
  }>;
  weeklyActivity: Array<{
    day: string;
    tests: number;
    avgScore: number;
  }>;
  recentBadges: Array<{
    name: string;
    icon: string;
    unlockedAt: Date;
  }>;
  stats: {
    totalTests: number;
    averageScore: number;
    totalTimeSpent: number;
    streak: number;
    level: number;
    xp: number;
    completionRate: number;
    improvedTopics: number;
  };
}

interface EnhancedAnalyticsDashboardProps {
  data: AnalyticsData;
  className?: string;
}

export default function EnhancedAnalyticsDashboard({ data, className = "" }: EnhancedAnalyticsDashboardProps) {
  const { performanceOverTime, topicPerformance, weeklyActivity, recentBadges, stats } = data;

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Tests</p>
              <p className="text-2xl font-bold text-foreground">{stats.totalTests}</p>
            </div>
            <FaChartLine className="text-primary text-2xl" />
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Average Score</p>
              <p className="text-2xl font-bold text-foreground">{Math.round(stats.averageScore)}%</p>
            </div>
            <FaTrophy className="text-yellow-500 text-2xl" />
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Time Spent</p>
              <p className="text-2xl font-bold text-foreground">{formatTime(stats.totalTimeSpent)}</p>
            </div>
            <FaClock className="text-secondary text-2xl" />
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
              <p className="text-2xl font-bold text-foreground">{stats.streak} days</p>
            </div>
            <FaFire className="text-orange-500 text-2xl" />
          </div>
        </div>
      </div>

      {/* Performance Over Time */}
      <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Performance Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={performanceOverTime}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="date"
              className="text-sm"
              tick={{ fill: 'currentColor' }}
            />
            <YAxis
              className="text-sm"
              tick={{ fill: 'currentColor' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--foreground)'
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="score"
              stroke="var(--secondary)"
              fill="var(--secondary)"
              fillOpacity={0.1}
              name="Average Score (%)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Topic Performance */}
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Performance by Topic</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topicPerformance} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis type="number" domain={[0, 100]} className="text-sm" />
              <YAxis
                type="category"
                dataKey="topic"
                width={100}
                className="text-sm"
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--foreground)'
                }}
              />
              <Bar dataKey="averageScore" fill="var(--secondary)" name="Average Score %" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Activity */}
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="day" className="text-sm" />
              <YAxis className="text-sm" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--foreground)'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="tests"
                stroke="var(--primary)"
                strokeWidth={2}
                name="Tests Taken"
              />
              <Line
                type="monotone"
                dataKey="avgScore"
                stroke="var(--secondary)"
                strokeWidth={2}
                name="Avg Score %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Achievements */}
      {recentBadges.length > 0 && (
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center">
            <FaStar className="text-yellow-500 mr-2" />
            Recent Achievements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {recentBadges.map((badge, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-muted/30 border border-border rounded-lg"
              >
                <span className="text-2xl">{badge.icon}</span>
                <div>
                  <p className="font-medium text-foreground text-sm">{badge.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {badge.unlockedAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Insights */}
      <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Progress Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-foreground">
              {stats.completionRate}%
            </div>
            <div className="text-sm text-muted-foreground">Completion Rate</div>
          </div>

          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-primary">
              Level {stats.level}
            </div>
            <div className="text-sm text-muted-foreground">{stats.xp.toLocaleString()} XP</div>
          </div>

          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-secondary">
              {stats.improvedTopics}
            </div>
            <div className="text-sm text-muted-foreground">Topics Improved</div>
          </div>
        </div>
      </div>
    </div>
  );
}
