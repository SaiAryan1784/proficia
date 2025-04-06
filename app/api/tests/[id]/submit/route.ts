import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Parse request body to get user's answers
    const { answers } = await request.json();

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
    const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    // Update the test as completed with the score
    const updatedTest = await prisma.test.update({
      where: { id: testId },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
        score
      },
      include: {
        questions: true
      }
    });

    // Return the updated test with corrected answers and score
    return NextResponse.json({
      success: true,
      test: {
        ...updatedTest,
        questions: updatedQuestions
      },
      score
    });
  } catch (error) {
    console.error('Error submitting test:', error);
    return NextResponse.json(
      { error: "Failed to submit test" },
      { status: 500 }
    );
  }
} 