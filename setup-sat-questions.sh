#!/bin/bash

echo "🚀 SAT Question Bank Integration Setup"
echo "======================================"

# Check if question bank file exists
QUESTION_BANK_PATH="../sat-question-generator/sat-question-bank-5000.json"
if [ ! -f "$QUESTION_BANK_PATH" ]; then
    echo "❌ Error: Question bank file not found at $QUESTION_BANK_PATH"
    echo "Please ensure the sat-question-bank-5000.json file exists in the sat-question-generator directory"
    exit 1
fi

echo "✅ Found question bank file with $(jq length $QUESTION_BANK_PATH) questions"

# Install dependencies if needed
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Push database schema
echo "🗄️  Updating database schema..."
npx prisma db push

# Seed the database with questions
echo "🌱 Seeding database with SAT questions..."
npm run db:seed

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "Your SAT prep application now has:"
echo "• 5,000 real SAT questions integrated"
echo "• Math questions: Algebra, Geometry, Functions, Statistics, etc."
echo "• Reading questions: Comprehension and Vocabulary"
echo "• Difficulty levels: Easy, Medium, Hard"
echo "• Practice session component ready to use"
echo ""
echo "Next steps:"
echo "1. Start your development server: npm run dev"
echo "2. Visit http://localhost:3000/practice to try the new practice mode"
echo "3. Questions are randomly selected based on category and difficulty"
echo ""
echo "API Endpoints available:"
echo "• GET /api/questions - Fetch questions with filters"
echo "• GET /api/questions/stats - Get question bank statistics"
echo ""
echo "Database commands:"
echo "• npm run db:seed - Re-seed questions"
echo "• npm run db:reset - Reset and re-seed entire database"
echo ""
