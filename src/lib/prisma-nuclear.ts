import { PrismaClient } from '@prisma/client'

// NUCLEAR + IN-MEMORY: SQLite that works in Vercel serverless environment
console.log('🔧 Initializing Prisma with IN-MEMORY SQLite for Vercel...')

// Use in-memory SQLite that works in Vercel serverless (read-only file system)
const forcedDatabaseUrl = 'file::memory:?cache=shared'

// Override any Accelerate environment variables
if (process.env.PRISMA_ACCELERATE_URL) {
  console.log('⚠️ Overriding PRISMA_ACCELERATE_URL')
  delete process.env.PRISMA_ACCELERATE_URL
}

if (process.env.DIRECT_DATABASE_URL) {
  console.log('⚠️ Overriding DIRECT_DATABASE_URL')
  delete process.env.DIRECT_DATABASE_URL
}

// Force DATABASE_URL to in-memory SQLite
process.env.DATABASE_URL = forcedDatabaseUrl

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create Prisma client with in-memory SQLite
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  // Force in-memory connection
  datasources: {
    db: {
      url: forcedDatabaseUrl
    }
  },
  // Minimal logging in production
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error']
})

// Ensure global instance in development
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Log successful initialization
console.log('✅ Prisma initialized with IN-MEMORY SQLite')
console.log('📊 Database URL:', forcedDatabaseUrl)
console.log('⚠️ Note: Sessions are temporary (lost on function restart)')

// Initialize database tables in memory
prisma.$connect()
  .then(async () => {
    console.log('✅ Prisma connected successfully to in-memory SQLite')
    
    // Create tables in memory on connection
    try {
      await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT,
        "email" TEXT,
        "emailVerified" DATETIME,
        "image" TEXT,
        "role" TEXT NOT NULL DEFAULT 'USER',
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`
      
      await prisma.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")`
      
      await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "Account" (
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
        CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      )`
      
      await prisma.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId")`
      
      await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "Session" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "sessionToken" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "expires" DATETIME NOT NULL,
        CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      )`
      
      await prisma.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "Session_sessionToken_key" ON "Session"("sessionToken")`
      
      await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "VerificationToken" (
        "identifier" TEXT NOT NULL,
        "token" TEXT NOT NULL,
        "expires" DATETIME NOT NULL
      )`
      
      await prisma.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_token_key" ON "VerificationToken"("token")`
      await prisma.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token")`
      
      console.log('✅ In-memory database tables created successfully')
    } catch (error) {
      console.error('❌ Error creating in-memory tables:', error)
    }
  })
  .catch((error) => {
    console.error('❌ Prisma connection failed:', error)
  })
