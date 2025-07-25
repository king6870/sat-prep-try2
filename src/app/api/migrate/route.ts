import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('🗄️ Starting database migration...')
    
    // Test database connection first
    await prisma.$connect()
    console.log('✅ Database connection successful')
    
    // Create tables using raw SQL since Prisma schema sync might not work
    console.log('📋 Creating Account table...')
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Account" (
        "id" TEXT NOT NULL,
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
        CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
      );
    `
    
    console.log('👤 Creating User table...')
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL,
        "name" TEXT,
        "email" TEXT,
        "emailVerified" TIMESTAMP(3),
        "image" TEXT,
        "role" TEXT NOT NULL DEFAULT 'USER',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "User_pkey" PRIMARY KEY ("id")
      );
    `
    
    console.log('🔐 Creating Session table...')
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Session" (
        "id" TEXT NOT NULL,
        "sessionToken" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "expires" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
      );
    `
    
    console.log('🎫 Creating VerificationToken table...')
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "VerificationToken" (
        "identifier" TEXT NOT NULL,
        "token" TEXT NOT NULL,
        "expires" TIMESTAMP(3) NOT NULL
      );
    `
    
    // Create indexes
    console.log('📊 Creating indexes...')
    await prisma.$executeRaw`
      CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key" 
      ON "Account"("provider", "providerAccountId");
    `
    
    await prisma.$executeRaw`
      CREATE UNIQUE INDEX IF NOT EXISTS "Session_sessionToken_key" 
      ON "Session"("sessionToken");
    `
    
    await prisma.$executeRaw`
      CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" 
      ON "User"("email");
    `
    
    await prisma.$executeRaw`
      CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_token_key" 
      ON "VerificationToken"("token");
    `
    
    await prisma.$executeRaw`
      CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_identifier_token_key" 
      ON "VerificationToken"("identifier", "token");
    `
    
    // Add foreign key constraints
    console.log('🔗 Adding foreign key constraints...')
    await prisma.$executeRaw`
      ALTER TABLE "Account" 
      ADD CONSTRAINT IF NOT EXISTS "Account_userId_fkey" 
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `
    
    await prisma.$executeRaw`
      ALTER TABLE "Session" 
      ADD CONSTRAINT IF NOT EXISTS "Session_userId_fkey" 
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `
    
    // Verify tables exist by counting records
    const userCount = await prisma.user.count()
    const accountCount = await prisma.account.count()
    const sessionCount = await prisma.session.count()
    
    console.log('✅ Database migration completed successfully!')
    console.log(`📊 Tables created - Users: ${userCount}, Accounts: ${accountCount}, Sessions: ${sessionCount}`)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database migration completed successfully! All tables created.',
      timestamp: new Date().toISOString(),
      tables: {
        User: userCount,
        Account: accountCount,
        Session: sessionCount,
        VerificationToken: 'Created'
      },
      note: 'Google OAuth should now work properly'
    })
    
  } catch (error) {
    console.error('❌ Database migration failed:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      details: 'Check Vercel function logs for more details'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST() {
  return GET()
}
