import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get category statistics
    const categoryStats = await prisma.question.groupBy({
      by: ['category'],
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      }
    });
    
    // Get difficulty statistics
    const difficultyStats = await prisma.question.groupBy({
      by: ['difficulty'],
      _count: {
        id: true
      }
    });
    
    // Get total count
    const totalQuestions = await prisma.question.count();
    
    // Organize categories by subject
    const mathCategories = categoryStats.filter(stat => 
      ['Algebra', 'Arithmetic', 'Exponents', 'Functions', 'Geometry', 'Statistics'].includes(stat.category)
    );
    
    const readingCategories = categoryStats.filter(stat => 
      stat.category.startsWith('Reading')
    );
    
    const response = {
      success: true,
      stats: {
        total: totalQuestions,
        byCategory: categoryStats.map(stat => ({
          category: stat.category,
          count: stat._count.id
        })),
        byDifficulty: difficultyStats.map(stat => ({
          difficulty: stat.difficulty,
          count: stat._count.id
        })),
        bySubject: {
          math: {
            total: mathCategories.reduce((sum, cat) => sum + cat._count.id, 0),
            categories: mathCategories.map(stat => ({
              category: stat.category,
              count: stat._count.id
            }))
          },
          reading: {
            total: readingCategories.reduce((sum, cat) => sum + cat._count.id, 0),
            categories: readingCategories.map(stat => ({
              category: stat.category,
              count: stat._count.id
            }))
          }
        }
      }
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Error fetching question stats:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch question statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
