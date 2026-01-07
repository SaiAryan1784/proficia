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

    // Check daily test limit (3 tests per day)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // Start of tomorrow

    const testsToday = await prisma.test.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      }
    });

    const DAILY_TEST_LIMIT = 3;
    if (testsToday >= DAILY_TEST_LIMIT) {
      return NextResponse.json(
        {
          error: "Daily test limit reached",
          message: `You can only create ${DAILY_TEST_LIMIT} tests per day. You've created ${testsToday} tests today. Try again tomorrow.`,
          testsCreated: testsToday,
          limit: DAILY_TEST_LIMIT,
          nextResetTime: tomorrow.toISOString()
        },
        { status: 429 } // Too Many Requests
      );
    }

    // Parse request body
    const { topicId, topicName, difficulty = "medium", questionCount = 10 } = await request.json();

    if (!topicId && !topicName) {
      return NextResponse.json(
        { error: "Topic ID or Name is required" },
        { status: 400 }
      );
    }

    // Automatically set time limit: 1 minute per question
    const timeLimit = Number(questionCount);

    let topic;

    if (topicId) {
      // Fetch existing topic
      topic = await prisma.topic.findUnique({
        where: { id: topicId }
      });

      if (!topic) {
        return NextResponse.json({ error: "Topic not found" }, { status: 404 });
      }
    } else if (topicName) {
      // Find or create topic by name
      const sanitizedName = topicName.trim();

      // Try to find existing topic by name (case insensitive search not directly supported by prisma standard findFirst without raw, so we'll just check exact match or assume user selects from list for now, but for custom topic we create it)
      // Actually, for a robust "Any Topic", we should try to align with existing if possible or just create new.
      // Let's first try to find one with the exact name.
      topic = await prisma.topic.findUnique({
        where: { name: sanitizedName }
      });

      if (!topic) {
        // Create new Custom topic
        console.log(`Creating new custom topic: ${sanitizedName}`);
        topic = await prisma.topic.create({
          data: {
            name: sanitizedName,
            description: `Custom topic: ${sanitizedName}`,
            category: "Custom",
            imageUrl: null // No image for custom topics initially
          }
        });
      }
    }

    if (!topic) {
      return NextResponse.json(
        { error: "Failed to resolve topic" },
        { status: 500 }
      );
    }

    console.log(`Generating test for topic: ${topic.name}, difficulty: ${difficulty}, questions: ${questionCount}`);

    // Generate test content using Groq API
    const testContent = await generateTestWithGroq({
      topic: topic.name,
      description: topic.description || "",
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
        timeLimit: timeLimit ? Number(timeLimit) : Number(questionCount),
        questions: {
          create: testContent.questions.map(q => ({
            text: q.text,
            type: q.type,
            options: q.options || [],
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || null,
            reference: q.reference || null
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