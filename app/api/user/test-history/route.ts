import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '10');
    const offset = (page - 1) * limit;

    // Get test history with pagination
    const tests = await prisma.test.findMany({
      where: {
        userId: session.user.id,
        status: "COMPLETED"
      },
      include: {
        topic: {
          select: {
            name: true,
            category: true
          }
        },
        questions: {
          select: {
            id: true,
            text: true,
            type: true,
            options: true,
            correctAnswer: true,
            explanation: true,
            userAnswer: true,
            isCorrect: true
          }
        }
      },
      orderBy: {
        completedAt: 'desc'
      },
      skip: offset,
      take: limit
    });

    // Get total count for pagination
    const totalTests = await prisma.test.count({
      where: {
        userId: session.user.id,
        status: "COMPLETED"
      }
    });

    const testHistory = tests.map(test => ({
      id: test.id,
      title: test.title,
      description: test.description,
      topicName: test.topic.name,
      category: test.topic.category,
      score: test.score ?? 0,
      totalQuestions: test.questions.length,
      difficulty: "medium", // Default since not stored in schema
      timeSpent: test.timeSpent ?? 0,
      completedAt: test.completedAt,
      questions: test.questions.map(q => ({
        id: q.id,
        question: q.text, // Map 'text' to 'question' for component compatibility
        type: q.type,
        options: q.options,
        correctAnswer: q.correctAnswer, // Keep as string for now, component may need updating
        explanation: q.explanation,
        userAnswer: q.userAnswer, // Keep as string for now, component may need updating
        isCorrect: q.isCorrect
      }))
    }));

    return NextResponse.json({
      tests: testHistory,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalTests / limit),
        totalTests,
        hasMore: offset + tests.length < totalTests
      }
    });

  } catch (error) {
    console.error("Error fetching test history:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
