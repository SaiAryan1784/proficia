import React from 'react';
import { notFound } from 'next/navigation';
import NavbarPrimary from '@/components/NavbarPrimary';
import { generateTopicMetadata } from '@/lib/seo';
import { generateCourseSchema, SchemaMarkup } from '@/lib/schema';
import Link from 'next/link';
import ButtonPrimary from '@/components/ButtonPrimary';

interface TopicPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Topic data with SEO-friendly content
const topicData: Record<string, {
  name: string;
  description: string;
  longDescription: string;
  skills: string[];
  prerequisites: string[];
  learningOutcomes: string[];
  difficulty: string;
  estimatedTime: string;
  icon: string;
}> = {
  'web-dev': {
    name: 'Web Development',
    description: 'Learn frontend and backend web development with modern frameworks and technologies',
    longDescription: 'Master the art of web development with our comprehensive practice tests covering HTML, CSS, JavaScript, React, Node.js, and more. From responsive design to server-side programming, build the skills needed for modern web development.',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'RESTful APIs'],
    prerequisites: ['Basic computer literacy', 'Understanding of the internet'],
    learningOutcomes: [
      'Build responsive web applications',
      'Understand frontend and backend development',
      'Work with modern JavaScript frameworks',
      'Deploy web applications to production'
    ],
    difficulty: 'Beginner to Advanced',
    estimatedTime: '3-6 months',
    icon: '💻'
  },
  'data-science': {
    name: 'Data Science',
    description: 'Analytics, machine learning, and data visualization techniques for data-driven insights',
    longDescription: 'Dive into the world of data science with practice tests covering Python, R, SQL, machine learning algorithms, statistical analysis, and data visualization. Learn to extract meaningful insights from complex datasets.',
    skills: ['Python', 'R', 'SQL', 'Machine Learning', 'Statistics', 'Data Visualization', 'Pandas', 'NumPy'],
    prerequisites: ['Basic mathematics', 'Programming fundamentals'],
    learningOutcomes: [
      'Analyze and visualize complex datasets',
      'Build predictive machine learning models',
      'Apply statistical methods to real problems',
      'Communicate data insights effectively'
    ],
    difficulty: 'Intermediate to Advanced',
    estimatedTime: '4-8 months',
    icon: '📊'
  },
  'ml-ai': {
    name: 'Machine Learning & AI',
    description: 'Artificial intelligence, deep learning, and neural networks for intelligent systems',
    longDescription: 'Explore artificial intelligence and machine learning with hands-on practice tests covering neural networks, deep learning, natural language processing, computer vision, and AI ethics.',
    skills: ['TensorFlow', 'PyTorch', 'Neural Networks', 'Deep Learning', 'NLP', 'Computer Vision', 'AI Ethics'],
    prerequisites: ['Programming experience', 'Linear algebra', 'Statistics'],
    learningOutcomes: [
      'Build neural networks from scratch',
      'Implement deep learning models',
      'Understand AI ethics and bias',
      'Deploy AI models to production'
    ],
    difficulty: 'Advanced',
    estimatedTime: '6-12 months',
    icon: '🤖'
  },
  'mobile-dev': {
    name: 'Mobile Development',
    description: 'iOS and Android app development with native and cross-platform frameworks',
    longDescription: 'Learn mobile app development for iOS and Android platforms using Swift, Kotlin, React Native, and Flutter. Build responsive, user-friendly mobile applications.',
    skills: ['Swift', 'Kotlin', 'React Native', 'Flutter', 'iOS Development', 'Android Development', 'Mobile UI/UX'],
    prerequisites: ['Programming fundamentals', 'Understanding of mobile platforms'],
    learningOutcomes: [
      'Build native iOS and Android apps',
      'Develop cross-platform mobile applications',
      'Implement mobile-specific features',
      'Publish apps to app stores'
    ],
    difficulty: 'Intermediate',
    estimatedTime: '4-6 months',
    icon: '📱'
  },
  'cloud': {
    name: 'Cloud Computing',
    description: 'AWS, Azure, Google Cloud architecture and cloud-native development',
    longDescription: 'Master cloud computing with practice tests covering AWS, Microsoft Azure, Google Cloud Platform, containerization, serverless computing, and cloud architecture patterns.',
    skills: ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Serverless', 'Cloud Architecture', 'DevOps'],
    prerequisites: ['System administration basics', 'Networking fundamentals'],
    learningOutcomes: [
      'Design scalable cloud architectures',
      'Deploy applications to major cloud platforms',
      'Implement Infrastructure as Code',
      'Optimize cloud costs and performance'
    ],
    difficulty: 'Intermediate to Advanced',
    estimatedTime: '3-5 months',
    icon: '☁️'
  },
  'security': {
    name: 'Cybersecurity',
    description: 'Cybersecurity, ethical hacking, and information security best practices',
    longDescription: 'Learn cybersecurity fundamentals with practice tests covering network security, ethical hacking, cryptography, security auditing, and compliance frameworks.',
    skills: ['Network Security', 'Ethical Hacking', 'Cryptography', 'Security Auditing', 'Penetration Testing', 'CISSP', 'CompTIA Security+'],
    prerequisites: ['Networking basics', 'System administration'],
    learningOutcomes: [
      'Identify and mitigate security vulnerabilities',
      'Conduct ethical penetration testing',
      'Implement security best practices',
      'Understand compliance frameworks'
    ],
    difficulty: 'Intermediate to Advanced',
    estimatedTime: '4-8 months',
    icon: '🔒'
  },
  'devops': {
    name: 'DevOps',
    description: 'CI/CD, infrastructure automation, and development operations practices',
    longDescription: 'Master DevOps practices with tests covering continuous integration, continuous deployment, infrastructure as code, monitoring, and collaboration tools.',
    skills: ['Jenkins', 'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Git', 'CI/CD Pipelines', 'Monitoring'],
    prerequisites: ['Software development experience', 'System administration'],
    learningOutcomes: [
      'Implement CI/CD pipelines',
      'Automate infrastructure deployment',
      'Monitor and maintain production systems',
      'Foster collaboration between dev and ops teams'
    ],
    difficulty: 'Intermediate to Advanced',
    estimatedTime: '3-6 months',
    icon: '⚙️'
  },
  'game-dev': {
    name: 'Game Development',
    description: 'Game design, programming, and development using modern game engines',
    longDescription: 'Learn game development with practice tests covering Unity, Unreal Engine, game design principles, 3D graphics programming, and game monetization strategies.',
    skills: ['Unity', 'Unreal Engine', 'C#', 'C++', 'Game Design', '3D Graphics', 'Physics Programming', 'Game AI'],
    prerequisites: ['Programming fundamentals', 'Basic mathematics'],
    learningOutcomes: [
      'Develop 2D and 3D games',
      'Implement game mechanics and physics',
      'Design engaging gameplay experiences',
      'Publish games to various platforms'
    ],
    difficulty: 'Intermediate',
    estimatedTime: '4-8 months',
    icon: '🎮'
  },
  'algorithms': {
    name: 'Algorithms & Data Structures',
    description: 'Data structures, algorithms, and computational problem-solving techniques',
    longDescription: 'Master computer science fundamentals with practice tests covering algorithms, data structures, time complexity, sorting, searching, and dynamic programming.',
    skills: ['Data Structures', 'Algorithm Design', 'Big O Notation', 'Dynamic Programming', 'Graph Algorithms', 'Sorting', 'Searching'],
    prerequisites: ['Programming fundamentals', 'Basic mathematics'],
    learningOutcomes: [
      'Implement efficient algorithms',
      'Choose appropriate data structures',
      'Analyze time and space complexity',
      'Solve complex computational problems'
    ],
    difficulty: 'Intermediate to Advanced',
    estimatedTime: '3-6 months',
    icon: '🧮'
  }
};

export async function generateMetadata({ params }: TopicPageProps) {
  const { slug } = await params;
  const topic = topicData[slug];
  
  if (!topic) {
    return {
      title: 'Topic Not Found | Proficia',
      description: 'The requested learning topic could not be found.',
      robots: { index: false, follow: false }
    };
  }

  return generateTopicMetadata(topic.name, topic.description);
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { slug } = await params;
  const topic = topicData[slug];

  if (!topic) {
    notFound();
  }

  // Generate schema markup for the course
  const courseSchema = generateCourseSchema({
    name: `${topic.name} Practice Tests`,
    description: topic.longDescription,
    url: `https://proficia.com/topics/${slug}`,
    teaches: topic.skills,
    educationalLevel: topic.difficulty,
    timeRequired: topic.estimatedTime,
    interactivityType: "active"
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SchemaMarkup schema={courseSchema} />
      <NavbarPrimary />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <header className="text-center mb-12">
          <div className="text-6xl mb-4">{topic.icon}</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {topic.name}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            {topic.description}
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span>🎯 {topic.difficulty}</span>
            <span>⏱️ {topic.estimatedTime}</span>
            <span>🎓 {topic.skills.length} Skills</span>
          </div>
        </header>

        {/* Course Description */}
        <section className="mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              What You'll Learn
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              {topic.longDescription}
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Skills */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Skills You'll Master
                </h3>
                <div className="flex flex-wrap gap-2">
                  {topic.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Learning Outcomes */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Learning Outcomes
                </h3>
                <ul className="space-y-2">
                  {topic.learningOutcomes.map((outcome, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2 mt-0.5">✓</span>
                      <span className="text-gray-600 dark:text-gray-300 text-sm">
                        {outcome}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Prerequisites */}
        <section className="mb-12">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              📋 Prerequisites
            </h3>
            <ul className="space-y-1">
              {topic.prerequisites.map((prereq, index) => (
                <li key={index} className="text-gray-700 dark:text-gray-300 text-sm">
                  • {prereq}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">
              Ready to Start Learning {topic.name}?
            </h2>
            <p className="text-blue-100 mb-6">
              Join thousands of learners who have improved their {topic.name.toLowerCase()} skills with our AI-powered practice tests.
            </p>
            <Link href="/register" className="inline-block">
              <ButtonPrimary text="Start Learning Free" />
            </Link>
            <p className="text-sm text-blue-200 mt-4">
              No credit card required • Start practicing immediately
            </p>
          </div>
        </section>

        {/* Related Topics */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Explore Other Topics
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {Object.entries(topicData)
              .filter(([key]) => key !== slug)
              .slice(0, 3)
              .map(([key, relatedTopic]) => (
                <Link 
                  key={key}
                  href={`/topics/${key}`}
                  className="block p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
                >
                  <div className="text-3xl mb-2">{relatedTopic.icon}</div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {relatedTopic.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {relatedTopic.description}
                  </p>
                </Link>
              ))}
          </div>
        </section>
      </main>
    </div>
  );
}