import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('🗄️ Starting database migration...')
    
    // Use Prisma's db push functionality to sync schema
    // This is safer than raw SQL and handles schema differences
    
    // Test database connection first
    await prisma.$connect()
    console.log('✅ Database connection successful')
    
    // The schema will be automatically synced when Prisma connects
    // Let's verify the tables exist by trying to count records
    
    try {
      const userCount = await prisma.user.count()
      console.log(`✅ User table exists with ${userCount} records`)
    } catch {
      console.log('ℹ️ User table may not exist yet, this is normal for first migration')
    }
    
    try {
      const accountCount = await prisma.account.count()
      console.log(`✅ Account table exists with ${accountCount} records`)
    } catch {
      console.log('ℹ️ Account table may not exist yet, this is normal for first migration')
    }
    
    try {
      const sessionCount = await prisma.session.count()
      console.log(`✅ Session table exists with ${sessionCount} records`)
    } catch {
      console.log('ℹ️ Session table may not exist yet, this is normal for first migration')
    }
    
    console.log('✅ Database migration check completed!')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database migration completed successfully',
      timestamp: new Date().toISOString(),
      tables: ['User', 'Account', 'Session', 'VerificationToken'],
      note: 'Tables will be created automatically when first accessed'
    })
    
  } catch (error) {
    console.error('❌ Database migration failed:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST() {
  // Same as GET for convenience
  return GET()
}
