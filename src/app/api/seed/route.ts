import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Sample questions for production seeding (subset of your full question bank)
const sampleQuestions = [
  {
    question: "If 15% of x is 94, what is the value of x?",
    choices: ["626.67", "14.1", "109", "564"],
    answer: "626.67",
    explanation: "15% of x = 94, so 0.15x = 94, therefore x = 94/0.15 = 626.67",
    pointAmount: 1,
    category: "Arithmetic",
    difficulty: "medium"
  },
  {
    question: "What is 3^5?",
    choices: ["15", "125", "243", "625"],
    answer: "243",
    explanation: "3^5 = 3×3×3×3×3 = 243",
    pointAmount: 1,
    category: "Exponents",
    difficulty: "easy"
  },
  {
    question: "In the context of the passage, 'clarity' most nearly means:",
    choices: ["brightness", "transparency", "simplicity", "purity"],
    answer: "simplicity",
    explanation: "Simple language that all ages can understand indicates clear, straightforward writing, so 'simplicity' is correct.",
    pointAmount: 1,
    category: "Reading - Vocabulary",
    difficulty: "medium"
  },
  {
    question: "If f(x) = 2x² + 3x, what is f(4)?",
    choices: ["32", "44", "50", "56"],
    answer: "44",
    explanation: "f(4) = 2(4)² + 3(4) = 2(16) + 12 = 32 + 12 = 44",
    pointAmount: 1,
    category: "Functions",
    difficulty: "medium"
  },
  {
    question: "What is the area of a rectangle with length 12 and width 8?",
    choices: ["20", "40", "96", "192"],
    answer: "96",
    explanation: "Area = length × width = 12 × 8 = 96",
    pointAmount: 1,
    category: "Geometry",
    difficulty: "easy"
  }
];

export async function POST(request: NextRequest) {
  try {
    // Check if questions already exist
    const existingQuestions = await prisma.question.count();
    
    if (existingQuestions > 0) {
      return NextResponse.json({
        success: true,
        message: `Database already contains ${existingQuestions} questions. Seeding skipped.`,
        questionsCount: existingQuestions
      });
    }

    console.log('🌱 Starting database seeding...');
    
    // Create sample questions
    const createdQuestions = await prisma.question.createMany({
      data: sampleQuestions.map(q => ({
        question: q.question,
        choices: JSON.stringify(q.choices),
        answer: q.answer,
        explanation: q.explanation,
        pointAmount: q.pointAmount,
        category: q.category,
        difficulty: q.difficulty
      }))
    });

    // Get category statistics
    const categoryStats = await prisma.question.groupBy({
      by: ['category'],
      _count: {
        id: true
      }
    });

    console.log('✅ Database seeding completed');

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully with sample questions',
      questionsCreated: createdQuestions.count,
      categoryBreakdown: categoryStats.map(stat => ({
        category: stat.category,
        count: stat._count.id
      })),
      note: 'This is a sample set. For the full 5000 questions, please run the local seeding script or contact support.'
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to seed database',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  try {
    const questionCount = await prisma.question.count();
    
    const categoryStats = await prisma.question.groupBy({
      by: ['category'],
      _count: {
        id: true
      }
    });

    return NextResponse.json({
      success: true,
      currentQuestions: questionCount,
      categoryBreakdown: categoryStats.map(stat => ({
        category: stat.category,
        count: stat._count.id
      })),
      seedingAvailable: questionCount === 0
    });

  } catch (error) {
    console.error('Error checking seed status:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to check seed status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
