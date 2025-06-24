"use client"
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import ButtonPrimary from '@/components/ButtonPrimary'
import { motion, AnimatePresence } from 'framer-motion'

const topics = [
  { id: 1, name: 'Web Dev' },
  { id: 2, name: 'Data Science' },
  { id: 3, name: 'ML/AI' },
  { id: 4, name: 'Mobile Dev' },
  { id: 5, name: 'Cloud' },
  { id: 6, name: 'Security' },
  { id: 7, name: 'DevOps' },
  { id: 8, name: 'Game Dev' },
  { id: 9, name: 'Algorithms' },
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
        <h1 className="text-4xl md:text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#456cc5] to-[#435170]" style={{ backgroundSize: '200% 100%', backgroundPosition: '70% 0' }}>
          A New Way To <br /> Learn{" "}
        </h1>
        
        <div className="text-blue-600 h-20 md:h-24 overflow-hidden mb-8 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentTopicIndex}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block text-3xl md:text-5xl font-bold"
            >
              {topics[currentTopicIndex].name}
            </motion.span>
          </AnimatePresence>
        </div>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Master the most in-demand skills with our interactive platform.
          Learn at your own pace with expert-led courses.
        </p>
        
        <div className="flex justify-center">
          <Link href="/register">
            <ButtonPrimary text="Get Started" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LandingPage