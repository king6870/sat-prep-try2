const { PrismaClient } = require('@prisma/client');
const { seedQuestions } = require('./seed-questions');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🚀 Starting database seeding...');
    
    // First, seed the questions from your real SAT question bank
    await seedQuestions();
    
    // Create sample study plans for different goals
    console.log('📋 Creating sample study plans...');
    
    const sampleStudyPlans = [
      {
        name: "Math Mastery Plan",
        description: "Focus on strengthening math fundamentals and advanced concepts",
        targetScore: 750,
        categories: JSON.stringify([
          "Algebra", 
          "Geometry", 
          "Functions", 
          "Statistics", 
          "Arithmetic", 
          "Exponents"
        ]),
        schedule: JSON.stringify({
          sessionsPerWeek: 4,
          minutesPerSession: 45,
          focusAreas: {
            "Monday": ["Algebra", "Functions"],
            "Wednesday": ["Geometry", "Statistics"], 
            "Friday": ["Arithmetic", "Exponents"],
            "Sunday": ["Mixed Review"]
          }
        })
      },
      {
        name: "Reading Excellence Plan",
        description: "Improve reading comprehension and vocabulary skills",
        targetScore: 700,
        categories: JSON.stringify([
          "Reading - Comprehension",
          "Reading - Vocabulary"
        ]),
        schedule: JSON.stringify({
          sessionsPerWeek: 3,
          minutesPerSession: 60,
          focusAreas: {
            "Tuesday": ["Reading - Comprehension"],
            "Thursday": ["Reading - Vocabulary"],
            "Saturday": ["Mixed Reading Practice"]
          }
        })
      },
      {
        name: "Balanced SAT Prep",
        description: "Comprehensive preparation covering all SAT sections",
        targetScore: 1400,
        categories: JSON.stringify([
          "Algebra", "Geometry", "Functions", "Statistics", 
          "Reading - Comprehension", "Reading - Vocabulary"
        ]),
        schedule: JSON.stringify({
          sessionsPerWeek: 5,
          minutesPerSession: 50,
          focusAreas: {
            "Monday": ["Algebra", "Reading - Comprehension"],
            "Tuesday": ["Geometry", "Reading - Vocabulary"],
            "Wednesday": ["Functions", "Statistics"],
            "Thursday": ["Mixed Math Review"],
            "Friday": ["Full Practice Test"]
          }
        })
      }
    ];
    
    // Note: We're not creating these with a specific userId since we don't have users yet
    // They can be templates that users can copy when they sign up
    
    console.log('✅ Database seeding completed successfully!');
    console.log('\n🎯 Next Steps:');
    console.log('1. Run: npm run db:migrate to apply schema changes');
    console.log('2. Start your development server: npm run dev');
    console.log('3. Questions are ready to be used in your SAT prep app!');
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
