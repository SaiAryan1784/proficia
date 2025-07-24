"use client"
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import ButtonPrimary from '@/components/ButtonPrimary'
import { motion, AnimatePresence } from 'framer-motion'

const topics = [
  { id: 1, name: 'Web Dev', description: 'Frontend and backend development' },
  { id: 2, name: 'Data Science', description: 'Analytics and machine learning' },
  { id: 3, name: 'ML/AI', description: 'Artificial intelligence and deep learning' },
  { id: 4, name: 'Mobile Dev', description: 'iOS and Android development' },
  { id: 5, name: 'Cloud', description: 'AWS, Azure, and cloud architecture' },
  { id: 6, name: 'Security', description: 'Cybersecurity and ethical hacking' },
  { id: 7, name: 'DevOps', description: 'CI/CD and infrastructure automation' },
  { id: 8, name: 'Game Dev', description: 'Game design and development' },
  { id: 9, name: 'Algorithms', description: 'Data structures and problem solving' },
]

const LandingPage = () => {
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTopicIndex((prevIndex) => (prevIndex + 1) % topics.length)
    }, 3000) // Change topic every 3 seconds
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="relative bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main Headline */}
          <header className="mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#456cc5] to-[#435170]">
              A New Way To Learn{" "}
              <br className="hidden sm:block" />
              <span className="sr-only">Technology Skills</span>
            </h1>
            
            {/* Dynamic Topic Display */}
            <div className="h-16 sm:h-20 overflow-hidden mb-8 flex items-center justify-center" aria-live="polite" aria-label="Currently featured topic">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentTopicIndex}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -40, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600"
                  title={topics[currentTopicIndex].description}
                >
                  {topics[currentTopicIndex].name}
                </motion.span>
              </AnimatePresence>
            </div>
          </header>
          
          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Master the most in-demand technology skills with our AI-powered interactive platform.
            Learn at your own pace with personalized practice tests, instant feedback, and gamified progress tracking.
          </p>

          {/* CTA Button */}
          <div className="mb-16">
            <Link href="/register" aria-label="Start your learning journey with Proficia">
              <ButtonPrimary text="Get Started Free" />
            </Link>
            <p className="mt-4 text-sm text-gray-500">
              Join thousands of learners • Free to start • No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Proficia?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform combines AI technology with proven learning methodologies
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI-Generated Tests</h3>
              <p className="text-gray-600">Personalized practice tests adapted to your skill level and learning pace.</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Instant Feedback</h3>
              <p className="text-gray-600">Get immediate explanations and track your progress with detailed analytics.</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Gamified Learning</h3>
              <p className="text-gray-600">Earn XP, unlock badges, and maintain learning streaks to stay motivated.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Available Learning Topics
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose from our comprehensive catalog of technology subjects
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => (
              <div 
                key={topic.id} 
                className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{topic.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{topic.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of learners who are already advancing their tech careers with Proficia.
          </p>
          <Link href="/register" aria-label="Start your learning journey with Proficia">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors duration-200 shadow-lg">
              Get Started Free
            </button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default LandingPage