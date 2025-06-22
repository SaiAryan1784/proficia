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
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tests</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTests}</p>
            </div>
            <FaChartLine className="text-blue-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Score</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{Math.round(stats.averageScore)}%</p>
            </div>
            <FaTrophy className="text-yellow-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Time Spent</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatTime(stats.totalTimeSpent)}</p>
            </div>
            <FaClock className="text-green-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Streak</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.streak} days</p>
            </div>
            <FaFire className="text-red-500 text-2xl" />
          </div>
        </div>
      </div>

      {/* Performance Over Time */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Performance Over Time</h3>
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
                backgroundColor: 'var(--bg-primary)', 
                border: '1px solid var(--border-color)',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.3}
              name="Average Score (%)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Topic Performance */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Performance by Topic</h3>
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
                  backgroundColor: 'var(--bg-primary)', 
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="averageScore" fill="#6366f1" name="Average Score %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Activity */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="day" className="text-sm" />
              <YAxis className="text-sm" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--bg-primary)', 
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="tests" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Tests Taken"
              />
              <Line 
                type="monotone" 
                dataKey="avgScore" 
                stroke="#f59e0b" 
                strokeWidth={2}
                name="Avg Score %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Achievements */}
      {recentBadges.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
            <FaStar className="text-yellow-500 mr-2" />
            Recent Achievements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {recentBadges.map((badge, index) => (
              <div 
                key={index}
                className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
              >
                <span className="text-2xl">{badge.icon}</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{badge.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {badge.unlockedAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Insights */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Progress Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.completionRate}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              Level {stats.level}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{stats.xp.toLocaleString()} XP</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {stats.improvedTopics}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Topics Improved</div>
          </div>
        </div>
      </div>
    </div>
  );
}
