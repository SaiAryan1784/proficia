"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Timer from "./Timer";
import { useTimer } from "@/hooks/useTimer";
import { TestResultShare } from "./SocialShare";
import { FaArrowLeft, FaArrowRight, FaCheck, FaTrophy, FaClock, FaFire } from "react-icons/fa";

type QuestionType = "MULTIPLE_CHOICE" | "TEXT" | "TRUE_FALSE";
type TestStatus = "DRAFT" | "IN_PROGRESS" | "COMPLETED";

interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options: string[];
  correctAnswer: string | null;
  explanation: string | null;
  userAnswer?: string;
  isCorrect?: boolean;
}

interface Test {
  id: string;
  title: string;
  description: string | null;
  status: TestStatus;
  score: number | null;
  questions: Question[];
  startedAt: string | null;
  completedAt: string | null;
  timeLimit?: number; // in minutes
}

interface GamificationResult {
  xpGain: {
    base: number;
    bonus: number;
    total: number;
    reasons: string[];
  };
  newLevel: number;
  levelUp: boolean;
  newStreak: number;
}

interface TestClientProps {
  test: Test;
}

export default function TestClient({ test }: TestClientProps) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(test.status === "COMPLETED");
  const [totalScore, setTotalScore] = useState(test.score ?? 0);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gamificationResult, setGamificationResult] = useState<GamificationResult | null>(null);
  
  const timer = useTimer(test.timeLimit);

  const handleSubmit = useCallback(async (isAutoSubmit = false) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    timer.pause();

    try {
      const response = await fetch(`/api/tests/${test.id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers: userAnswers,
          timeSpent: timer.timeSpent,
          isAutoSubmit,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to submit test");
      }
      
      const data = await response.json();
      
      // Update test with results
      test.questions = data.test.questions;
      setTotalScore(data.score);
      setShowResults(true);
      
      // Handle gamification results
      if (data.gamification) {
        setGamificationResult(data.gamification);
      }
      
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unknown error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, timer, test, userAnswers]);

  // Auto-submit when time expires
  useEffect(() => {
    if (timer.isExpired && !showResults && !isSubmitting) {
      handleSubmit(true);
    }
  }, [timer.isExpired, showResults, isSubmitting, handleSubmit]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const getAnsweredCount = () => {
    return Object.keys(userAnswers).length;
  };

  const getProgressPercentage = () => {
    return Math.round((getAnsweredCount() / test.questions.length) * 100);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8">
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-6">
          {error}
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Results Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <FaTrophy className="text-6xl text-yellow-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Test Completed!
              </h1>
              <div className="text-5xl font-bold mb-4">
                <span className={`${
                  totalScore >= 80 ? 'text-green-500' : 
                  totalScore >= 60 ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {totalScore}%
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                You answered {test.questions.filter(q => q.isCorrect).length} out of {test.questions.length} questions correctly
              </p>
              
              {/* Time Stats */}
              {test.timeLimit && (
                <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <FaClock />
                    <span>Time: {timer.formatTimeSpent()}</span>
                  </div>
                  {timer.timeSpent < (test.timeLimit * 60 * 0.75) && (
                    <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                      <FaFire />
                      <span>Speed Bonus!</span>
                    </div>
                  )}
                </div>
              )}

              {/* Gamification Results */}
              {gamificationResult && (
                <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                  <div className="flex items-center justify-center space-x-4 text-sm">
                    <div className="text-center">
                      <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                        +{gamificationResult.xpGain.total} XP
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">Experience Gained</div>
                    </div>
                    {gamificationResult.levelUp && (
                      <div className="text-center">
                        <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                          Level {gamificationResult.newLevel}!
                        </div>
                        <div className="text-gray-600 dark:text-gray-400">Level Up!</div>
                      </div>
                    )}
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                        {gamificationResult.newStreak} days
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">Streak</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Social Share */}
              {totalScore >= 50 && (
                <div className="mt-6">
                  <TestResultShare 
                    score={totalScore}
                    topic={test.title}
                    level={gamificationResult?.newLevel}
                    badges={0}
                  />
                </div>
              )}
            </div>
          </motion.div>

          {/* Detailed Results */}
          <div className="space-y-4">
            {test.questions.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 ${
                  question.isCorrect 
                    ? 'border-green-500' 
                    : 'border-red-500'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Question {index + 1}
                  </h3>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    question.isCorrect
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                      : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
                  }`}>
                    {question.isCorrect ? 'Correct' : 'Incorrect'}
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4">{question.text}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Your answer:</span>
                    <span className={`font-medium ${
                      question.isCorrect 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {question.userAnswer || 'No answer'}
                    </span>
                  </div>
                  
                  {!question.isCorrect && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Correct answer:</span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        {question.correctAnswer}
                      </span>
                    </div>
                  )}
                  
                  {question.explanation && (
                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                      <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-1">Explanation:</h4>
                      <p className="text-blue-800 dark:text-blue-400 text-sm">{question.explanation}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={() => router.push("/practice")}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors"
            >
              Take Another Test
            </button>
            <button
              onClick={() => router.push("/statistics")}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-medium transition-colors"
            >
              View Statistics
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Test taking interface
  const currentQuestion = test.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Timer and Progress */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {test.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Question {currentQuestionIndex + 1} of {test.questions.length}
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
              <Timer 
                timeLimit={test.timeLimit}
                onTimeUp={() => handleSubmit(true)}
                autoStart={true}
              />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / test.questions.length) * 100}%` }}
            />
          </div>
          
          {/* Answer Progress */}
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {getAnsweredCount()} of {test.questions.length} questions answered ({getProgressPercentage()}%)
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {currentQuestion.text}
            </h2>

            {/* Multiple Choice Options */}
            {currentQuestion.type === "MULTIPLE_CHOICE" && (
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerChange(currentQuestion.id, option)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                      userAnswers[currentQuestion.id] === option
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-md ring-2 ring-indigo-200 dark:ring-indigo-800'
                        : 'border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-gray-50 dark:hover:bg-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        userAnswers[currentQuestion.id] === option
                          ? 'border-indigo-500 bg-indigo-500 scale-110 shadow-md'
                          : 'border-gray-300 dark:border-gray-600 group-hover:border-indigo-400'
                      }`}>
                        {userAnswers[currentQuestion.id] === option && (
                          <FaCheck className="text-white text-xs animate-pulse" />
                        )}
                      </div>
                      <span className={`font-medium transition-colors ${
                        userAnswers[currentQuestion.id] === option 
                          ? 'text-indigo-700 dark:text-indigo-300 font-semibold' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {String.fromCharCode(65 + index)}. {option}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* True/False Options */}
            {currentQuestion.type === "TRUE_FALSE" && (
              <div className="grid grid-cols-2 gap-4">
                {["True", "False"].map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswerChange(currentQuestion.id, option)}
                    className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                      userAnswers[currentQuestion.id] === option
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-lg ring-2 ring-indigo-200 dark:ring-indigo-800 transform scale-105'
                        : 'border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-gray-50 dark:hover:bg-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`w-8 h-8 mx-auto mb-2 rounded-full border-2 flex items-center justify-center transition-all ${
                        userAnswers[currentQuestion.id] === option
                          ? 'border-indigo-500 bg-indigo-500 shadow-lg'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {userAnswers[currentQuestion.id] === option && (
                          <FaCheck className="text-white text-sm animate-pulse" />
                        )}
                      </div>
                      <span className={`text-lg font-semibold transition-colors ${
                        userAnswers[currentQuestion.id] === option 
                          ? 'text-indigo-700 dark:text-indigo-300 font-bold' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {option}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Text Input */}
            {currentQuestion.type === "TEXT" && (
              <textarea
                value={userAnswers[currentQuestion.id] || ""}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                placeholder="Enter your answer here..."
                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={4}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
              currentQuestionIndex === 0
                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
          >
            <FaArrowLeft />
            <span>Previous</span>
          </button>

          <div className="flex space-x-3">
            {currentQuestionIndex === test.questions.length - 1 ? (
              <button
                onClick={() => handleSubmit()}
                disabled={isSubmitting}
                className={`flex items-center space-x-2 px-6 py-2 rounded-md font-medium transition-colors ${
                  isSubmitting
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <FaCheck />
                    <span>Submit Test</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors"
              >
                <span>Next</span>
                <FaArrowRight />
              </button>
            )}
          </div>
        </div>

        {/* Question Overview */}
        <div className="mt-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Question Overview
          </h3>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {test.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`aspect-square rounded-md text-sm font-medium transition-colors ${
                  index === currentQuestionIndex
                    ? 'bg-indigo-600 text-white'
                    : userAnswers[test.questions[index].id]
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
