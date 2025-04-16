import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    // Optional authentication check
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch all topics and deduplicate by name
    const allTopics = await prisma.topic.findMany({
      orderBy: { name: 'asc' }
    });

    // Use a Map to keep only one entry per topic name (keeping the first occurrence)
    const uniqueTopicsMap = new Map();
    allTopics.forEach(topic => {
      if (!uniqueTopicsMap.has(topic.name)) {
        uniqueTopicsMap.set(topic.name, topic);
      }
    });

    // Convert back to array
    const uniqueTopics = Array.from(uniqueTopicsMap.values());
    return NextResponse.json(uniqueTopics);
    
  } catch (error) {
    console.error('Error fetching topics:', error);
    return NextResponse.json(
      { error: "Failed to fetch topics" },
      { status: 500 }
    );
  }
} 