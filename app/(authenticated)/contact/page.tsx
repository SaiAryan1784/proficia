"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaEnvelope, FaPaperPlane, FaCheck } from 'react-icons/fa';

// Developer information
const developerInfo = {
  name: "Sai Aryan",
  role: "Full Stack Developer",
  bio: "Passionate about building scalable, accessible web applications with modern technologies.",
  github: "https://github.com/Saiaryan1784",
  email: "saiaryan.goswami1784@gmail.com"
};

// Animation variants
const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 100,
      damping: 15
    }
  },
  hover: { 
    y: -5,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: { duration: 0.3 }
  }
};

const formItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      type: "spring", 
      stiffness: 100,
      damping: 15
    }
  }
};

const iconVariants = {
  hover: { 
    scale: 1.2,
    y: -3,
    color: "#6366F1",
    transition: {
      duration: 0.2
    }
  },
  tap: {
    scale: 0.9
  }
};

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
  disabled: { 
    opacity: 0.7,
    scale: 1
  }
};

// Heading text animation
const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Title reveal animation with letter staggering
const titleVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03
    }
  }
};

const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 200
    }
  }
};

// Contact Page Component
export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Animation for typing effect on page title
  const titleText = "Contact & Feedback";
  const titleLetters = Array.from(titleText);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    // Simulate form submission
    try {
      // In a real app, you would send this data to an API endpoint
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Form submitted with data:', formData);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    } catch {
      setError('There was an error submitting your feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-6 sm:py-8 md:py-12 px-4 sm:px-6 max-w-7xl mx-auto">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={textVariants}
        className="text-center mb-8 sm:mb-12"
      >
        <motion.h1 
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-600"
          variants={titleVariants}
        >
          {titleLetters.map((letter, index) => (
            <motion.span key={index} variants={letterVariants}>
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </motion.h1>
        <motion.p
          variants={textVariants}
          className="mt-3 text-base sm:text-lg text-gray-600 max-w-3xl mx-auto"
        >
          We&apos;d love to hear your thoughts on Proficia. Please share your feedback below.
        </motion.p>
      </motion.div>

      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10"
      >
        {/* Developer Card */}
        <motion.div
          variants={cardVariants}
          whileHover="hover"
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <motion.div 
                className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center"
                whileHover={{ rotate: 5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-white text-4xl font-bold">{developerInfo.name.charAt(0)}</span>
              </motion.div>
              
              <div className="text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold">{developerInfo.name}</h2>
                <p className="text-blue-600 font-medium">{developerInfo.role}</p>
                <p className="mt-2 text-gray-600">{developerInfo.bio}</p>
                
                <div className="mt-4 flex justify-center sm:justify-start space-x-4">
                  <motion.a 
                    href={developerInfo.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={iconVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="text-gray-700 hover:text-indigo-600 transition-colors"
                  >
                    <FaGithub size={24} />
                  </motion.a>
                  <motion.a 
                    href={`mailto:${developerInfo.email}`}
                    variants={iconVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="text-gray-700 hover:text-indigo-600 transition-colors"
                  >
                    <FaEnvelope size={24} />
                  </motion.a>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium mb-3">Connect With Me</h3>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center">
                  <FaGithub className="text-gray-700 mr-2" />
                  <a 
                    href={developerInfo.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {developerInfo.github.replace('https://github.com/', '@')}
                  </a>
                </div>
                <div className="flex items-center">
                  <FaEnvelope className="text-gray-700 mr-2" />
                  <a 
                    href={`mailto:${developerInfo.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {developerInfo.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feedback Form */}
        <motion.div
          variants={cardVariants}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          {isSubmitted ? (
            <motion.div 
              className="p-8 flex flex-col items-center justify-center h-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6"
              >
                <FaCheck size={40} />
              </motion.div>
              <h2 className="text-2xl font-bold text-center">Thank You!</h2>
              <p className="text-gray-600 text-center mt-2">
                Your feedback has been submitted successfully.
              </p>
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="mt-6 px-5 py-2 bg-blue-600 text-white rounded-md"
                onClick={() => setIsSubmitted(false)}
              >
                Send Another Message
              </motion.button>
            </motion.div>
          ) : (
            <div className="p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold mb-6">Send Your Feedback</h2>
              
              {error && (
                <motion.div 
                  className="mb-4 bg-red-100 text-red-700 p-3 rounded-md"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.div>
              )}
              
              <form onSubmit={handleSubmit}>
                <motion.div 
                  className="mb-4"
                  variants={formItemVariants}
                >
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                  />
                </motion.div>
                
                <motion.div 
                  className="mb-4"
                  variants={formItemVariants}
                >
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="john@example.com"
                  />
                </motion.div>
                
                <motion.div 
                  className="mb-6"
                  variants={formItemVariants}
                >
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="I have a suggestion about..."
                  ></textarea>
                </motion.div>
                
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  variants={buttonVariants}
                  whileHover={isSubmitting ? "disabled" : "hover"}
                  whileTap={isSubmitting ? "disabled" : "tap"}
                  className={`w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md font-medium flex items-center justify-center ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="mr-2" /> 
                      Submit Feedback
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}