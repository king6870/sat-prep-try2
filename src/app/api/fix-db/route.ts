import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('🔧 FIXING DATABASE - Creating all tables...')
    
    // Create User table first (no dependencies)
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT,
        "email" TEXT UNIQUE,
        "emailVerified" TIMESTAMP,
        "image" TEXT,
        "role" TEXT NOT NULL DEFAULT 'USER',
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `
    console.log('✅ User table created')
    
    // Create Account table (depends on User)
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Account" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "provider" TEXT NOT NULL,
        "providerAccountId" TEXT NOT NULL,
        "refresh_token" TEXT,
        "access_token" TEXT,
        "expires_at" INTEGER,
        "token_type" TEXT,
        "scope" TEXT,
        "id_token" TEXT,
        "session_state" TEXT,
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
      );
    `
    console.log('✅ Account table created')
    
    // Create Session table (depends on User)
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Session" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "sessionToken" TEXT NOT NULL UNIQUE,
        "userId" TEXT NOT NULL,
        "expires" TIMESTAMP NOT NULL,
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
      );
    `
    console.log('✅ Session table created')
    
    // Create VerificationToken table (no dependencies)
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "VerificationToken" (
        "identifier" TEXT NOT NULL,
        "token" TEXT NOT NULL UNIQUE,
        "expires" TIMESTAMP NOT NULL,
        PRIMARY KEY ("identifier", "token")
      );
    `
    console.log('✅ VerificationToken table created')
    
    // Create unique index for Account
    await prisma.$executeRaw`
      CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key" 
      ON "Account"("provider", "providerAccountId");
    `
    console.log('✅ Account index created')
    
    // Test that tables work
    const userCount = await prisma.user.count()
    const accountCount = await prisma.account.count()
    
    console.log('🎉 DATABASE FIXED! All tables created successfully!')
    
    return NextResponse.json({
      success: true,
      message: '🎉 DATABASE FIXED! All tables created successfully!',
      details: {
        userCount,
        accountCount,
        tablesCreated: ['User', 'Account', 'Session', 'VerificationToken'],
        timestamp: new Date().toISOString()
      },
      nextStep: 'Go back to homepage and try Google sign-in again!'
    })
    
  } catch (error) {
    console.error('❌ Database fix failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      suggestion: 'Check that your DATABASE_URL is correctly set in Vercel environment variables'
    }, { status: 500 })
  }
}

export async function POST() {
  return GET()
}
