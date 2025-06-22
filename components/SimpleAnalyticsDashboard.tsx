"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { FaChartLine, FaTrophy, FaClock, FaFire, FaStar, FaBook, FaBullseye } from 'react-icons/fa';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

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

interface SimpleAnalyticsDashboardProps {
  data: AnalyticsData;
}

// StatCard component moved outside to avoid re-creation on each render
const StatCard = ({ icon, title, value, subtitle, color }: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  color: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <motion.p 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 10,
              delay: 0.3
            }}
            className="text-3xl font-bold text-gray-900 dark:text-white"
          >
            {value}
          </motion.p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`text-3xl ${color}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

const SimpleAnalyticsDashboard: React.FC<SimpleAnalyticsDashboardProps> = ({ data }) => {
  const { performanceOverTime, topicPerformance, weeklyActivity, recentBadges, stats } = data;
  
  // Dark mode detection hook
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    
    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  // Animation variants with proper typing
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  // Chart configurations
  const performanceChartData = {
    labels: performanceOverTime.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Average Score',
        data: performanceOverTime.map(item => Math.round(item.score || 0)),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const topicChartData = {
    labels: topicPerformance.slice(0, 5).map(item => item.topic),
    datasets: [
      {
        label: 'Average Score',
        data: topicPerformance.slice(0, 5).map(item => Math.round(item.averageScore || 0)),
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderColor: [
          'rgb(99, 102, 241)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(139, 92, 246)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const weeklyChartData = {
    labels: weeklyActivity.map(item => item.day),
    datasets: [
      {
        label: 'Tests Taken',
        data: weeklyActivity.map(item => item.tests),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
      },
    ],
  };

  // Chart configurations with dark mode support
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDark ? 'rgb(209, 213, 219)' : 'rgb(75, 85, 99)',
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: isDark ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)',
        },
        grid: {
          color: isDark ? 'rgba(75, 85, 99, 0.2)' : 'rgba(107, 114, 128, 0.1)',
        },
      },
      x: {
        ticks: {
          color: isDark ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)',
        },
        grid: {
          color: isDark ? 'rgba(75, 85, 99, 0.2)' : 'rgba(107, 114, 128, 0.1)',
        },
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Stats Overview Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<FaBook />}
          title="Total Tests"
          value={stats.totalTests}
          color="text-blue-500"
        />
        <StatCard
          icon={<FaBullseye />}
          title="Average Score"
          value={`${Math.round(stats.averageScore || 0)}%`}
          color="text-green-500"
        />
        <StatCard
          icon={<FaFire />}
          title="Current Streak"
          value={`${stats.streak} days`}
          color="text-orange-500"
        />
        <StatCard
          icon={<FaTrophy />}
          title="Level"
          value={stats.level}
          subtitle={`${stats.xp} XP`}
          color="text-purple-500"
        />
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Over Time */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <FaChartLine className="text-blue-500" />
            Performance Trend
          </h3>
          {performanceOverTime.length > 0 ? (
            <Line data={performanceChartData} options={chartOptions} />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              <p>No performance data available yet</p>
            </div>
          )}
        </motion.div>

        {/* Weekly Activity */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <FaClock className="text-green-500" />
            Weekly Activity
          </h3>
          <Bar data={weeklyChartData} options={chartOptions} />
        </motion.div>
      </div>

      {/* Topic Performance */}
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
          <FaStar className="text-yellow-500" />
          Top Topics Performance
        </h3>
        {topicPerformance.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Bar data={topicChartData} options={chartOptions} />
            </div>
            <div className="space-y-3">
              {topicPerformance.slice(0, 5).map((topic, index) => (
                <motion.div
                  key={topic.topic}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{topic.topic}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {topic.testsCount} tests • {Math.round((topic.timeSpent || 0) / 60)} min
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {Math.round(topic.averageScore || 0)}%
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            <p>No topic data available yet</p>
          </div>
        )}
      </motion.div>

      {/* Recent Badges */}
      {recentBadges.length > 0 && (
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <FaTrophy className="text-yellow-500" />
            Recent Achievements
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {recentBadges.map((badge, index) => (
              <motion.div
                key={badge.name}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, type: "spring" }}
                className="flex flex-col items-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-700 dark:to-gray-600 rounded-lg border border-yellow-200 dark:border-gray-600"
              >
                <div className="text-3xl mb-2">{badge.icon}</div>
                <p className="text-sm font-medium text-center text-gray-900 dark:text-white">
                  {badge.name}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {new Date(badge.unlockedAt).toLocaleDateString()}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SimpleAnalyticsDashboard;
