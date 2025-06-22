"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaBook, FaClock, FaChartLine, FaStar, FaPlay } from "react-icons/fa";
import { StatsOverview } from "@/components/Gamification";

interface Topic {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  category: string;
}

interface UserStats {
  totalTests: number;
  averageScore: number;
  streak: number;
  level: number;
  xp: number;
  badges: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    unlockedAt: Date;
  }>;
}

interface RecentTest {
  id: string;
  title: string;
  score: number;
  completedAt: string;
  timeSpent: number;
  isTimedOut: boolean;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [recentTests, setRecentTests] = useState<RecentTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState("medium");
  const [questionCount, setQuestionCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch topics
        const topicsResponse = await fetch("/api/topics");
        if (!topicsResponse.ok) {
          throw new Error("Failed to fetch topics");
        }
        const topicsData = await topicsResponse.json();
        setTopics(topicsData);

        // Fetch user stats
        const statsResponse = await fetch("/api/user/stats");
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setUserStats(statsData);
        }

        // Fetch recent tests
        const recentTestsResponse = await fetch("/api/user/recent-tests");
        if (recentTestsResponse.ok) {
          const recentTestsData = await recentTestsResponse.json();
          setRecentTests(recentTestsData);
        }
      } catch {
        setError("Error loading data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    if (status === "authenticated") {
      fetchData();
    }
  }, [status]);

  const handleImageError = (topicId: string) => {
    setImageErrors(prev => ({
      ...prev,
      [topicId]: true
    }));
  };

  const formatTimeDisplay = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  const getScoreColorClass = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400';
    return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400';
  };

  const handleGenerateTest = async () => {
    if (!selectedTopic) return;
    
    setIsGenerating(true);
    
    try {
      const response = await fetch("/api/tests/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topicId: selectedTopic,
          difficulty,
          questionCount: parseInt(questionCount.toString()),
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Handle rate limiting specifically
        if (response.status === 429) {
          setError(data.message || "Daily test limit reached. You can only create 3 tests per day.");
        } else {
          setError(data.error || "Failed to generate test");
        }
        return;
      }
      
      // Redirect to the test page
      window.location.href = `/tests/${data.test.id}`;
    } catch (error) {
      console.error('Test generation error:', error);
      setError("Error generating test. Please try again later.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-2 sm:px-4 py-4 sm:py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Welcome, {session?.user?.name || session?.user?.email}
          </h1>
          {session?.user?.username && (
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
              Your profile: {" "}
              <a 
                href={`/profile/${session.user.username}`}
                className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                target="_blank"
                rel="noopener noreferrer"
              >
                proficia.vercel.app/profile/{session.user.username}
              </a>
            </p>
          )}
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
            Select a topic to generate a test and practice your skills.
          </p>
        </div>
        
        {/* Stats Overview */}
        {userStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 sm:mb-8"
          >
            <StatsOverview stats={userStats} />
          </motion.div>
        )}
        
        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <FaPlay className="mr-2 text-blue-500" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => window.location.href = '/practice'}
                className="w-full text-left p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-800 transition-colors"
              >
                <div className="font-medium text-blue-900 dark:text-blue-300">Practice Mode</div>
                <div className="text-sm text-blue-700 dark:text-blue-400">Custom tests & practice</div>
              </button>
              <button
                onClick={() => window.location.href = '/statistics'}
                className="w-full text-left p-3 rounded-lg bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 border border-green-200 dark:border-green-800 transition-colors"
              >
                <div className="font-medium text-green-900 dark:text-green-300">View Statistics</div>
                <div className="text-sm text-green-700 dark:text-green-400">Detailed analytics</div>
              </button>
              <button
                onClick={() => window.location.href = '/profile'}
                className="w-full text-left p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 border border-purple-200 dark:border-purple-800 transition-colors"
              >
                <div className="font-medium text-purple-900 dark:text-purple-300">Profile Settings</div>
                <div className="text-sm text-purple-700 dark:text-purple-400">Update preferences</div>
              </button>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <FaClock className="mr-2 text-orange-500" />
              Recent Activity
            </h3>
            {recentTests.length > 0 ? (
              <div className="space-y-3">
                {recentTests.slice(0, 5).map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{test.title}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(test.completedAt).toLocaleDateString()} • {formatTimeDisplay(test.timeSpent)}
                        {test.isTimedOut && <span className="text-red-500 ml-1">(Timed out)</span>}
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColorClass(test.score)}`}>
                      {test.score}%
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <FaBook className="mx-auto text-3xl mb-2 opacity-50" />
                <p>No recent tests found</p>
                <p className="text-sm">Take your first test to see your activity here!</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Achievements & Progress */}
        {userStats && userStats.badges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-8"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <FaStar className="mr-2 text-yellow-500" />
              Recent Achievements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userStats.badges.slice(0, 6).map((badge) => (
                <div key={badge.id} className="flex items-center p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="text-2xl mr-3">{badge.icon}</div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{badge.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{badge.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Study Progress Chart */}
        {userStats && userStats.totalTests > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-8"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <FaChartLine className="mr-2 text-green-500" />
              Progress Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* XP Progress */}
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{userStats.xp}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total XP Earned</div>
                <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (userStats.xp % 1000) / 10)}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {1000 - (userStats.xp % 1000)} XP to next level
                </div>
              </div>

              {/* Streak Visual */}
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{userStats.streak}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Day Streak</div>
                <div className="flex justify-center mt-2 space-x-1">
                  {Array.from({ length: 7 }, (_, i) => (
                    <div
                      key={`streak-indicator-${i}`}
                      className={`w-4 h-4 rounded ${
                        i < userStats.streak % 7 
                          ? 'bg-orange-500' 
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Keep it up!
                </div>
              </div>

              {/* Performance */}
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{Math.round(userStats.averageScore)}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Average Score</div>
                <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${userStats.averageScore}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {(() => {
                    if (userStats.averageScore >= 80) return 'Excellent!';
                    if (userStats.averageScore >= 60) return 'Good progress';
                    return 'Keep practicing!';
                  })()}
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Generate a New Test</h2>
          
          <div className="mb-4">
            <label htmlFor="topic-selection" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Select a Topic</label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="topic-selection">
              {topics.map((topic) => (
                <div 
                  key={topic.id}
                  className={`
                    border rounded-lg p-4 cursor-pointer transition-all
                    ${selectedTopic === topic.id ? 
                      'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400' : 
                      'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
                    }
                  `}
                  onClick={() => setSelectedTopic(topic.id)}
                >
                  <div className="flex items-center gap-3">
                    {topic.imageUrl && !imageErrors[topic.id] && !topic.imageUrl.includes('placeholder.com') ? (
                      <div className="relative w-10 h-10 rounded overflow-hidden bg-gray-100 dark:bg-gray-700">
                        <Image
                          src={topic.imageUrl}
                          alt={topic.name}
                          width={40}
                          height={40}
                          className="object-cover"
                          onError={() => handleImageError(topic.id)}
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-500 dark:text-blue-400 font-semibold">
                        {topic.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{topic.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{topic.category}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="difficulty-select" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Difficulty Level</label>
              <select
                id="difficulty-select"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="question-count-select" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Number of Questions</label>
              <select
                id="question-count-select"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value))}
              >
                <option value="5">5 Questions (5 min)</option>
                <option value="10">10 Questions (10 min)</option>
                <option value="15">15 Questions (15 min)</option>
                <option value="20">20 Questions (20 min)</option>
              </select>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Time limit: 1 minute per question
              </p>
            </div>
          </div>
          
          <button
            className={`
              w-full py-3 rounded-md font-medium transition-colors
              ${selectedTopic 
                ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }
              ${isGenerating ? 'opacity-70 cursor-wait' : ''}
            `}
            onClick={handleGenerateTest}
            disabled={!selectedTopic || isGenerating}
          >
            {isGenerating ? 'Generating Test...' : 'Generate Test'}
          </button>
        </div>
      </div>
    </div>
  );
}