import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import TestClient from "@/components/TestClient";

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
}

// Page is now a Server Component that receives params
export default async function TestPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  // Redirect if not logged in
  if (!session?.user) {
    redirect("/login");
  }
  
  // Server-side fetch of the test data
  // Using the actual schema structure from your Prisma model
  const test = await prisma.test.findUnique({
    where: { id: params.id },
    include: {
      questions: true
    }
  });
  
  if (!test) {
    // Test not found
    redirect("/dashboard");
  }
  
  // Map database data to the expected Test format for the client
  // Based on your actual Question model which already has options as string[]
  const formattedTest: Test = {
    id: test.id,
    title: test.title,
    description: test.description,
    status: test.status,
    score: test.score,
    startedAt: test.startedAt?.toISOString() || null,
    completedAt: test.completedAt?.toISOString() || null,
    questions: test.questions.map(q => ({
      id: q.id,
      text: q.text,
      type: q.type,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      userAnswer: q.userAnswer || undefined,
      isCorrect: q.isCorrect || undefined
    }))
  };
  
  // Pass the data to a client component for interactivity
  return <TestClient test={formattedTest} />;
} 