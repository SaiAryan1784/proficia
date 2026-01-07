"use client";
import React, { useState } from 'react';
import { FaTrophy, FaStar, FaFire, FaChartLine, FaInfoCircle } from 'react-icons/fa';

interface XpDisplayProps {
  currentXp: number;
  level: number;
  className?: string;
}

export function XpDisplay({ currentXp, level, className = "" }: XpDisplayProps) {
  const [showInfo, setShowInfo] = useState(false);

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
    <div className={`bg-card p-4 rounded-lg shadow-sm border border-border relative ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <FaStar className="text-yellow-500" />
          <span className="text-lg font-bold text-foreground">
            Level {level}
          </span>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Level system info"
          >
            <FaInfoCircle size={14} />
          </button>
        </div>
        <span className="text-sm text-muted-foreground">
          {currentXp.toLocaleString()} XP
        </span>
      </div>

      {showInfo && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-card border border-border rounded-lg shadow-lg z-10 text-sm">
          <h4 className="font-semibold text-foreground mb-2">How Levels Work</h4>
          <ul className="space-y-1 text-muted-foreground text-xs">
            <li>• Earn XP by completing tests</li>
            <li>• Higher scores = more XP</li>
            <li>• Maintain streaks for bonus XP</li>
            <li>• Each level requires more XP than the last</li>
            <li>• Level {level + 1} needs {xpNeededForNextLevel.toLocaleString()} XP total</li>
          </ul>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{xpInCurrentLevel.toLocaleString()} XP</span>
          <span>{xpNeededForNextLevel.toLocaleString()} XP</span>
        </div>

        <div className="w-full bg-secondary rounded-full h-3">
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
    return 'text-muted-foreground';
  };

  const getStreakMessage = () => {
    if (streak >= 30) return 'Amazing streak! 🔥';
    if (streak >= 7) return 'Great momentum! 🔥';
    if (streak >= 3) return 'Keep it up! 🔥';
    if (streak >= 1) return 'Good start!';
    return 'Start your streak!';
  };

  return (
    <div className={`bg-card p-4 rounded-lg shadow-sm border border-border ${className}`}>
      <div className="flex items-center space-x-3">
        <FaFire className={`text-2xl ${getStreakColor()}`} />
        <div>
          <div className="text-2xl font-bold text-foreground">
            {streak}
          </div>
          <div className="text-sm text-muted-foreground">
            Day Streak
          </div>
          <div className="text-xs text-muted-foreground">
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
    <div className={`relative p-2 sm:p-3 rounded-lg border transition-all duration-200 ${isLocked
        ? 'bg-muted border-border opacity-60'
        : 'bg-card border-yellow-500/50 shadow-md hover:shadow-lg'
      } ${className}`}>
      <div className="text-center">
        <div className={`text-xl sm:text-2xl mb-1 sm:mb-2 ${isLocked ? 'grayscale' : ''}`}>
          {icon}
        </div>
        <h4 className={`text-xs sm:text-sm font-semibold mb-1 ${isLocked ? 'text-muted-foreground' : 'text-foreground'
          }`}>
          {name}
        </h4>
        <p className={`text-xs ${isLocked ? 'text-muted-foreground' : 'text-muted-foreground'
          }`}>
          {description}
        </p>
        {unlockedDate && (
          <p className="text-xs text-muted-foreground mt-1 sm:mt-2">
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
      <div className="bg-card p-3 sm:p-4 rounded-lg shadow-sm border border-border">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <FaChartLine className="text-blue-500 text-lg sm:text-xl" />
          <div>
            <div className="text-xl sm:text-2xl font-bold text-foreground">
              {stats.totalTests}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Tests Taken
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card p-3 sm:p-4 rounded-lg shadow-sm border border-border">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <FaTrophy className="text-yellow-500 text-lg sm:text-xl" />
          <div>
            <div className="text-xl sm:text-2xl font-bold text-foreground">
              {Math.round(stats.averageScore)}%
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
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
