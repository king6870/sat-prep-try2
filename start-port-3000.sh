#!/bin/bash

echo "🚀 Starting SAT Prep Website on Port 3000..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Kill any existing processes on port 3000
echo "🛑 Stopping any existing processes on port 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Update environment variable for port 3000
export NEXTAUTH_URL="http://localhost:3000"

echo "🔧 Environment configured for port 3000"
echo "🌐 NEXTAUTH_URL: $NEXTAUTH_URL"
echo ""

# Start the development server on port 3000
echo "🚀 Starting Next.js on port 3000..."
npx next dev -p 3000
