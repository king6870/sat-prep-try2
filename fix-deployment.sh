#!/bin/bash

echo "🔧 SAT Prep Website - Critical Error Fix Deployment"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Not in the correct directory. Please run from sat-prep-website root."
    exit 1
fi

print_info "Starting deployment fix process..."

# Step 1: Verify the fixes are in place
print_info "Step 1: Verifying fix files..."

if [ -f "src/app/api/test-sessions/route.ts" ]; then
    print_status "API route /api/test-sessions exists"
else
    print_error "Missing API route /api/test-sessions"
    exit 1
fi

if [ -f "src/app/api/test-sessions/recent/route.ts" ]; then
    print_status "API route /api/test-sessions/recent exists"
else
    print_error "Missing API route /api/test-sessions/recent"
    exit 1
fi

if [ -f "src/app/dashboard/page.tsx" ]; then
    print_status "Dashboard page exists"
else
    print_error "Missing dashboard page"
    exit 1
fi

# Step 2: Install dependencies and build
print_info "Step 2: Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    print_status "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Step 3: Generate Prisma client
print_info "Step 3: Generating Prisma client..."
npx prisma generate

if [ $? -eq 0 ]; then
    print_status "Prisma client generated successfully"
else
    print_warning "Prisma client generation had issues, but continuing..."
fi

# Step 4: Build the application
print_info "Step 4: Building application..."
npm run build

if [ $? -eq 0 ]; then
    print_status "Application built successfully"
else
    print_error "Build failed"
    exit 1
fi

# Step 5: Test the build locally (optional)
print_info "Step 5: Testing build locally..."
print_warning "You can test locally with: npm start"
print_warning "Visit: http://localhost:3000"

# Step 6: Git operations
print_info "Step 6: Preparing for deployment..."

# Check git status
git status

print_info "Adding new files to git..."
git add src/app/api/test-sessions/
git add src/app/dashboard/
git add fix-deployment.sh
git add sat-prep-website-fix-plan.md

print_info "Committing fixes..."
git commit -m "🔧 CRITICAL FIX: Add missing API routes and dashboard page

- Add /api/test-sessions route to prevent 500 errors
- Add /api/test-sessions/recent route to prevent 500 errors  
- Add /dashboard page to prevent 404 errors
- Implement proper error handling and fallbacks
- Maintain API compatibility for future enhancements

Fixes console errors:
- 404 Error: /dashboard route not found
- 500 Error: /api/test-sessions/recent internal server error
- 500 Error: /api/test-sessions internal server error
- Error starting test: Internal server error"

if [ $? -eq 0 ]; then
    print_status "Changes committed successfully"
else
    print_error "Failed to commit changes"
    exit 1
fi

# Step 7: Push to GitHub (which will trigger Vercel deployment)
print_info "Step 7: Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    print_status "Changes pushed to GitHub successfully"
    print_status "Vercel deployment should start automatically"
else
    print_error "Failed to push to GitHub"
    exit 1
fi

echo ""
echo "🎉 DEPLOYMENT FIX COMPLETE!"
echo "=========================="
echo ""
print_status "All fixes have been applied and deployed:"
print_status "✅ Missing API routes created"
print_status "✅ Dashboard page created"  
print_status "✅ Error handling implemented"
print_status "✅ Changes committed and pushed"
echo ""
print_info "Next steps:"
echo "1. Wait for Vercel deployment to complete (2-3 minutes)"
echo "2. Visit https://sat-prep-website.vercel.app/"
echo "3. Check browser console - should see no 404/500 errors"
echo "4. Test dashboard, practice test, and demo functionality"
echo ""
print_warning "Monitor the deployment at: https://vercel.com/dashboard"
echo ""
print_status "The website should now work without console errors! 🚀"
