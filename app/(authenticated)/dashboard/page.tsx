"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { FaTrophy, FaFire, FaArrowRight } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Topic {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  category: string;
}

interface UserStats {
  totalTests: number;
  averageScore: number;
  streak: number;
  level: number;
  xp: number;
  history: { date: string; score: number }[];
  testsThisWeek: number;
}

interface RecentTest {
  id: string;
  title: string;
  score: number;
  completedAt: string;
  timeSpent: number;
  isTimedOut: boolean;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [recentTests, setRecentTests] = useState<RecentTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Test Generation State
  const [topicInput, setTopicInput] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [questionCount, setQuestionCount] = useState("10");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const topicsResponse = await fetch("/api/topics");
        if (topicsResponse.ok) setTopics(await topicsResponse.json());

        const statsResponse = await fetch("/api/user/stats");
        if (statsResponse.ok) setUserStats(await statsResponse.json());

        const recentTestsResponse = await fetch("/api/user/recent-tests");
        if (recentTestsResponse.ok) setRecentTests(await recentTestsResponse.json());
      } catch {
        setError("Error loading data.");
      } finally {
        setLoading(false);
      }
    }

    if (status === "authenticated") fetchData();
  }, [status]);

  const handleGenerateTest = async () => {
    if (!topicInput.trim()) {
      setError("Please select or enter a topic.");
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      // Determine if we are using an ID or a Name
      // Ideally if the input matches a topic exactly, we use that ID, else we send the Name
      const match = topics.find(t => t.name.toLowerCase() === topicInput.trim().toLowerCase());
      const payload = {
        difficulty,
        questionCount: parseInt(questionCount),
        ...(match ? { topicId: match.id } : { topicName: topicInput.trim() })
      };

      const response = await fetch("/api/tests/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to generate test");
      }
      window.location.href = `/tests/${data.test.id}`;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error creating test.";
      setError(errorMessage);
      setIsGenerating(false);
    }
  };

  const filteredTopics = topics.filter(t =>
    t.name.toLowerCase().includes(topicInput.toLowerCase())
  ).slice(0, 5);

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground text-sm font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") redirect("/login");

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500 pb-12">

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/40 pb-6">
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground uppercase tracking-widest font-medium">
            {currentDate}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-serif">
            Welcome back, {session?.user?.name?.split(' ')[0]}.
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {userStats && (
            <>
              <div className="flex items-center gap-2 px-4 py-2 bg-secondary/30 rounded-full border border-border/50">
                <FaFire className="text-orange-500" />
                <span className="font-semibold">{userStats.streak} Day Streak</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 text-primary">
                <FaTrophy />
                <span className="font-semibold">Level {userStats.level}</span>
              </div>
            </>
          )}
        </div>
      </header>

      <div className="grid lg:grid-cols-12 gap-8">

        {/* Main Action Column */}
        <div className="lg:col-span-8 space-y-8">

          {/* Create Test Card */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full block"></span>
              Start New Assessment
            </h2>

            <Card className="border-border shadow-lg bg-card/50 backdrop-blur-sm overflow-visible">
              <CardContent className="p-6 md:p-8 space-y-8">

                {/* Topic Input with Suggestions */}
                <div className="space-y-3 relative z-10">
                  <Label className="text-base font-medium">What do you want to master?</Label>
                  <div className="relative">
                    <input
                      type="text"
                      value={topicInput}
                      onChange={(e) => {
                        setTopicInput(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      placeholder="Search for a topic or type a new one..."
                      className="w-full h-14 pl-4 pr-12 rounded-xl border border-input bg-background/50 text-lg shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    />
                    {topicInput && (
                      <button
                        onClick={() => setTopicInput("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                      >
                        ✕
                      </button>
                    )}

                    {/* Suggestions Dropdown */}
                    {showSuggestions && topicInput && (
                      <div className="absolute w-full mt-2 bg-popover border border-border rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                        <div className="max-h-[200px] overflow-y-auto p-1">
                          {filteredTopics.map((topic) => (
                            <div
                              key={topic.id}
                              onClick={() => {
                                setTopicInput(topic.name);
//                                 setSelectedTopicId(topic.id);
                                setShowSuggestions(false);
                              }}
                              className="px-4 py-3 hover:bg-muted/50 rounded-lg cursor-pointer flex items-center justify-between group transition-colors"
                            >
                              <span className="font-medium">{topic.name}</span>
                              <span className="text-xs text-muted-foreground">{topic.category}</span>
                            </div>
                          ))}
                          {filteredTopics.length === 0 && (
                            <div className="px-4 py-3 text-sm text-muted-foreground">
                              Hit <span className="font-semibold text-foreground">Start Assessment</span> to create &ldquo;<span className="italic">{topicInput}</span>&rdquo;
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Quick Topics */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="text-xs text-muted-foreground mr-1 py-1">Popular:</span>
                    {topics.slice(0, 4).map(t => (
                      <Badge
                        key={t.id}
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors"
                        onClick={() => {
                          setTopicInput(t.name);
//                           setSelectedTopicId(t.id);
                        }}
                      >
                        {t.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Difficulty</Label>
                    <div className="flex p-1 bg-secondary/30 rounded-lg">
                      {['easy', 'medium', 'hard'].map((level) => (
                        <button
                          key={level}
                          onClick={() => setDifficulty(level)}
                          className={`flex-1 py-2 text-sm font-medium rounded-md capitalize transition-all ${difficulty === level
                            ? 'bg-background shadow-sm text-primary'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-medium">Duration</Label>
                    <Select value={questionCount} onValueChange={setQuestionCount}>
                      <SelectTrigger className="h-11 bg-background/50 border-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">Short (5 Questions)</SelectItem>
                        <SelectItem value="10">Standard (10 Questions)</SelectItem>
                        <SelectItem value="20">Deep Dive (20 Questions)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    disabled={!topicInput.trim() || isGenerating}
                    onClick={handleGenerateTest}
                    className="w-full h-14 text-lg font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all rounded-xl"
                    size="lg"
                  >
                    {isGenerating ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin rounded-full h-5 w-5 border-2 border-white/50 border-t-white" />
                        Designing Assessment...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Start Assessment <FaArrowRight />
                      </span>
                    )}
                  </Button>
                  {error && <p className="text-destructive font-medium text-center mt-3 animate-pulse">{error}</p>}
                </div>

              </CardContent>
            </Card>
          </section>

          {/* Tips or Featured (Placeholder for future) */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-500/10 hover:border-indigo-500/20 transition-colors">
              <h3 className="font-semibold mb-2">Did you know?</h3>
              <p className="text-sm text-muted-foreground">Taking short, frequent tests is 20% more effective for retention than long study sessions.</p>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border border-emerald-500/10 hover:border-emerald-500/20 transition-colors">
              <h3 className="font-semibold mb-2">Daily Goal</h3>
              <p className="text-sm text-muted-foreground">Complete 3 assessments today to maintain your 5-day streak multiplier!</p>
            </div>
          </div>

        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="sticky top-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-secondary rounded-full block"></span>
              Recent Activity
            </h2>
            <Card className="border-border shadow-sm">
              <CardContent className="p-0">
                {recentTests.length > 0 ? (
                  <div className="divide-y divide-border/50">
                    {recentTests.slice(0, 6).map((test) => (
                      <div key={test.id} className="p-4 hover:bg-muted/30 transition-colors flex flex-col gap-2 group">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                            {test.title}
                          </h4>
                          <Badge variant={test.score >= 80 ? 'default' : test.score >= 60 ? 'secondary' : 'outline'} className="ml-2 shrink-0">
                            {test.score}%
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{new Date(test.completedAt).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">View Results <FaArrowRight size={10} /></span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    No recent tests. Start your first one!
                  </div>
                )}
                {recentTests.length > 0 && (
                  <div className="p-3 border-t border-border/50">
                    <Button variant="ghost" className="w-full text-xs h-8" onClick={() => window.location.href = '/statistics'}>View All History</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </aside>

      </div>
    </div>
  );
}