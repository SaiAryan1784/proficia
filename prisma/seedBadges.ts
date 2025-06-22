import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedBadges() {
  const badges = [
    {
      name: 'First Steps',
      description: 'Complete your first test',
      icon: '🎯',
      category: 'milestone',
      requirement: 'Complete 1 test',
      xpReward: 50,
    },
    {
      name: 'Test Taker',
      description: 'Complete 5 tests',
      icon: '📝',
      category: 'milestone',
      requirement: 'Complete 5 tests',
      xpReward: 100,
    },
    {
      name: 'Dedicated Learner',
      description: 'Complete 25 tests',
      icon: '📚',
      category: 'milestone',
      requirement: 'Complete 25 tests',
      xpReward: 250,
    },
    {
      name: 'Test Master',
      description: 'Complete 100 tests',
      icon: '🏆',
      category: 'milestone',
      requirement: 'Complete 100 tests',
      xpReward: 500,
    },
    {
      name: 'Perfect Score',
      description: 'Achieve a perfect score of 100%',
      icon: '⭐',
      category: 'achievement',
      requirement: 'Score 100% on any test',
      xpReward: 150,
    },
    {
      name: 'High Achiever',
      description: 'Score 80% or higher',
      icon: '🌟',
      category: 'achievement',
      requirement: 'Score 80%+ on any test',
      xpReward: 75,
    },
    {
      name: 'Streak Starter',
      description: 'Maintain a 3-day learning streak',
      icon: '🔥',
      category: 'streak',
      requirement: 'Complete tests for 3 consecutive days',
      xpReward: 100,
    },
    {
      name: 'Consistent Learner',
      description: 'Maintain a 7-day learning streak',
      icon: '📈',
      category: 'streak',
      requirement: 'Complete tests for 7 consecutive days',
      xpReward: 200,
    },
    {
      name: 'Learning Machine',
      description: 'Maintain a 30-day learning streak',
      icon: '🚀',
      category: 'streak',
      requirement: 'Complete tests for 30 consecutive days',
      xpReward: 500,
    },
    {
      name: 'Rising Star',
      description: 'Reach Level 5',
      icon: '🌠',
      category: 'level',
      requirement: 'Reach Level 5',
      xpReward: 200,
    },
    {
      name: 'Expert',
      description: 'Reach Level 10',
      icon: '💎',
      category: 'level',
      requirement: 'Reach Level 10',
      xpReward: 500,
    },
    {
      name: 'Master',
      description: 'Reach Level 25',
      icon: '👑',
      category: 'level',
      requirement: 'Reach Level 25',
      xpReward: 1000,
    },
    {
      name: 'Speed Demon',
      description: 'Complete a test in record time',
      icon: '⚡',
      category: 'achievement',
      requirement: 'Complete a timed test in under 50% of time limit',
      xpReward: 100,
    },
    {
      name: 'Night Owl',
      description: 'Complete a test after 10 PM',
      icon: '🦉',
      category: 'special',
      requirement: 'Complete a test between 10 PM and 6 AM',
      xpReward: 50,
    },
    {
      name: 'Early Bird',
      description: 'Complete a test before 7 AM',
      icon: '🐦',
      category: 'special',
      requirement: 'Complete a test between 5 AM and 7 AM',
      xpReward: 50,
    },
  ];

  console.log('Seeding badges...');

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { name: badge.name },
      update: badge,
      create: badge,
    });
  }

  console.log('Badges seeded successfully!');
}

seedBadges()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
