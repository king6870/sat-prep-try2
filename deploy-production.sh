#!/bin/bash

echo "🚀 SAT Prep Website - Production Deployment"
echo "==========================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if question bank exists
QUESTION_BANK_PATH="../sat-question-generator/sat-question-bank-5000.json"
if [ ! -f "$QUESTION_BANK_PATH" ]; then
    echo "⚠️  Warning: Question bank file not found at $QUESTION_BANK_PATH"
    echo "The app will deploy but questions won't be seeded automatically."
    echo "You can seed them later using the Vercel dashboard or API."
fi

echo "📦 Installing dependencies..."
npm install

echo "🔧 Generating Prisma client..."
npx prisma generate

echo "🏗️  Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

echo "🚀 Deploying to Vercel..."
npx vercel --prod

echo ""
echo "🎉 Deployment Complete!"
echo "======================"
echo ""
echo "📋 Post-Deployment Steps:"
echo "1. Visit your Vercel dashboard to check deployment status"
echo "2. Set up environment variables in Vercel if not already done:"
echo "   - DATABASE_URL (PostgreSQL connection string)"
echo "   - NEXTAUTH_URL (your production URL)"
echo "   - NEXTAUTH_SECRET (secure random string)"
echo "   - GOOGLE_CLIENT_ID"
echo "   - GOOGLE_CLIENT_SECRET"
echo ""
echo "3. Seed the database with questions:"
echo "   - Option A: Use Vercel Functions API to trigger seeding"
echo "   - Option B: Run seeding locally against production DB"
echo ""
echo "🔗 Your app should be live at: https://sat-prep-website.vercel.app"
echo ""
echo "🛠️  If you need to seed questions after deployment:"
echo "   curl -X POST https://your-app.vercel.app/api/seed"
echo ""
