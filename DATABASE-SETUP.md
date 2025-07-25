# 🗄️ Database Setup for Production

## The Problem
SQLite doesn't work on Vercel's serverless environment. You're getting:
```
Error code 14: Unable to open the database file
```

## ✅ Solution: Vercel Postgres

### Step 1: Create Vercel Postgres Database

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click on your `sat-prep-website` project**
3. **Go to "Storage" tab**
4. **Click "Create Database"**
5. **Select "Postgres"**
6. **Click "Continue"**

### Step 2: Vercel Will Automatically:
- ✅ Create PostgreSQL database
- ✅ Add `DATABASE_URL` environment variable
- ✅ Add `POSTGRES_*` environment variables
- ✅ Connect database to your project

### Step 3: Run Database Migration

After Vercel creates the database, you need to create the tables:

**Option A: Use Vercel CLI**
```bash
# Install Vercel CLI if you don't have it
npm i -g vercel

# Link to your project
vercel link

# Run migration
vercel env pull .env.local
npm run db:push
```

**Option B: Manual Migration**
1. Go to your Vercel project dashboard
2. Go to "Functions" tab
3. Create a new function that runs: `npx prisma db push`

### Step 4: Verify Setup

After migration, your database will have these tables:
- `User` - User accounts
- `Account` - OAuth account linking  
- `Session` - User sessions
- `VerificationToken` - Email verification

### Step 5: Test Authentication

1. **Visit your deployed app**
2. **Click "Sign in with Google"**
3. **Should work without database errors**

## 🔧 Alternative: Other Database Providers

If you prefer not to use Vercel Postgres:

### Supabase (Free)
1. Go to [supabase.com](https://supabase.com)
2. Create project
3. Get connection string
4. Add to Vercel environment variables

### Railway (Simple)
1. Go to [railway.app](https://railway.app)
2. Add PostgreSQL service
3. Get connection string
4. Add to Vercel environment variables

### PlanetScale (MySQL)
1. Go to [planetscale.com](https://planetscale.com)
2. Create database
3. Get connection string
4. Update schema.prisma to use MySQL

## 🎯 Quick Fix Summary

1. **Add Vercel Postgres** (5 minutes)
2. **Run database migration** 
3. **Test Google OAuth**
4. **Authentication should work!**

The SQLite → PostgreSQL switch will fix your authentication issues! 🚀
