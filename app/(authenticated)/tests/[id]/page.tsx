"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Question {
  id: string;
  text: string;
  type: "MULTIPLE_CHOICE" | "TEXT" | "TRUE_FALSE";
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
  status: "DRAFT" | "IN_PROGRESS" | "COMPLETED";
  score: number | null;
  questions: Question[];
  startedAt: string | null;
  completedAt: string | null;
}

interface PageProps {
  params: {
    id: string;
  };
}

export default function TestPage({ params }: PageProps){
  const router = useRouter();
  const { status } = useSession();
  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    async function fetchTest() {
      try {
        const response = await fetch(`/api/tests/${params.id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch test: ${response.status}`);
        }
        const data = await response.json();
        setTest(data);
        
        // Prepare user answers object
        const answers: Record<string, string> = {};
        data.questions.forEach((q: Question) => {
          answers[q.id] = "";
        });
        setUserAnswers(answers);
        
        // If the test is already completed, show the results
        if (data.status === "COMPLETED") {
          setShowResults(true);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    }

    if (status === "authenticated") {
      fetchTest();
    }
  }, [params.id, router, status]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNextQuestion = () => {
    if (!test) return;
    
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!test) return;
    
    try {
      const response = await fetch(`/api/tests/${test.id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers: userAnswers,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to submit test");
      }
      
      const data = await response.json();
      setTest(data.test);
      setTotalScore(data.score);
      setShowResults(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unknown error occurred.");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Test not found</h1>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = test.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">{test.title}</h1>
        {test.description && <p className="text-gray-600 mb-6">{test.description}</p>}
        
        {showResults ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            <div className="mb-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{totalScore}%</p>
                <p className="text-gray-600">
                  {totalScore >= 70 ? "Great job!" : "Keep practicing!"}
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              {test.questions.map((question, index) => (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex gap-2">
                    <span className={`h-6 w-6 rounded-full flex items-center justify-center text-white text-sm ${question.isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                      {question.isCorrect ? '✓' : '✗'}
                    </span>
                    <h3 className="font-medium">Question {index + 1}</h3>
                  </div>
                  
                  <p className="mt-2">{question.text}</p>
                  
                  {question.type === "MULTIPLE_CHOICE" && (
                    <div className="mt-3 space-y-2">
                      {question.options.map((option) => (
                        <div 
                          key={option}
                          className={`p-2 rounded ${
                            question.correctAnswer === option
                              ? 'bg-green-100 border border-green-300'
                              : question.userAnswer === option && question.userAnswer !== question.correctAnswer
                              ? 'bg-red-100 border border-red-300'
                              : 'bg-gray-50 border border-gray-200'
                          }`}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {question.explanation && (
                    <div className="mt-3 bg-blue-50 p-3 rounded">
                      <p className="text-sm font-medium text-blue-800">Explanation:</p>
                      <p className="text-sm text-blue-700">{question.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <button
                onClick={() => router.push("/dashboard")}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Question {currentQuestionIndex + 1} of {test.questions.length}</h2>
              <div className="text-sm text-gray-500">
                {Math.round(((currentQuestionIndex + 1) / test.questions.length) * 100)}% complete
              </div>
            </div>
            
            <div className="mb-8">
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${((currentQuestionIndex + 1) / test.questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">{currentQuestion.text}</h3>
              
              {currentQuestion.type === "MULTIPLE_CHOICE" && (
                <div className="space-y-2">
                  {currentQuestion.options.map((option) => (
                    <div 
                      key={option} 
                      className={`
                        border rounded-lg p-3 cursor-pointer transition-all
                        ${userAnswers[currentQuestion.id] === option 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300'
                        }
                      `}
                      onClick={() => handleAnswerChange(currentQuestion.id, option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
              
              {currentQuestion.type === "TEXT" && (
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  rows={4}
                  value={userAnswers[currentQuestion.id] || ""}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  placeholder="Type your answer here..."
                ></textarea>
              )}
              
              {currentQuestion.type === "TRUE_FALSE" && (
                <div className="space-y-2">
                  {["True", "False"].map((option) => (
                    <div 
                      key={option} 
                      className={`
                        border rounded-lg p-3 cursor-pointer transition-all
                        ${userAnswers[currentQuestion.id] === option 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300'
                        }
                      `}
                      onClick={() => handleAnswerChange(currentQuestion.id, option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className={`
                  px-4 py-2 rounded transition-colors
                  ${currentQuestionIndex === 0 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}
                `}
              >
                Previous
              </button>
              
              {currentQuestionIndex === test.questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Submit Test
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 