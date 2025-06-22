"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaHistory, 
  FaChevronDown, 
  FaChevronUp, 
  FaClock, 
  FaTrophy, 
  FaQuestionCircle,
  FaCheck,
  FaTimes,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  userAnswer?: number;
  explanation?: string;
}

interface TestHistoryItem {
  id: string;
  topicName: string;
  category: string;
  score: number;
  totalQuestions: number;
  difficulty: string;
  timeSpent: number;
  completedAt: string;
  questions: Question[];
}

interface TestHistoryProps {
  initialTests?: TestHistoryItem[];
  totalTests?: number;
}

const TestHistory: React.FC<TestHistoryProps> = ({ initialTests = [], totalTests = 0 }) => {
  const [tests, setTests] = useState<TestHistoryItem[]>(initialTests);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedTest, setExpandedTest] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  const fetchTestHistory = useCallback(async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/user/test-history?page=${page}&limit=5`);
      if (!response.ok) {
        throw new Error('Failed to fetch test history');
      }
      
      const data = await response.json();
      setTests(data.tests);
      setCurrentPage(data.pagination.currentPage);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      setError('Failed to load test history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasInitialized) {
      setHasInitialized(true);
      if (initialTests.length === 0) {
        fetchTestHistory();
      } else {
        setTests(initialTests);
      }
    }
  }, [hasInitialized, fetchTestHistory, initialTests]); // Now safe to include dependencies

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchTestHistory(page);
    }
  };

  const toggleTestExpansion = (testId: string) => {
    setExpandedTest(expandedTest === testId ? null : testId);
    setSelectedQuestion(null);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
      case 'hard': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (loading && tests.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 dark:text-gray-400">Loading test history...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <FaHistory className="text-2xl text-blue-500" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Test History</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">({totalTests || tests.length} tests)</span>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {tests.length === 0 ? (
        <div className="text-center py-12">
          <FaQuestionCircle className="text-4xl text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No tests completed yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">Take your first test to see your history here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tests.map((test, index) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div
                className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => toggleTestExpansion(test.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{test.topicName}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(test.difficulty)}`}>
                        {test.difficulty}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{test.category}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <FaTrophy className="text-xs" />
                        <span className={`font-medium ${getScoreColor(test.score)}`}>
                          {test.score}% ({Math.round(test.score * test.totalQuestions / 100)}/{test.totalQuestions})
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <FaClock className="text-xs" />
                        <span>{formatDuration(test.timeSpent)}</span>
                      </div>
                      
                      <span>{new Date(test.completedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    {expandedTest === test.id ? (
                      <FaChevronUp className="text-gray-400" />
                    ) : (
                      <FaChevronDown className="text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {expandedTest === test.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-200 dark:border-gray-600"
                  >
                    <div className="p-4 bg-gray-50 dark:bg-gray-700">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Questions & Answers</h4>
                      
                      <div className="space-y-3">
                        {test.questions.map((question, qIndex) => (
                          <div
                            key={question.id}
                            className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden"
                          >
                            <div
                              className="p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                              onClick={() => setSelectedQuestion(
                                selectedQuestion === question.id ? null : question.id
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Q{qIndex + 1}
                                  </span>
                                  {question.userAnswer === question.correctAnswer ? (
                                    <FaCheck className="text-green-500 text-sm" />
                                  ) : (
                                    <FaTimes className="text-red-500 text-sm" />
                                  )}
                                  <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                    {question.question.length > 60 
                                      ? `${question.question.substring(0, 60)}...`
                                      : question.question
                                    }
                                  </span>
                                </div>
                                
                                {selectedQuestion === question.id ? (
                                  <FaChevronUp className="text-gray-400 text-sm" />
                                ) : (
                                  <FaChevronDown className="text-gray-400 text-sm" />
                                )}
                              </div>
                            </div>

                            <AnimatePresence>
                              {selectedQuestion === question.id && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="border-t border-gray-200 dark:border-gray-600 p-4 bg-white dark:bg-gray-800"
                                >
                                  <div className="mb-4">
                                    <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                                      {question.question}
                                    </h5>
                                  </div>
                                  
                                  <div className="space-y-2 mb-4">
                                    {question.options.map((option, optIndex) => (
                                      <div
                                        key={optIndex}
                                        className={`p-2 rounded border text-sm ${
                                          optIndex === question.correctAnswer
                                            ? 'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700 text-green-800 dark:text-green-200'
                                            : optIndex === question.userAnswer && question.userAnswer !== question.correctAnswer
                                            ? 'bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200'
                                            : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                                        }`}
                                      >
                                        <div className="flex items-center gap-2">
                                          {optIndex === question.correctAnswer && (
                                            <FaCheck className="text-green-600 dark:text-green-400" />
                                          )}
                                          {optIndex === question.userAnswer && question.userAnswer !== question.correctAnswer && (
                                            <FaTimes className="text-red-600 dark:text-red-400" />
                                          )}
                                          <span className="font-medium">
                                            {String.fromCharCode(65 + optIndex)}.
                                          </span>
                                          <span>{option}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  
                                  {question.explanation && (
                                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                                      <h6 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                                        Explanation:
                                      </h6>
                                      <p className="text-sm text-blue-700 dark:text-blue-300">
                                        {question.explanation}
                                      </p>
                                    </div>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaChevronLeft className="text-xs" />
            Previous
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
          </div>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <FaChevronRight className="text-xs" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TestHistory;
