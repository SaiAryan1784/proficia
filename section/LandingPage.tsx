"use client"
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import ButtonPrimary from '@/components/ButtonPrimary'
import { motion, AnimatePresence } from 'framer-motion'

const topics = [
  { id: 1, name: 'Web Development' },
  { id: 2, name: 'Data Science' },
  { id: 3, name: 'Machine Learning' },
  { id: 4, name: 'Mobile Development' },
  { id: 5, name: 'Cloud Computing' },
  { id: 6, name: 'Cybersecurity' },
  { id: 7, name: 'DevOps' },
  { id: 8, name: 'Game Development' },
  { id: 9, name: 'Data Structures and Algorithms' },
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
    <div className="flex flex-col justify-center h-[97vh] px-4">
      <div className="ml-8 md:ml-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 text-left text-transparent bg-clip-text bg-gradient-to-r from-[#456cc5] to-[#435170]" style={{ backgroundSize: '200% 100%', backgroundPosition: '70% 0' }}>
          A New Way To <br /> Learn{" "}
        </h1>
        
        <div className="text-blue-600 h-16 overflow-hidden mb-8">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentTopicIndex}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block text-4xl md:text-6xl font-bold"
            >
              {topics[currentTopicIndex].name}
            </motion.span>
          </AnimatePresence>
        </div>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl text-left">
          Master the most in-demand skills with our interactive platform.
          Learn at your own pace with expert-led courses.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/register">
            <ButtonPrimary text="Get Started" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LandingPage