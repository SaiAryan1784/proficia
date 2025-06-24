import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  // Await the params to get the id
  const { id } = await params;
  
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
    const testId = id;
    
    // Fetch the test with questions
    const test = await prisma.test.findUnique({
      where: { id: testId },
      include: {
        questions: true,
        topic: {
          select: {
            name: true,
            category: true
          }
        }
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
    
    // If the test status is DRAFT and it hasn't been started yet,
    // update it to IN_PROGRESS
    if (test.status === "DRAFT" && !test.startedAt) {
      await prisma.test.update({
        where: { id: testId },
        data: {
          status: "IN_PROGRESS",
          startedAt: new Date()
        }
      });
      
      // Update the local test object too
      test.status = "IN_PROGRESS";
      test.startedAt = new Date(); // Use Date object, not string
    }
    
    return NextResponse.json(test);
  } catch (error) {
    console.error('Error fetching test:', error);
    return NextResponse.json(
      { error: "Failed to fetch test" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  // Await the params to get the id
  const { id } = await params;
  
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { status, startedAt } = await request.json();
    
    // Get test ID from params
    const testId = id;
    
    // Fetch the test to verify ownership
    const test = await prisma.test.findUnique({
      where: { id: testId },
      select: { userId: true, status: true }
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
    
    // Update the test status
    const updatedTest = await prisma.test.update({
      where: { id: testId },
      data: {
        ...(status && { status }),
        ...(startedAt && { startedAt: new Date(startedAt) }),
      }
    });
    
    return NextResponse.json({ success: true, test: updatedTest });
  } catch (error) {
    console.error('Error updating test:', error);
    return NextResponse.json(
      { error: "Failed to update test" },
      { status: 500 }
    );
  }
}