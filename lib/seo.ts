import { Metadata } from 'next';

interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export function generateMetadata({
  title,
  description,
  keywords = [],
  canonical,
  ogType = 'website',
  ogImage = '/og-default.png',
  noindex = false,
  nofollow = false
}: SEOData): Metadata {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://proficia.com';
  const fullTitle = title.includes('Proficia') ? title : `${title} | Proficia`;
  const fullCanonical = canonical ? `${baseUrl}${canonical}` : undefined;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`;

  const defaultKeywords = [
    'online learning',
    'education platform',
    'practice tests',
    'AI learning',
    'skill development',
    'programming',
    'technology education'
  ];

  const allKeywords = [...defaultKeywords, ...keywords].join(', ');

  return {
    title: fullTitle,
    description,
    keywords: allKeywords,
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      type: ogType as 'website' | 'article',
      url: fullCanonical,
      siteName: 'Proficia',
      images: [
        {
          url: fullOgImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [fullOgImage],
      creator: '@proficia',
      site: '@proficia',
    },
    alternates: {
      canonical: fullCanonical,
    },
  };
}

// Topic-specific metadata generators
export function generateTopicMetadata(topicName: string, description?: string) {
  return generateMetadata({
    title: `Learn ${topicName} - Practice Tests & Tutorials`,
    description: description || `Master ${topicName} with AI-powered practice tests, interactive tutorials, and personalized learning paths. Track your progress and improve your skills.`,
    keywords: [
      topicName.toLowerCase(),
      `${topicName.toLowerCase()} practice`,
      `${topicName.toLowerCase()} tests`,
      `${topicName.toLowerCase()} tutorial`,
      `learn ${topicName.toLowerCase()}`,
      `${topicName.toLowerCase()} skills`
    ],
    canonical: `/topics/${topicName.toLowerCase().replace(/\s+/g, '-')}`,
    ogType: 'article'
  });
}

// Profile metadata generator
export function generateProfileMetadata(username: string, name?: string, stats?: { level: number; totalTests: number; badges?: object[] }) {
  const displayName = name || username;
  const achievementsText = stats ? `Level ${stats.level} • ${stats.totalTests} tests completed • ${stats.badges?.length || 0} badges earned` : '';
  
  return generateMetadata({
    title: `${displayName}'s Profile`,
    description: `View ${displayName}'s learning journey on Proficia. ${achievementsText}`,
    keywords: [
      'user profile',
      'learning progress',
      'achievements',
      'badges',
      'student profile'
    ],
    canonical: `/profile/${username}`,
    ogType: 'profile'
  });
}

// Test metadata generator
export function generateTestMetadata(testTitle: string, topicName: string, difficulty?: string) {
  return generateMetadata({
    title: `${testTitle} - ${topicName} Practice Test`,
    description: `Take this ${difficulty || 'practice'} test on ${topicName}. Get instant feedback, track your progress, and improve your skills with AI-generated questions.`,
    keywords: [
      topicName.toLowerCase(),
      'practice test',
      'quiz',
      'assessment',
      difficulty?.toLowerCase() || 'practice',
      'learning assessment'
    ],
    ogType: 'article'
  });
}

// Home page metadata
export function generateHomeMetadata() {
  return generateMetadata({
    title: 'Proficia - AI-Powered Learning Platform',
    description: 'Master technology skills with AI-generated practice tests, personalized learning paths, and gamified progress tracking. Learn Web Development, Data Science, AI/ML, and more.',
    keywords: [
      'AI learning platform',
      'personalized education',
      'technology skills',
      'web development',
      'data science',
      'machine learning',
      'coding practice',
      'programming tutorials',
      'skill assessment',
      'career development'
    ],
    canonical: '/'
  });
}

// Auth pages metadata
export function generateAuthMetadata(type: 'login' | 'register') {
  const isLogin = type === 'login';
  return generateMetadata({
    title: isLogin ? 'Login to Proficia' : 'Join Proficia - Start Learning Today',
    description: isLogin 
      ? 'Sign in to your Proficia account to continue your learning journey. Access your practice tests, track progress, and unlock achievements.'
      : 'Create your free Proficia account and start mastering technology skills with AI-powered practice tests and personalized learning paths.',
    keywords: [
      isLogin ? 'login' : 'register',
      isLogin ? 'sign in' : 'sign up',
      'account',
      'learning platform',
      'online education'
    ],
    canonical: `/${type}`,
    noindex: true // Auth pages typically shouldn't be indexed
  });
}