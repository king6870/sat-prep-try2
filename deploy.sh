#!/bin/bash

echo "🚀 Deploying SAT Prep Test-Taking Module..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the project directory."
    exit 1
fi

# Install Vercel CLI if not installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Build the project
echo "🏗️ Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

echo "✅ Build successful!"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Set up environment variables in Vercel dashboard:"
echo "   - NEXTAUTH_URL (your Vercel domain)"
echo "   - NEXTAUTH_SECRET (random secret string)"
echo "   - GOOGLE_CLIENT_ID (Google OAuth)"
echo "   - GOOGLE_CLIENT_SECRET (Google OAuth)"
echo ""
echo "2. Configure Google OAuth redirect URLs:"
echo "   - Add your Vercel domain to Google Console"
echo ""
echo "3. Test your deployed application!"
echo ""
echo "🎯 Your SAT prep test-taking module is now live!"
