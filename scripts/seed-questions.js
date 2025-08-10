const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Map categories to difficulty levels based on question complexity
const getDifficulty = (category, explanation) => {
  const explanationLength = explanation.length;
  const hasComplexMath = /quadratic|factors|polynomial|derivative|integral/i.test(explanation);
  const hasAdvancedReading = /context|inference|implication|nuance/i.test(explanation);
  
  // Math categories
  if (['Algebra', 'Functions', 'Statistics'].includes(category)) {
    if (hasComplexMath || explanationLength > 200) return 'hard';
    if (explanationLength > 100) return 'medium';
    return 'easy';
  }
  
  // Basic math categories
  if (['Arithmetic', 'Exponents', 'Geometry'].includes(category)) {
    if (explanationLength > 150) return 'medium';
    return 'easy';
  }
  
  // Reading categories
  if (category.startsWith('Reading')) {
    if (hasAdvancedReading || explanationLength > 250) return 'hard';
    if (explanationLength > 150) return 'medium';
    return 'easy';
  }
  
  return 'medium';
};

async function seedQuestions() {
  try {
    console.log('🌱 Starting to seed SAT questions...');
    
    // Read the question bank file
    const questionBankPath = path.join(__dirname, '../../sat-question-generator/sat-question-bank-5000.json');
    
    if (!fs.existsSync(questionBankPath)) {
      console.error('❌ Question bank file not found at:', questionBankPath);
      console.log('Please ensure the sat-question-bank-5000.json file exists in the sat-question-generator directory');
      return;
    }
    
    const rawData = fs.readFileSync(questionBankPath, 'utf8');
    const questions = JSON.parse(rawData);
    
    console.log(`📚 Found ${questions.length} questions to import`);
    
    // Clear existing questions (optional - remove if you want to keep existing data)
    console.log('🧹 Clearing existing questions...');
    await prisma.question.deleteMany({});
    
    // Process questions in batches to avoid memory issues
    const batchSize = 100;
    let imported = 0;
    
    for (let i = 0; i < questions.length; i += batchSize) {
      const batch = questions.slice(i, i + batchSize);
      
      const questionsToCreate = batch.map(q => ({
        question: q.question,
        choices: JSON.stringify(q.choices), // Store choices as JSON string
        answer: q.answer,
        explanation: q.explanation,
        pointAmount: q.point_amount || 1,
        category: q.category,
        difficulty: getDifficulty(q.category, q.explanation)
      }));
      
      await prisma.question.createMany({
        data: questionsToCreate,
        skipDuplicates: true
      });
      
      imported += questionsToCreate.length;
      console.log(`✅ Imported ${imported}/${questions.length} questions`);
    }
    
    // Display summary statistics
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
    
    console.log('\n📊 Import Summary:');
    console.log('==================');
    categoryStats.forEach(stat => {
      console.log(`${stat.category}: ${stat._count.id} questions`);
    });
    
    const difficultyStats = await prisma.question.groupBy({
      by: ['difficulty'],
      _count: {
        id: true
      }
    });
    
    console.log('\n🎯 Difficulty Distribution:');
    console.log('============================');
    difficultyStats.forEach(stat => {
      console.log(`${stat.difficulty}: ${stat._count.id} questions`);
    });
    
    console.log('\n🎉 Successfully imported all SAT questions!');
    
  } catch (error) {
    console.error('❌ Error seeding questions:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding function
if (require.main === module) {
  seedQuestions()
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { seedQuestions };
