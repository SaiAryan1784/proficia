// Gamification utilities
import { prisma } from './db';

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  totalTests: number;
  averageScore: number;
  badges: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    unlockedAt: Date;
  }>;
}

export interface XpGain {
  base: number;
  bonus: number;
  total: number;
  reasons: string[];
}

// XP calculation constants
export const XP_REWARDS = {
  TEST_COMPLETION: 50,
  PERFECT_SCORE: 100,
  HIGH_SCORE: 50, // 80%+
  STREAK_BONUS: 25,
  FIRST_TEST_DAILY: 30,
  SPEED_BONUS: 20, // Complete in under 50% of time limit
};

// Level calculation
export function calculateLevel(xp: number): number {
  // Each level requires 100 + (level * 50) XP
  let level = 1;
  let totalXpNeeded = 0;
  
  while (xp >= totalXpNeeded) {
    const xpForNextLevel = 100 + (level * 50);
    totalXpNeeded += xpForNextLevel;
    if (xp >= totalXpNeeded) {
      level++;
    }
  }
  
  return level;
}

export function getXpForLevel(level: number): number {
  let totalXp = 0;
  for (let i = 1; i < level; i++) {
    totalXp += 100 + (i * 50);
  }
  return totalXp;
}

export function getXpForNextLevel(currentLevel: number): number {
  return 100 + (currentLevel * 50);
}

// Calculate XP gain from test completion
export function calculateXpGain(testData: {
  score: number;
  timeSpent?: number;
  timeLimit?: number;
  isFirstTestToday: boolean;
  currentStreak: number;
  isTimedOut?: boolean;
}): XpGain {
  const { score, timeSpent, timeLimit, isFirstTestToday, currentStreak, isTimedOut } = testData;
  
  // Base XP only if the user scored at least 25%
  const baseXp = score >= 25 ? XP_REWARDS.TEST_COMPLETION : 10; // Minimal XP for very poor performance
  let bonusXp = 0;
  const reasons: string[] = score >= 25 ? ['Test completion'] : ['Participation'];
  
  // No bonuses for failed tests (score < 25%) or timed out tests
  if (score < 25 || isTimedOut) {
    return {
      base: baseXp,
      bonus: 0,
      total: baseXp,
      reasons,
    };
  }
  
  // Score bonuses (only for non-failed tests)
  if (score === 100) {
    bonusXp += XP_REWARDS.PERFECT_SCORE;
    reasons.push('Perfect score!');
  } else if (score >= 80) {
    bonusXp += XP_REWARDS.HIGH_SCORE;
    reasons.push('High score (80%+)');
  }
  
  // Streak bonus (only for decent performance)
  if (currentStreak >= 3 && score >= 60) {
    bonusXp += XP_REWARDS.STREAK_BONUS;
    reasons.push(`${currentStreak}-day streak bonus`);
  }
  
  // Daily bonus (only for decent performance)
  if (isFirstTestToday && score >= 50) {
    bonusXp += XP_REWARDS.FIRST_TEST_DAILY;
    reasons.push('First test today');
  }
  
  // Speed bonus (only if completed successfully within time limit and good score)
  if (timeSpent && timeLimit && !isTimedOut && score >= 70 && timeSpent < (timeLimit * 60 * 0.75)) {
    bonusXp += XP_REWARDS.SPEED_BONUS;
    reasons.push('Speed bonus (completed quickly)');
  }
  
  return {
    base: baseXp,
    bonus: bonusXp,
    total: baseXp + bonusXp,
    reasons,
  };
}

// Update user stats after test completion
export async function updateUserStats(userId: string, testScore: number, timeSpent?: number, timeLimit?: number, isTimedOut?: boolean) {
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: {
      xp: true,
      level: true,
      streak: true,
      lastTestDate: true,
      totalTests: true,
      averageScore: true,
    },
  });
  
  if (!user) throw new Error('User not found');
  
  // Calculate streak - break streak for very poor performance
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  let newStreak = 1;
  if (user.lastTestDate && (testScore >= 25 && !isTimedOut)) {
    const lastTestDay = new Date(user.lastTestDate);
    lastTestDay.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    if (lastTestDay.getTime() === yesterday.getTime()) {
      newStreak = user.streak + 1;
    } else if (lastTestDay.getTime() !== today.getTime()) {
      newStreak = 1;
    } else {
      newStreak = user.streak; // Same day, don't change streak
    }
  }
  // For poor performance (score < 25% or timed out), newStreak remains 1
  
  // Check if this is first test today
  const isFirstTestToday = !user.lastTestDate || 
    new Date(user.lastTestDate).toDateString() !== today.toDateString();
  
  // Calculate XP gain
  const xpGain = calculateXpGain({
    score: testScore,
    timeSpent,
    timeLimit,
    isFirstTestToday,
    currentStreak: newStreak,
    isTimedOut,
  });
  
  // Update stats
  const newXp = user.xp + xpGain.total;
  const newLevel = calculateLevel(newXp);
  const newTotalTests = user.totalTests + 1;
  const newAverageScore = ((user.averageScore * user.totalTests) + testScore) / newTotalTests;
  
  await prisma.users.update({
    where: { id: userId },
    data: {
      xp: newXp,
      level: newLevel,
      streak: newStreak,
      lastTestDate: today,
      totalTests: newTotalTests,
      averageScore: newAverageScore,
    },
  });
  
  // Check for new badges
  await checkAndAwardBadges(userId, {
    level: newLevel,
    streak: newStreak,
    totalTests: newTotalTests,
    perfectScore: testScore === 100,
    highScore: testScore >= 80,
  });
  
  return {
    xpGain,
    newLevel,
    levelUp: newLevel > user.level,
    newStreak,
  };
}

// Badge checking logic
export async function checkAndAwardBadges(userId: string, achievements: {
  level: number;
  streak: number;
  totalTests: number;
  perfectScore: boolean;
  highScore: boolean;
}) {
  const badges = await prisma.badge.findMany();
  const userBadges = await prisma.userBadge.findMany({
    where: { userId },
    select: { badgeId: true },
  });
  
  const earnedBadgeIds = new Set(userBadges.map(ub => ub.badgeId));
  const newBadges: string[] = [];
  
  for (const badge of badges) {
    if (earnedBadgeIds.has(badge.id)) continue;
    
    let shouldAward = false;
    
    switch (badge.name) {
      case 'First Steps':
        shouldAward = achievements.totalTests >= 1;
        break;
      case 'Test Taker':
        shouldAward = achievements.totalTests >= 5;
        break;
      case 'Dedicated Learner':
        shouldAward = achievements.totalTests >= 25;
        break;
      case 'Test Master':
        shouldAward = achievements.totalTests >= 100;
        break;
      case 'Perfect Score':
        shouldAward = achievements.perfectScore;
        break;
      case 'High Achiever':
        shouldAward = achievements.highScore;
        break;
      case 'Streak Starter':
        shouldAward = achievements.streak >= 3;
        break;
      case 'Consistent Learner':
        shouldAward = achievements.streak >= 7;
        break;
      case 'Learning Machine':
        shouldAward = achievements.streak >= 30;
        break;
      case 'Rising Star':
        shouldAward = achievements.level >= 5;
        break;
      case 'Expert':
        shouldAward = achievements.level >= 10;
        break;
      case 'Master':
        shouldAward = achievements.level >= 25;
        break;
    }
    
    if (shouldAward) {
      await prisma.userBadge.create({
        data: {
          userId,
          badgeId: badge.id,
        },
      });
      newBadges.push(badge.id);
    }
  }
  
  return newBadges;
}

// Get user statistics
export async function getUserStats(userId: string): Promise<UserStats> {
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: {
      xp: true,
      level: true,
      streak: true,
      totalTests: true,
      averageScore: true,
      badges: {
        include: {
          badge: true,
        },
        orderBy: {
          unlockedAt: 'desc',
        },
      },
    },
  });
  
  if (!user) throw new Error('User not found');
  
  return {
    xp: user.xp,
    level: user.level,
    streak: user.streak,
    totalTests: user.totalTests,
    averageScore: user.averageScore,
    badges: user.badges.map(ub => ({
      id: ub.badge.id,
      name: ub.badge.name,
      description: ub.badge.description,
      icon: ub.badge.icon,
      unlockedAt: ub.unlockedAt,
    })),
  };
}
