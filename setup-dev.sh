#!/bin/bash

echo "🔧 Setting up SAT Prep Website for Local Development..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Kill any existing Next.js processes
echo "🛑 Stopping any existing Next.js processes..."
pkill -f "next dev" 2>/dev/null || true

# Clean up old database
echo "🗄️ Setting up fresh database..."
rm -f prisma/dev.db
rm -f prisma/dev.db-journal

# Generate Prisma client and create database
echo "📦 Generating Prisma client..."
npx prisma generate

echo "🏗️ Creating database tables..."
npx prisma db push

# Install dependencies if needed
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Starting development server..."
echo "   The app will be available at: http://localhost:3001"
echo ""
echo "⚠️  IMPORTANT: Update your Google OAuth settings:"
echo "   1. Go to Google Cloud Console"
echo "   2. Navigate to your OAuth 2.0 Client"
echo "   3. Add this redirect URI: http://localhost:3001/api/auth/callback/google"
echo ""

# Start the development server
npm run dev
