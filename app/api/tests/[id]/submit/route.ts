import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { updateUserStats } from "@/lib/gamification";

export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get test ID from params
    const testId = params.id;

    // Parse request body to get user's answers and time data
    const { answers, timeSpent } = await request.json();

    // Fetch the test with questions
    const test = await prisma.test.findUnique({
      where: { id: testId },
      include: {
        questions: true
      }
    });

    if (!test) {
      return NextResponse.json(
        { error: "Test not found" },
        { status: 404 }
      );
    }

    // Check if the test belongs to the current user
    if (test.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized access to this test" },
        { status: 403 }
      );
    }

    // Calculate score and mark correct/incorrect answers
    let correctAnswers = 0;
    const updatedQuestions = [];

    for (const question of test.questions) {
      const userAnswer = answers[question.id] || "";
      const isCorrect = question.correctAnswer === userAnswer;
      
      if (isCorrect) {
        correctAnswers++;
      }
      
      // Update the question with user's answer and correctness
      await prisma.question.update({
        where: { id: question.id },
        data: {
          userAnswer,
          isCorrect
        }
      });
      
      // Add updated question to our result
      updatedQuestions.push({
        ...question,
        userAnswer,
        isCorrect
      });
    }

    // Calculate final score as percentage
    const totalQuestions = test.questions.length;
    const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;    // Update the test as completed with the score and time data
    const isTimedOut = test.timeLimit && timeSpent ? timeSpent >= (test.timeLimit * 60) : false;
    const updatedTest = await prisma.test.update({
      where: { id: testId },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
        score,
        timeSpent: timeSpent || 0,
        isTimedOut
      },
      include: {
        questions: true
      }
    });

    // Update user stats and gamification
    const gamificationResult = await updateUserStats(
      session.user.id, 
      score, 
      timeSpent,
      test.timeLimit ?? undefined,
      isTimedOut
    );

    // Sync user's totalTests count with actual completed tests
    const actualCompletedTests = await prisma.test.count({
      where: {
        userId: session.user.id,
        status: "COMPLETED"
      }
    });
    
    // Update user table with correct totalTests count if it's different
    await prisma.users.update({
      where: { id: session.user.id },
      data: {
        totalTests: actualCompletedTests
      }
    });

    // Return the updated test with corrected answers, score, and gamification data
    return NextResponse.json({
      success: true,
      test: {
        ...updatedTest,
        questions: updatedQuestions
      },
      score,
      gamification: gamificationResult
    });
  } catch (error) {
    console.error('Error submitting test:', error);
    return NextResponse.json(
      { error: "Failed to submit test" },
      { status: 500 }
    );
  }
} 