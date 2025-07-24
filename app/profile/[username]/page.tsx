import { generateProfileMetadata } from "@/lib/seo";
import { generatePersonSchema } from "@/lib/schema";

export async function generateMetadata({ params }: PublicProfileProps) {
  const { username } = await params;
  
  try {
    // Fetch user data for metadata
    const profileData = await getUserProfileData(username);
    if (!profileData) {
      return {
        title: 'User Not Found | Proficia',
        description: 'The requested user profile could not be found.',
        robots: { index: false, follow: false }
      };
    }

    return generateProfileMetadata(
      username, 
      profileData.user.name || undefined, 
      profileData.stats
    );
  } catch {
    return {
      title: 'Profile | Proficia',
      description: 'View user profile on Proficia learning platform.',
    };
  }
}

// Enhanced profile page with schema markup
import React from 'react';
import { notFound } from 'next/navigation';
import { Badge } from "@/components/Gamification";
import NavbarPrimary from '@/components/NavbarPrimary';
import { SchemaMarkup } from '@/lib/schema';

interface PublicProfileProps {
  params: Promise<{
    username: string;
  }>;
}

interface UserProfile {
  name: string | null;
  username: string;
  joinedAt: string;
  level: number;
  xp: number;
  streak: number;
}

interface UserStats {
  totalTests: number;
  averageScore: number;
  totalTimeSpent: number;
  completionRate: number;
  improvedTopics: number;
  level: number;
  xp: number;
  streak: number;
}

interface TopicPerformance {
  topic: string;
  averageScore: number;
  testsCount: number;
  timeSpent: number;
  totalScore: number;
}

interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string | Date;
}

interface RecentBadge {
  name: string;
  icon: string;
  description: string;
  unlockedAt: string | Date;
}

interface ProfileData {
  user: UserProfile;
  stats: UserStats;
  topicPerformance: TopicPerformance[];
  recentBadges: RecentBadge[];
  totalBadges: number;
  allBadges: BadgeData[];
}

async function getUserProfileData(username: string): Promise<ProfileData | null> {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/user/profile/${username}`, {
      cache: 'no-store' // Ensure fresh data
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

export default async function PublicProfilePage({ params }: PublicProfileProps) {
  const { username } = await params;
  const profileData = await getUserProfileData(username);
  
  if (!profileData) {
    notFound();
  }

  const {
    user,
    stats,
    topicPerformance,
    recentBadges,
    allBadges
  } = profileData;

  // Generate schema markup for the person
  const personSchema = generatePersonSchema({
    name: user.name || undefined,
    username: user.username,
    profileUrl: `https://proficia.com/profile/${user.username}`,
    joinDate: user.joinedAt,
    achievements: allBadges,
    skills: topicPerformance.map(tp => tp.topic)
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <SchemaMarkup schema={personSchema} />
      <NavbarPrimary />
      <div className="flex-1 px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8 border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {user.name ? user.name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                {user.name || user.username}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-2 sm:mb-4">@{user.username}</p>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Member since {new Date(user.joinedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
            <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 lg:p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.level}</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Level</div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 lg:p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.xp.toLocaleString()}</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total XP</div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 lg:p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 dark:text-green-400">{stats.totalTests}</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Tests Completed</div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 lg:p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600 dark:text-orange-400">{Math.round(stats.averageScore)}%</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Average Score</div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-4 sm:mb-6 lg:mb-8">
            {/* Performance Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">Performance</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Current Streak</span>
                  <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{stats.streak} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Time Spent</span>
                  <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                    {Math.round(stats.totalTimeSpent / 60)} minutes
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Completion Rate</span>
                  <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{stats.completionRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Improved Topics</span>
                  <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{stats.improvedTopics}</span>
                </div>
              </div>
            </div>

            {/* Recent Badges */}
            {recentBadges.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">Recent Achievements</h3>
                <div className="space-y-2 sm:space-y-3">
                  {recentBadges.map((badge: RecentBadge, index: number) => (
                    <div key={`recent-badge-${badge.name}-${index}`} className="flex items-center p-2 sm:p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="text-xl sm:text-2xl mr-2 sm:mr-3">{badge.icon}</div>
                      <div>
                        <div className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">{badge.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(badge.unlockedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Topic Performance */}
          {topicPerformance.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-200 dark:border-gray-700">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">Topic Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {topicPerformance.slice(0, 8).map((topic: TopicPerformance, index: number) => (
                  <div key={`topic-${topic.topic}-${index}`} className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">{topic.topic}</span>
                      <span className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {Math.round(topic.averageScore)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      <span>{topic.testsCount} tests</span>
                      <span>{Math.round(topic.timeSpent / 60)}m</span>
                    </div>
                    <div className="mt-2 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${topic.averageScore}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Badges */}
          {allBadges.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">
                All Achievements ({allBadges.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {allBadges.map((badge: BadgeData) => (
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
      </div>
    </div>
  );
}
