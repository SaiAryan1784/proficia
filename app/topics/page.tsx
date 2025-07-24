"use client";
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import NavbarPrimary from '@/components/NavbarPrimary'
import { motion, AnimatePresence } from 'framer-motion'

const topicsData = [
  {
    slug: 'web-dev',
    name: 'Web Development',
    description: 'Build modern web applications with React, Node.js, and cutting-edge frameworks',
    icon: '🌐',
    color: 'from-blue-500 to-cyan-500',
    skills: ['React', 'Node.js', 'TypeScript', 'Next.js'],
    difficulty: 'Beginner to Advanced',
    duration: '3-6 months',
    students: '12,543',
    featured: true
  },
  {
    slug: 'data-science',
    name: 'Data Science',
    description: 'Master Python, R, SQL, and machine learning for data-driven insights',
    icon: '📊',
    color: 'from-green-500 to-emerald-500',
    skills: ['Python', 'R', 'SQL', 'Machine Learning'],
    difficulty: 'Intermediate',
    duration: '4-8 months',
    students: '8,921',
    featured: true
  },
  {
    slug: 'ml-ai',
    name: 'Machine Learning & AI',
    description: 'Deep learning, neural networks, and artificial intelligence systems',
    icon: '🤖',
    color: 'from-purple-500 to-pink-500',
    skills: ['TensorFlow', 'PyTorch', 'Neural Networks', 'NLP'],
    difficulty: 'Advanced',
    duration: '6-12 months',
    students: '6,732',
    featured: true
  },
  {
    slug: 'mobile-dev',
    name: 'Mobile Development',
    description: 'Create native and cross-platform mobile apps for iOS and Android',
    icon: '📱',
    color: 'from-orange-500 to-red-500',
    skills: ['React Native', 'Swift', 'Kotlin', 'Flutter'],
    difficulty: 'Intermediate',
    duration: '4-6 months',
    students: '9,456'
  },
  {
    slug: 'cloud',
    name: 'Cloud Computing',
    description: 'AWS, Azure, Docker, Kubernetes, and cloud-native architectures',
    icon: '☁️',
    color: 'from-indigo-500 to-blue-500',
    skills: ['AWS', 'Azure', 'Docker', 'Kubernetes'],
    difficulty: 'Intermediate to Advanced',
    duration: '3-5 months',
    students: '7,823'
  },
  {
    slug: 'security',
    name: 'Cybersecurity',
    description: 'Ethical hacking, penetration testing, and security best practices',
    icon: '🔒',
    color: 'from-red-500 to-pink-500',
    skills: ['Ethical Hacking', 'Network Security', 'Cryptography', 'Pentesting'],
    difficulty: 'Intermediate to Advanced',
    duration: '4-8 months',
    students: '5,634'
  },
  {
    slug: 'devops',
    name: 'DevOps',
    description: 'CI/CD pipelines, infrastructure automation, and deployment strategies',
    icon: '⚙️',
    color: 'from-teal-500 to-green-500',
    skills: ['Jenkins', 'Terraform', 'Ansible', 'CI/CD'],
    difficulty: 'Intermediate to Advanced',
    duration: '3-6 months',
    students: '4,987'
  },
  {
    slug: 'game-dev',
    name: 'Game Development',
    description: 'Unity, Unreal Engine, and interactive entertainment development',
    icon: '🎮',
    color: 'from-violet-500 to-purple-500',
    skills: ['Unity', 'Unreal Engine', 'C#', 'C++'],
    difficulty: 'Intermediate',
    duration: '4-8 months',
    students: '3,421'
  },
  {
    slug: 'algorithms',
    name: 'Algorithms & Data Structures',
    description: 'Master computational thinking and problem-solving fundamentals',
    icon: '🧮',
    color: 'from-yellow-500 to-orange-500',
    skills: ['Data Structures', 'Algorithm Design', 'Big O', 'Dynamic Programming'],
    difficulty: 'Intermediate to Advanced',
    duration: '3-6 months',
    students: '8,765'
  }
]

const categories = [
  { name: 'All Topics', count: topicsData.length },
  { name: 'Frontend', count: 3 },
  { name: 'Backend', count: 4 },
  { name: 'Data & AI', count: 2 },
  { name: 'Mobile', count: 1 },
  { name: 'DevOps', count: 2 }
]

const TopicsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Topics')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredTopics, setFilteredTopics] = useState(topicsData)

  useEffect(() => {
    let filtered = topicsData

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(topic =>
        topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Filter by category (simplified logic for demo)
    if (selectedCategory !== 'All Topics') {
      // This would be more sophisticated in a real app
      filtered = filtered.filter(topic => {
        switch (selectedCategory) {
          case 'Frontend':
            return ['web-dev', 'mobile-dev', 'game-dev'].includes(topic.slug)
          case 'Backend':
            return ['web-dev', 'cloud', 'devops', 'security'].includes(topic.slug)
          case 'Data & AI':
            return ['data-science', 'ml-ai'].includes(topic.slug)
          case 'Mobile':
            return topic.slug === 'mobile-dev'
          case 'DevOps':
            return ['devops', 'cloud'].includes(topic.slug)
          default:
            return true
        }
      })
    }

    setFilteredTopics(filtered)
  }, [searchTerm, selectedCategory])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-cyan-400/10 to-blue-400/10 blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%239C92AC&quot; fill-opacity=&quot;0.03&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;1&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>

      <NavbarPrimary />

      <div className="relative pt-20">
        {/* Hero Section */}
        <section className="px-6 lg:px-8 py-16">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8">
                Browse
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent block">
                  Tech Topics
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
                Explore our comprehensive collection of AI-powered practice tests across the most in-demand technologies.
              </p>
            </motion.div>

            {/* Search and Filter Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-4xl mx-auto mb-12"
            >
              {/* Search Bar */}
              <div className="relative mb-8">
                <input
                  type="text"
                  placeholder="Search topics, skills, or technologies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-3">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                      selectedCategory === category.name
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-800/40 backdrop-blur-sm text-gray-300 hover:bg-gray-700/50 border border-gray-600'
                    }`}
                  >
                    {category.name}
                    <span className="ml-2 text-sm opacity-75">({category.count})</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Topics */}
        <section className="px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 text-center">
                🌟 Featured Learning Paths
              </h2>
              <p className="text-gray-300 text-center max-w-2xl mx-auto mb-8">
                Our most popular and comprehensive topics, chosen by thousands of learners worldwide.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {topicsData.filter(topic => topic.featured).map((topic, index) => (
                <motion.div
                  key={topic.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="group"
                >
                  <Link href={`/topics/${topic.slug}`}>
                    <div className="h-full p-8 bg-gray-800/40 backdrop-blur-sm rounded-3xl border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer">
                      <div className="relative">
                        <div className={`w-20 h-20 bg-gradient-to-br ${topic.color} rounded-3xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                          {topic.icon}
                        </div>
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          ⭐ Featured
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                        {topic.name}
                      </h3>
                      
                      <p className="text-gray-300 mb-6 leading-relaxed">
                        {topic.description}
                      </p>

                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {topic.skills.slice(0, 3).map((skill) => (
                            <span key={skill} className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                          {topic.skills.length > 3 && (
                            <span className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm">
                              +{topic.skills.length - 3} more
                            </span>
                          )}
                        </div>

                        <div className="flex justify-between text-sm text-gray-400">
                          <span>📚 {topic.difficulty}</span>
                          <span>👥 {topic.students} learners</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* All Topics Grid */}
        <section className="px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 text-center">
                All Learning Topics
              </h2>
              <p className="text-gray-300 text-center max-w-2xl mx-auto">
                Showing {filteredTopics.length} of {topicsData.length} topics
                {searchTerm && ` matching "${searchTerm}"`}
                {selectedCategory !== 'All Topics' && ` in ${selectedCategory}`}
              </p>
            </motion.div>

            <AnimatePresence>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTopics.map((topic, index) => (
                  <motion.div
                    key={topic.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    layout
                    className="group"
                  >
                    <Link href={`/topics/${topic.slug}`}>
                      <div className="h-full p-6 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer">
                        <div className={`w-16 h-16 bg-gradient-to-br ${topic.color} rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                          {topic.icon}
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                          {topic.name}
                        </h3>
                        
                        <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                          {topic.description}
                        </p>

                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-1">
                            {topic.skills.slice(0, 2).map((skill) => (
                              <span key={skill} className="px-2 py-1 bg-gray-700/40 text-gray-300 rounded text-xs">
                                {skill}
                              </span>
                            ))}
                            {topic.skills.length > 2 && (
                              <span className="px-2 py-1 bg-gray-700/40 text-gray-300 rounded text-xs">
                                +{topic.skills.length - 2}
                              </span>
                            )}
                          </div>

                          <div className="flex justify-between text-xs text-gray-500">
                            <span>⏱️ {topic.duration}</span>
                            <span>👥 {topic.students}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>

            {filteredTopics.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-white mb-2">No topics found</h3>
                <p className="text-gray-400 mb-6">
                  Try adjusting your search terms or category filter.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('All Topics')
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-colors"
                >
                  Clear Filters
                </button>
              </motion.div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="p-12 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-3xl border border-gray-600">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to Start Learning?
              </h2>
              <p className="text-xl text-gray-300 mb-10">
                Choose any topic and start your AI-powered learning journey today.
              </p>
              <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
                <Link href="/register">
                  <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                    <span className="relative z-10">Create Free Account</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  </button>
                </Link>
                <Link href="/login">
                  <button className="px-8 py-4 border-2 border-gray-400 text-gray-300 font-semibold rounded-xl hover:border-white hover:text-white transition-all duration-200 backdrop-blur-sm">
                    Sign In to Continue
                  </button>
                </Link>
              </div>
              <p className="mt-6 text-sm text-gray-400">
                No credit card required • Instant access • 14-day free trial
              </p>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  )
}

export default TopicsPage