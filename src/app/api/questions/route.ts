import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const limit = parseInt(searchParams.get('limit') || '10');
    const random = searchParams.get('random') === 'true';
    
    // Build where clause
    const where: any = {};
    if (category && category !== 'all') {
      where.category = category;
    }
    if (difficulty && difficulty !== 'all') {
      where.difficulty = difficulty;
    }
    
    let questions;
    
    if (random) {
      // For random questions, we'll use a more complex approach
      // First get the total count, then use skip with random offset
      const totalCount = await prisma.question.count({ where });
      const skip = Math.floor(Math.random() * Math.max(0, totalCount - limit));
      
      questions = await prisma.question.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          question: true,
          choices: true,
          answer: true,
          explanation: true,
          pointAmount: true,
          category: true,
          difficulty: true
        }
      });
    } else {
      questions = await prisma.question.findMany({
        where,
        take: limit,
        orderBy: {
          createdAt: 'asc'
        },
        select: {
          id: true,
          question: true,
          choices: true,
          answer: true,
          explanation: true,
          pointAmount: true,
          category: true,
          difficulty: true
        }
      });
    }
    
    // Parse choices JSON for each question
    const questionsWithParsedChoices = questions.map(q => ({
      ...q,
      choices: JSON.parse(q.choices)
    }));
    
    return NextResponse.json({
      success: true,
      questions: questionsWithParsedChoices,
      total: questionsWithParsedChoices.length
    });
    
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch questions',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, choices, answer, explanation, pointAmount, category, difficulty } = body;
    
    // Validate required fields
    if (!question || !choices || !answer || !explanation || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const newQuestion = await prisma.question.create({
      data: {
        question,
        choices: JSON.stringify(choices),
        answer,
        explanation,
        pointAmount: pointAmount || 1,
        category,
        difficulty: difficulty || 'medium'
      }
    });
    
    return NextResponse.json({
      success: true,
      question: {
        ...newQuestion,
        choices: JSON.parse(newQuestion.choices)
      }
    });
    
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create question',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
