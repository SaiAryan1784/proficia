"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaPlay, FaStar } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface Topic {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
}

interface TestConfig {
  topicId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
}

export default function PracticePage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [testConfig, setTestConfig] = useState<TestConfig>({
    topicId: '',
    difficulty: 'medium',
    questionCount: 10,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");
  
  const router = useRouter();

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await fetch('/api/topics');
      if (response.ok) {
        const data = await response.json();
        setTopics(data.topics);
      }
    } catch (error) {
      console.error('Failed to fetch topics:', error);
    }
  };

  const handleImageError = (id: string) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
    setTestConfig(prev => ({ ...prev, topicId: topic.id }));
  };

  const generateTest = async () => {
    if (!selectedTopic) return;

    setIsGenerating(true);
    setError(""); // Clear any previous errors
    
    try {
      const response = await fetch('/api/tests/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testConfig),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/tests/${data.test.id}`);
      } else {
        const errorData = await response.json();
        
        // Handle rate limiting specifically
        if (response.status === 429) {
          setError(errorData.message || "Daily test limit reached. You can only create 3 tests per day.");
        } else {
          setError(errorData.error || 'Failed to generate test');
        }
      }
    } catch (error) {
      console.error('Error generating test:', error);
      setError('Failed to generate test. Please try again later.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'hard': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Practice Tests
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Choose a topic and customize your test to start practicing
          </p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Topic Selection */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Select a Topic
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topics.map((topic) => (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer border-2 transition-all ${
                    selectedTopic?.id === topic.id
                      ? 'border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-800'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => handleTopicSelect(topic)}
                >
                  <div className="relative h-32 bg-gray-200 dark:bg-gray-700">
                    {!imageErrors[topic.id] ? (
                      <Image
                        src={topic.imageUrl}
                        alt={topic.name}
                        fill
                        className="object-cover"
                        onError={() => handleImageError(topic.id)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-500 dark:text-gray-400">
                        {topic.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {topic.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {topic.description}
                    </p>
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded">
                      {topic.category}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Test Configuration */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 sticky top-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Test Configuration
              </h2>

              {selectedTopic && (
                <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                  <div className="flex items-center space-x-2">
                    <FaStar className="text-indigo-500" />
                    <span className="font-medium text-indigo-900 dark:text-indigo-300">
                      {selectedTopic.name}
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Difficulty
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['easy', 'medium', 'hard'] as const).map((difficulty) => (
                      <button
                        key={difficulty}
                        onClick={() => setTestConfig(prev => ({ ...prev, difficulty }))}
                        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          testConfig.difficulty === difficulty
                            ? getDifficultyColor(difficulty)
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question Count */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Number of Questions
                  </label>
                  <select
                    value={testConfig.questionCount}
                    onChange={(e) => setTestConfig(prev => ({ ...prev, questionCount: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={5}>5 questions</option>
                    <option value={10}>10 questions</option>
                    <option value={15}>15 questions</option>
                    <option value={20}>20 questions</option>
                    <option value={25}>25 questions</option>
                  </select>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  ⏱️ Time limit: 1 minute per question
                </div>

                {/* Generate Button */}
                <button
                  onClick={generateTest}
                  disabled={!selectedTopic || isGenerating}
                  className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-medium transition-colors ${
                    selectedTopic && !isGenerating
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <FaPlay />
                      <span>Start Test</span>
                    </>
                  )}
                </button>

                {/* Test Info */}
                {selectedTopic && (
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Test Summary
                    </h4>
                    <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex justify-between">
                        <span>Topic:</span>
                        <span>{selectedTopic.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Difficulty:</span>
                        <span className={`px-1 rounded ${getDifficultyColor(testConfig.difficulty)}`}>
                          {testConfig.difficulty}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Questions:</span>
                        <span>{testConfig.questionCount} ({testConfig.questionCount} min)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
