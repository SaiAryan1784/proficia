"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import ButtonPrimary from "@/components/ButtonPrimary";
import { motion, AnimatePresence } from "framer-motion";

const topics = [
  {
    id: 1,
    name: "Web Development",
    description: "React, Node.js, TypeScript",
    icon: "🌐",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    name: "Data Science",
    description: "Python, R, SQL, Analytics",
    icon: "📊",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: 3,
    name: "Machine Learning",
    description: "TensorFlow, PyTorch, AI",
    icon: "🤖",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 4,
    name: "Mobile Development",
    description: "React Native, Swift, Kotlin",
    icon: "📱",
    color: "from-orange-500 to-red-500",
  },
  {
    id: 5,
    name: "Cloud Computing",
    description: "AWS, Azure, Docker, K8s",
    icon: "☁️",
    color: "from-indigo-500 to-blue-500",
  },
  {
    id: 6,
    name: "Cybersecurity",
    description: "Ethical Hacking, Penetration Testing",
    icon: "🔒",
    color: "from-red-500 to-pink-500",
  },
  {
    id: 7,
    name: "DevOps",
    description: "CI/CD, Infrastructure, Automation",
    icon: "⚙️",
    color: "from-teal-500 to-green-500",
  },
  {
    id: 8,
    name: "Game Development",
    description: "Unity, Unreal, C#, C++",
    icon: "🎮",
    color: "from-violet-500 to-purple-500",
  },
];

const codeSnippets = [
  {
    language: "JavaScript",
    code: `// AI-powered test generation
const generateTest = async (topic) => {
  const response = await ai.createTest({
    topic,
    difficulty: 'adaptive',
    questions: 10
  });
  return response.data;
};`,
  },
  {
    language: "Python",
    code: `# Smart learning analytics
def analyze_performance(results):
    accuracy = sum(results) / len(results)
    return {
        'score': accuracy * 100,
        'insights': ai.generate_insights(results)
    }`,
  },
  {
    language: "TypeScript",
    code: `interface LearningPath {
  id: string;
  skills: Skill[];
  progress: number;
  nextRecommendation: string;
}`,
  },
];

const stats = [
  { number: "50K+", label: "Questions Generated", icon: "❓" },
  { number: "10K+", label: "Active Learners", icon: "👨‍💻" },
  { number: "95%", label: "Success Rate", icon: "🚀" },
  { number: "24/7", label: "AI Support", icon: "🤖" },
];

const LandingPage = () => {
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [currentCodeIndex, setCurrentCodeIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTopicIndex((prevIndex) => (prevIndex + 1) % topics.length);
    }, 4000); // Change topic every 4 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCodeIndex((prevIndex) => (prevIndex + 1) % codeSnippets.length);
    }, 5000); // Change code every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-400/20 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-purple-400/10 to-pink-400/10 blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className='absolute inset-0 bg-[url(&apos;data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&apos;)] opacity-40'></div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 lg:px-8 pt-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 mb-8">
                <span className="text-blue-300 text-sm font-medium">
                  🚀 AI-Powered Learning Platform
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 tracking-tight">
                Master Tech Skills
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Like a Pro
                </span>
              </h1>

              {/* Dynamic Topic Display */}
              <div
                className="h-20 mb-8 flex items-center justify-center lg:justify-start"
                aria-live="polite"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTopicIndex}
                    initial={{ y: 20, opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -20, opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="flex items-center space-x-4"
                  >
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${topics[currentTopicIndex].color} flex items-center justify-center text-2xl shadow-lg`}
                    >
                      {topics[currentTopicIndex].icon}
                    </div>
                    <div className="text-left">
                      <div className="text-2xl lg:text-3xl font-bold text-white">
                        {topics[currentTopicIndex].name}
                      </div>
                      <div className="text-lg text-gray-300">
                        {topics[currentTopicIndex].description}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl lg:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto lg:mx-0 leading-relaxed"
            >
              AI-powered practice tests, instant feedback, and personalized
              learning paths. Level up your coding skills with intelligent
              assessments.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center lg:justify-start"
            >
              <Link href="/register">
                <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                  <span className="relative z-10">Start Learning Free</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </button>
              </Link>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl lg:text-3xl font-bold text-white">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column - Code Display */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Terminal Window */}
              <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
                {/* Terminal Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-gray-800/50 border-b border-gray-700">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-gray-400 text-sm font-mono">
                    proficia-ai.js
                  </div>
                  <div className="text-gray-400 text-sm">●</div>
                </div>

                {/* Code Content */}
                <div className="p-6 h-80 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentCodeIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="h-full"
                    >
                      <div className="text-sm text-gray-400 mb-2 font-mono">
                        {codeSnippets[currentCodeIndex].language}
                      </div>
                      <pre className="text-sm text-gray-300 font-mono leading-relaxed">
                        <code className="language-javascript">
                          {codeSnippets[currentCodeIndex].code}
                        </code>
                      </pre>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg animate-bounce"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full animate-pulse"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Why Developers Choose Proficia
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Built by developers, for developers. Experience the future of
              technical learning.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🧠",
                title: "AI-Powered Intelligence",
                description:
                  "Advanced algorithms adapt to your learning style and pace, creating personalized challenges that push your limits.",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                icon: "⚡",
                title: "Instant Code Analysis",
                description:
                  "Real-time feedback on your code with detailed explanations, performance insights, and optimization suggestions.",
                gradient: "from-purple-500 to-pink-500",
              },
              {
                icon: "📈",
                title: "Career Analytics",
                description:
                  "Track your progress across technologies, identify skill gaps, and get recommendations for your next career move.",
                gradient: "from-green-500 to-emerald-500",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="h-full p-8 bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Topics Grid */}
      <section className="relative py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Master Every Tech Stack
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From frontend to machine learning, we've got you covered with the
              latest industry technologies.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {topics.map((topic, index) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className="h-full p-6 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${topic.color} rounded-xl flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {topic.icon}
                  </div>
                  <h3 className="font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                    {topic.name}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {topic.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="relative p-12 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-3xl border border-gray-600">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Level Up?
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join thousands of developers who are advancing their careers with
              AI-powered learning.
            </p>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <Link href="/register">
                <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                  <span className="relative z-10">Start Free Trial</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-gray-400">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;
