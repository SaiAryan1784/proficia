import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { generateTestWithGroq } from "@/lib/groqApi";

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify the user exists in the database
    const user = await prisma.users.findUnique({
      where: { id: session.user.id }
    });

    if (!user) {
      console.error(`User with ID ${session.user.id} not found in database`);
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    // Parse request body
    const { topicId, difficulty = "medium", questionCount = 10 } = await request.json();

    if (!topicId) {
      return NextResponse.json(
        { error: "Topic ID is required" },
        { status: 400 }
      );
    }

    // Fetch the topic
    const topic = await prisma.topic.findUnique({
      where: { id: topicId }
    });

    if (!topic) {
      return NextResponse.json(
        { error: "Topic not found" },
        { status: 404 }
      );
    }

    console.log(`Generating test for topic: ${topic.name}, difficulty: ${difficulty}, questions: ${questionCount}`);

    // Generate test content using Groq API
    const testContent = await generateTestWithGroq({
      topic: topic.name,
      description: topic.description,
      difficulty,
      questionCount: Number(questionCount)
    });

    console.log(`Test content generated with ${testContent.questions.length} questions`);
    console.log(`Creating test for user: ${user.id} (${user.email})`);

    // Create a new test in the database
    const test = await prisma.test.create({
      data: {
        title: `${topic.name} Test`,
        description: `A ${difficulty} difficulty test on ${topic.name}`,
        userId: user.id,
        topicId: topic.id,
        status: "DRAFT",
        questions: {
          create: testContent.questions.map(q => ({
            text: q.text,
            type: q.type,
            options: q.options || [],
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || null
          }))
        }
      },
      include: {
        questions: true
      }
    });

    console.log(`Test created with ID: ${test.id}`);

    return NextResponse.json({
      success: true,
      test
    });
  } catch (error) {
    console.error('Error generating test:', error);
    return NextResponse.json(
      { error: "Failed to generate test", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 