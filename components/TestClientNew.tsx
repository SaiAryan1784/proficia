"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTimer } from "@/hooks/useTimer";
import { FaArrowLeft, FaArrowRight, FaCheck, FaTrophy, FaClock, FaTimes, FaList } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

type QuestionType = "MULTIPLE_CHOICE" | "TEXT" | "TRUE_FALSE";
type TestStatus = "DRAFT" | "IN_PROGRESS" | "COMPLETED";

interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options: string[];
  correctAnswer: string | null;
  explanation: string | null;
  reference?: string | null;
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
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [testStatus, setTestStatus] = useState<TestStatus>(test.status);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const timer = useTimer(test.timeLimit);
  const currentQuestion = test.questions[currentQuestionIndex];

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

  // Auto-start timer when test begins
  useEffect(() => {
    if (testStatus !== "COMPLETED" && test.timeLimit && !timer.isRunning) {
      timer.start();
    }
  }, [testStatus, test.timeLimit, timer.isRunning, timer.start]);

  // Handle page exit attempts during active test
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Only show warning if test is in progress and not completed
      if (!showResults && testStatus !== "COMPLETED") {
        e.preventDefault();
        return '';
      }
    };

    // Add event listener only during active test
    if (!showResults && testStatus !== "COMPLETED") {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [showResults, testStatus]);

  // Start the test automatically when component mounts
  useEffect(() => {
    const startTest = async () => {
      if (test.status === "DRAFT") {
        try {
          const response = await fetch(`/api/tests/${test.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: "IN_PROGRESS",
              startedAt: new Date().toISOString(),
            }),
          });

          if (response.ok) {
            setTestStatus("IN_PROGRESS");
          }
        } catch (error) {
          console.error("Error starting test:", error);
        }
      } else if (test.status === "IN_PROGRESS") {
        setTestStatus("IN_PROGRESS");
      }
    };

    startTest();
  }, [test.id, test.status]);

  const handleExitConfirm = async () => {
    setShowExitConfirmation(false);
    await handleSubmit(false); // Submit current answers
    router.push("/dashboard");
  };

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

  const getAnsweredCount = () => Object.keys(userAnswers).length;
  const progressPercent = Math.round(((currentQuestionIndex + 1) / test.questions.length) * 100);

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-8 text-center">
        <div className="rounded-full bg-destructive/10 p-4 text-destructive mb-4">
          <FaTimes size={32} />
        </div>
        <h2 className="text-xl font-bold mb-2">Error Occurred</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={() => router.push("/dashboard")}>Return to Dashboard</Button>
      </div>
    );
  }

  // RESULTS VIEW
  if (showResults) {
    return (
      <ScrollArea className="h-[calc(100vh-4rem)] w-full">
        <div className="container max-w-4xl mx-auto py-10 px-4">
          {/* Header Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10 text-primary mb-6 ring-8 ring-primary/5">
              <FaTrophy size={48} />
            </div>
            <h1 className="text-4xl font-bold mb-2">Assessment Complete</h1>
            <p className="text-muted-foreground mb-8">Here is how you performed on {test.title}</p>

            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
              <div className="p-4 rounded-2xl bg-card border border-border shadow-sm">
                <div className={`text-4xl font-bold mb-1 ${totalScore >= 80 ? 'text-green-500' : totalScore >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                  {totalScore}%
                </div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Score</div>
              </div>
              <div className="p-4 rounded-2xl bg-card border border-border shadow-sm">
                <div className="text-4xl font-bold mb-1 text-foreground">
                  {test.questions.filter(q => q.isCorrect).length}/{test.questions.length}
                </div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Correct</div>
              </div>
              <div className="p-4 rounded-2xl bg-card border border-border shadow-sm">
                <div className="text-4xl font-bold mb-1 text-foreground">
                  {gamificationResult?.xpGain.total || 0}
                </div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">XP Earned</div>
              </div>
            </div>

            {/* Gamification Badge */}
            {gamificationResult?.levelUp && (
              <div className="mt-8 inline-block px-6 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-orange-600 font-bold border border-orange-500/30">
                🎉 Level Up! You are now Level {gamificationResult.newLevel}
              </div>
            )}

            <div className="flex justify-center gap-4 mt-10">
              <Button onClick={() => router.push("/dashboard")} size="lg">Return to Dashboard</Button>
              <Button onClick={() => router.push("/statistics")} variant="outline" size="lg">View Statistics</Button>
            </div>
          </motion.div>

          {/* Question Analysis */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4 mb-6">
              <h2 className="text-xl font-bold">Detailed Analysis</h2>
            </div>
            {test.questions.map((q, i) => (
              <div key={q.id} className={`p-6 rounded-xl border ${q.isCorrect ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
                <div className="flex gap-4">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${q.isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {i + 1}
                  </div>
                  <div className="space-y-3 w-full">
                    <p className="font-medium text-lg">{q.text}</p>

                    <div className="grid md:grid-cols-2 gap-4 text-sm mt-2">
                      <div className="p-3 rounded-lg bg-background/50 border border-border/50">
                        <span className="text-muted-foreground block text-xs mb-1">Your Answer</span>
                        <span className={q.isCorrect ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>{q.userAnswer || "Skipped"}</span>
                      </div>
                      {!q.isCorrect && (
                        <div className="p-3 rounded-lg bg-background/50 border border-border/50">
                          <span className="text-muted-foreground block text-xs mb-1">Correct Answer</span>
                          <span className="text-foreground font-medium">{q.correctAnswer}</span>
                        </div>
                      )}
                    </div>

                    {q.explanation && (
                      <div className="mt-3 text-sm text-muted-foreground bg-background/30 p-3 rounded-lg">
                        <span className="font-semibold text-foreground mr-1">Explanation:</span>
                        {q.explanation}
                      </div>
                    )}
                    {q.reference && (
                      <div className="mt-2 text-xs text-muted-foreground bg-muted/20 px-3 py-1.5 rounded border-l-2 border-primary/40 italic">
                        <span className="font-semibold not-italic text-foreground">Source: </span>
                        {q.reference}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    );
  }

  // ACTIVE TEST VIEW ("Focus Mode")
  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] max-h-[calc(100vh-6.5rem)] bg-background overflow-hidden relative rounded-xl border border-border shadow-sm">

      {/* 1. Sticky Header */}
      <header className="flex-shrink-0 h-16 border-b border-border bg-card/50 backdrop-blur-sm px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-4">
          {/* Sidebar Toggle */}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-muted rounded-md text-muted-foreground lg:hidden">
            <FaList />
          </button>

          <div>
            <h1 className="font-bold text-foreground truncate max-w-[200px] md:max-w-md">{test.title}</h1>
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <span>Question {currentQuestionIndex + 1} of {test.questions.length}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {test.timeLimit && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-base font-bold font-mono transition-all shadow-sm border-2 ${timer.timeStatus === 'critical'
                ? 'bg-red-50 text-red-700 border-red-300 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800 animate-pulse'
                : timer.timeStatus === 'warning'
                  ? 'bg-yellow-50 text-yellow-700 border-yellow-300 dark:bg-yellow-950/50 dark:text-yellow-300 dark:border-yellow-800'
                  : 'bg-primary/10 text-primary border-primary/30 dark:bg-primary/20'
              }`}>
              <div className={timer.timeStatus === 'critical' ? 'animate-bounce' : ''}>
                <FaClock size={16} />
              </div>
              <span className="tabular-nums">{timer.formatTime()}</span>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={() => setShowExitConfirmation(true)} className="text-muted-foreground hover:text-destructive">
            <FaTimes size={18} />
          </Button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="h-1 bg-muted w-full flex-shrink-0">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* 2. Main Content (Split Pane) */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* Left Pane: Question Context / Stem */}
        <div className="flex-1 flex flex-col min-w-0 bg-background/50">
          <ScrollArea className="flex-1 p-6 md:p-10 w-full">
            <div className="max-w-3xl mx-auto space-y-8">
              <motion.div
                key={`q-${currentQuestion.id}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="prose dark:prose-invert max-w-none"
              >
                <h2 className="text-2xl md:text-3xl font-medium leading-relaxed font-serif text-foreground mb-4">
                  {currentQuestion.text}
                </h2>
                {currentQuestion.reference && (
                  <div className="mt-3 text-sm text-muted-foreground bg-muted/30 px-4 py-2 rounded-lg border-l-4 border-primary/50 italic">
                    <span className="font-semibold not-italic text-foreground">Source: </span>
                    {currentQuestion.reference}
                  </div>
                )}
              </motion.div>
            </div>
          </ScrollArea>
        </div>

        {/* Right Pane: Options (On Mobile, this is stacked or same view) */}
        {/* We use a max-width container centered or split based on design preferences. 
            For this "Zen Mode", let's keep it centered if single column, or split. 
            Detailed design: Text on top, Options below is better for reading flow usually. 
            But plan said "2-column grid". Let's stick to 2-column for Desktop.
        */}
        <div className="hidden lg:flex w-[400px] xl:w-[480px] border-l border-border bg-card/30 flex-col">
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Select Answer</h3>
              <QuestionOptions
                question={currentQuestion}
                userAnswers={userAnswers}
                onAnswer={handleAnswerChange}
              />
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Mobile/Tablet Options Interleave (If lg is hidden, show this instead within the main scroll area? 
          Actually, for a robust responsive design, let's put the options IN the main scroll area for mobile, 
          and show the separate pane for desktop.
      */}
      <div className="lg:hidden absolute inset-x-0 bottom-[80px] p-4 bg-gradient-to-t from-background via-background to-transparent z-10 pointer-events-none">
        <div className="pointer-events-auto bg-card border border-border rounded-xl shadow-lg p-4 max-h-[40vh] overflow-y-auto">
          <QuestionOptions
            question={currentQuestion}
            userAnswers={userAnswers}
            onAnswer={handleAnswerChange}
          />
        </div>
      </div>


      {/* 3. Sticky Footer */}
      <footer className="flex-shrink-0 h-20 border-t border-border bg-background px-6 flex items-center justify-between z-20">
        <Button
          variant="ghost"
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className="gap-2"
        >
          <FaArrowLeft size={16} /> Previous
        </Button>

        <div className="text-sm font-medium text-muted-foreground hidden md:block">
          {getAnsweredCount()} / {test.questions.length} Answered
        </div>

        {currentQuestionIndex === test.questions.length - 1 ? (
          <Button onClick={() => handleSubmit()} disabled={isSubmitting} className="gap-2" size="lg">
            {isSubmitting ? "Submitting..." : "Submit Assessment"} <FaCheck size={16} />
          </Button>
        ) : (
          <Button onClick={handleNextQuestion} className="gap-2" size="lg">
            Next Question <FaArrowRight size={16} />
          </Button>
        )}
      </footer>

      {/* Exit Confirmation Modal */}
      <AnimatePresence>
        {showExitConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-xl shadow-xl max-w-md w-full p-6 border border-border"
            >
              <h3 className="text-lg font-semibold text-foreground mb-4">Exit Assessment?</h3>
              <p className="text-muted-foreground mb-6">
                Test is in progress. Exit now will save your current answers but you might lose your streak bonus.
              </p>
              <div className="flex space-x-3 justify-end">
                <Button variant="outline" onClick={() => setShowExitConfirmation(false)}>Cancel</Button>
                <Button onClick={handleExitConfirm}>Yes, Exit</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Helper Component for Options to reuse
function QuestionOptions({ question, userAnswers, onAnswer }: {
  question: Question,
  userAnswers: Record<string, string>,
  onAnswer: (id: string, val: string) => void
}) {
  if (question.type === "MULTIPLE_CHOICE") {
    return (
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = userAnswers[question.id] === option;
          return (
            <button
              key={index}
              onClick={() => onAnswer(question.id, option)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 group ${isSelected
                ? 'border-primary bg-primary/5 text-primary shadow-sm'
                : 'border-border hover:border-primary/50 hover:bg-muted/50 bg-card/50 text-foreground'
                }`}
            >
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/30 group-hover:border-primary/50'
                }`}>
                {isSelected ? <FaCheck size={12} /> : <span className="text-xs font-semibold">{String.fromCharCode(65 + index)}</span>}
              </div>
              <span className={`font-medium ${isSelected ? 'font-semibold' : ''}`}>{option}</span>
            </button>
          );
        })}
      </div>
    );
  }

  if (question.type === "TRUE_FALSE") {
    return (
      <div className="grid grid-cols-1 gap-3">
        {["True", "False"].map((option) => {
          const isSelected = userAnswers[question.id] === option;
          return (
            <button
              key={option}
              onClick={() => onAnswer(question.id, option)}
              className={`p-6 rounded-xl border-2 transition-all duration-200 text-center relative overflow-hidden group ${isSelected
                ? 'border-primary bg-primary/5 text-primary shadow-sm'
                : 'border-border hover:border-primary/50 hover:bg-muted/50 bg-card/50 text-foreground'
                }`}
            >
              <span className={`text-lg font-semibold relative z-10 ${isSelected ? 'font-bold' : ''}`}>{option}</span>
            </button>
          );
        })}
      </div>
    );
  }

  if (question.type === "TEXT") {
    return (
      <textarea
        value={userAnswers[question.id] || ""}
        onChange={(e) => onAnswer(question.id, e.target.value)}
        placeholder="Type your answer here..."
        className="w-full h-48 p-4 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring bg-background/50 resize-none"
      />
    );
  }

  return null;
}
