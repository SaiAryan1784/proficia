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
    <div className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-8 text-center">
        <header>
          <h1 className="text-4xl md:text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#456cc5] to-[#435170]" style={{ backgroundSize: '200% 100%', backgroundPosition: '70% 0' }}>
            A New Way To <br /> Learn{" "}
            <span className="sr-only">Technology Skills</span>
          </h1>
        </header>
        
        <div className="text-blue-600 h-20 md:h-24 overflow-hidden mb-8 flex items-center justify-center" aria-live="polite" aria-label="Currently featured topic">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentTopicIndex}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block text-3xl md:text-5xl font-bold"
              title={topics[currentTopicIndex].description}
            >
              {topics[currentTopicIndex].name}
            </motion.span>
          </AnimatePresence>
        </div>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Master the most in-demand technology skills with our AI-powered interactive platform.
          Learn at your own pace with personalized practice tests, instant feedback, and gamified progress tracking.
        </p>

        {/* Key Features for SEO */}
        <div className="grid md:grid-cols-3 gap-6 mb-8 text-left">
          <div className="p-4 bg-white/50 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">AI-Generated Tests</h3>
            <p className="text-gray-600 text-sm">Personalized practice tests adapted to your skill level and learning pace.</p>
          </div>
          <div className="p-4 bg-white/50 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Instant Feedback</h3>
            <p className="text-gray-600 text-sm">Get immediate explanations and track your progress with detailed analytics.</p>
          </div>
          <div className="p-4 bg-white/50 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Gamified Learning</h3>
            <p className="text-gray-600 text-sm">Earn XP, unlock badges, and maintain learning streaks to stay motivated.</p>
          </div>
        </div>

        {/* Topics List for SEO */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Learning Topics</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            {topics.map((topic) => (
              <div key={topic.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-900">{topic.name}</h3>
                <p className="text-gray-600 text-xs">{topic.description}</p>
              </div>
            ))}
          </div>
        </section>
        
        <div className="flex justify-center">
          <Link href="/register" aria-label="Start your learning journey with Proficia">
            <ButtonPrimary text="Get Started Free" />
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="mt-8 text-sm text-gray-500">
          <p>Join thousands of learners improving their tech skills • Free to start • No credit card required</p>
        </div>
      </div>
    </div>
  )
}

export default LandingPage