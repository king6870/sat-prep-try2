import { PrismaClient } from '@prisma/client'

// NUCLEAR OPTION: Completely disable Accelerate regardless of environment variables
console.log('🔧 Initializing Prisma with NUCLEAR Accelerate disable...')

// Force SQLite URL regardless of environment
const forcedDatabaseUrl = 'file:./dev.db'

// Override any Accelerate environment variables
if (process.env.PRISMA_ACCELERATE_URL) {
  console.log('⚠️ Overriding PRISMA_ACCELERATE_URL')
  delete process.env.PRISMA_ACCELERATE_URL
}

if (process.env.DIRECT_DATABASE_URL) {
  console.log('⚠️ Overriding DIRECT_DATABASE_URL')
  delete process.env.DIRECT_DATABASE_URL
}

// Force DATABASE_URL to SQLite
process.env.DATABASE_URL = forcedDatabaseUrl

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create Prisma client with nuclear Accelerate disable
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  // Force direct connection with explicit URL
  datasources: {
    db: {
      url: forcedDatabaseUrl
    }
  },
  // Disable logging in production to avoid noise
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error']
})

// Ensure global instance in development
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Log successful initialization
console.log('✅ Prisma initialized with NUCLEAR Accelerate disable')
console.log('📊 Database URL:', forcedDatabaseUrl)

// Test connection on initialization
prisma.$connect()
  .then(() => {
    console.log('✅ Prisma connected successfully to SQLite')
  })
  .catch((error) => {
    console.error('❌ Prisma connection failed:', error)
  })
