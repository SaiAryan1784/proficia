// src/app/dashboard/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

interface Topic {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  category: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState("medium");
  const [questionCount, setQuestionCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchTopics() {
      try {
        const response = await fetch("/api/topics");
        if (!response.ok) {
          throw new Error("Failed to fetch topics");
        }
        const data = await response.json();
        setTopics(data);
      } catch {
        setError("Error loading topics. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    if (status === "authenticated") {
      fetchTopics();
    }
  }, [status]);

  const handleImageError = (topicId: string) => {
    setImageErrors(prev => ({
      ...prev,
      [topicId]: true
    }));
  };

  const handleGenerateTest = async () => {
    if (!selectedTopic) return;
    
    setIsGenerating(true);
    
    try {
      const response = await fetch("/api/tests/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topicId: selectedTopic,
          difficulty,
          questionCount: parseInt(questionCount.toString()),
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate test");
      }
      
      // Redirect to the test page
      window.location.href = `/tests/${data.test.id}`;
    } catch {
      setError("Error generating test. Please try again later.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (status === "loading" || loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (status === "unauthenticated") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome, {session?.user?.name || session?.user?.email}</h1>
        <p className="text-gray-600 mt-2">Select a topic to generate a test and practice your skills.</p>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Generate a New Test</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Select a Topic</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topics.map((topic) => (
              <div 
                key={topic.id}
                className={`
                  border rounded-lg p-4 cursor-pointer transition-all
                  ${selectedTopic === topic.id ? 
                    'border-blue-500 bg-blue-50' : 
                    'border-gray-200 hover:border-blue-300'
                  }
                `}
                onClick={() => setSelectedTopic(topic.id)}
              >
                <div className="flex items-center gap-3">
                  {topic.imageUrl && !imageErrors[topic.id] ? (
                    <div className="relative w-10 h-10 rounded overflow-hidden bg-gray-100">
                      <Image
                        src={topic.imageUrl}
                        alt={topic.name}
                        width={40}
                        height={40}
                        className="object-cover"
                        onError={() => handleImageError(topic.id)}
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center text-blue-500 font-semibold">
                      {topic.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium">{topic.name}</h3>
                    <p className="text-xs text-gray-500">{topic.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Difficulty Level</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Number of Questions</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value))}
            >
              <option value="5">5 Questions</option>
              <option value="10">10 Questions</option>
              <option value="15">15 Questions</option>
              <option value="20">20 Questions</option>
            </select>
          </div>
        </div>
        
        <button
          className={`
            w-full py-3 rounded-md font-medium transition-colors
            ${selectedTopic 
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
            ${isGenerating ? 'opacity-70 cursor-wait' : ''}
          `}
          onClick={handleGenerateTest}
          disabled={!selectedTopic || isGenerating}
        >
          {isGenerating ? 'Generating Test...' : 'Generate Test'}
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Tests</h2>
        
        <div className="text-center py-8 text-gray-500">
          <p>You haven&apos;t taken any tests yet.</p>
          <p className="mt-2">Select a topic above to get started!</p>
        </div>
      </div>
    </div>
  );
}