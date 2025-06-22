"use client";
import React from 'react';
import { FaTrophy, FaStar, FaFire, FaChartLine } from 'react-icons/fa';

interface XpDisplayProps {
  currentXp: number;
  level: number;
  className?: string;
}

export function XpDisplay({ currentXp, level, className = "" }: XpDisplayProps) {
  // Calculate XP for current level and next level
  const getXpForLevel = (lvl: number): number => {
    let totalXp = 0;
    for (let i = 1; i < lvl; i++) {
      totalXp += 100 + (i * 50);
    }
    return totalXp;
  };

  const currentLevelXp = getXpForLevel(level);
  const nextLevelXp = getXpForLevel(level + 1);
  const xpInCurrentLevel = currentXp - currentLevelXp;
  const xpNeededForNextLevel = nextLevelXp - currentLevelXp;
  const progress = (xpInCurrentLevel / xpNeededForNextLevel) * 100;

  return (
    <div className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <FaStar className="text-yellow-500" />
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            Level {level}
          </span>
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {currentXp.toLocaleString()} XP
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>{xpInCurrentLevel.toLocaleString()} XP</span>
          <span>{xpNeededForNextLevel.toLocaleString()} XP</span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, progress)}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Level progress: ${Math.round(progress)}%`}
          />
        </div>
      </div>
    </div>
  );
}

interface StreakDisplayProps {
  streak: number;
  className?: string;
}

export function StreakDisplay({ streak, className = "" }: StreakDisplayProps) {
  const getStreakColor = () => {
    if (streak >= 30) return 'text-red-500';
    if (streak >= 7) return 'text-orange-500';
    if (streak >= 3) return 'text-yellow-500';
    return 'text-gray-500';
  };

  const getStreakMessage = () => {
    if (streak >= 30) return 'Amazing streak! 🔥';
    if (streak >= 7) return 'Great momentum! 🔥';
    if (streak >= 3) return 'Keep it up! 🔥';
    if (streak >= 1) return 'Good start!';
    return 'Start your streak!';
  };

  return (
    <div className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="flex items-center space-x-3">
        <FaFire className={`text-2xl ${getStreakColor()}`} />
        <div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {streak}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Day Streak
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">
            {getStreakMessage()}
          </div>
        </div>
      </div>
    </div>
  );
}

interface BadgeProps {
  name: string;
  description: string;
  icon: string;
  isLocked?: boolean;
  unlockedAt?: Date | string;
  className?: string;
}

export function Badge({ name, description, icon, isLocked = false, unlockedAt, className = "" }: BadgeProps) {
  const unlockedDate = unlockedAt ? new Date(unlockedAt) : undefined;

  return (
    <div className={`relative p-2 sm:p-3 rounded-lg border transition-all duration-200 ${
      isLocked 
        ? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 opacity-60' 
        : 'bg-white dark:bg-gray-700 border-yellow-300 dark:border-yellow-600 shadow-md hover:shadow-lg'
    } ${className}`}>
      <div className="text-center">
        <div className={`text-xl sm:text-2xl mb-1 sm:mb-2 ${isLocked ? 'grayscale' : ''}`}>
          {icon}
        </div>
        <h4 className={`text-xs sm:text-sm font-semibold mb-1 ${
          isLocked ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'
        }`}>
          {name}
        </h4>
        <p className={`text-xs ${
          isLocked ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'
        }`}>
          {description}
        </p>
        {unlockedDate && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-2">
            Unlocked {unlockedDate.toLocaleDateString()}
          </p>
        )}
      </div>
      
      {!isLocked && (
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
          <FaTrophy className="text-white text-xs" />
        </div>
      )}
    </div>
  );
}

interface StatsOverviewProps {
  stats: {
    totalTests: number;
    averageScore: number;
    xp: number;
    level: number;
    streak: number;
  };
  className?: string;
}

export function StatsOverview({ stats, className = "" }: StatsOverviewProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 ${className}`}>
      <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <FaChartLine className="text-blue-500 text-lg sm:text-xl" />
          <div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {stats.totalTests}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Tests Taken
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <FaTrophy className="text-yellow-500 text-lg sm:text-xl" />
          <div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(stats.averageScore)}%
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Average Score
            </div>
          </div>
        </div>
      </div>

      <XpDisplay 
        currentXp={stats.xp} 
        level={stats.level} 
        className="col-span-1 sm:col-span-2 lg:col-span-1"
      />

      <StreakDisplay 
        streak={stats.streak} 
        className="col-span-1"
      />
    </div>
  );
}
