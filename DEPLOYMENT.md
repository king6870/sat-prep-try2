# 🚀 Deployment Guide - Vercel

This guide will help you deploy your SAT Prep website to Vercel.

## 📋 Prerequisites

- [x] GitHub repository created
- [x] Google OAuth credentials configured
- [ ] Vercel account (free)
- [ ] Production database (optional - can use SQLite initially)

## 🔧 Step 1: Prepare for Production

### Update Google OAuth Settings
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to your OAuth 2.0 credentials
3. Add production redirect URI: `https://your-app-name.vercel.app/api/auth/callback/google`

### Environment Variables Needed
```env
DATABASE_URL="file:./dev.db"  # or your production database URL
NEXTAUTH_URL="https://your-app-name.vercel.app"
NEXTAUTH_SECRET="your-super-secure-production-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## 🚀 Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Configure project settings:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)

### Option B: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from your project directory
cd sat-prep-website
vercel

# Follow the prompts
```

## ⚙️ Step 3: Configure Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add each variable:

| Variable | Value | Environment |
|----------|-------|-------------|
| `DATABASE_URL` | `file:./dev.db` | Production |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Production |
| `NEXTAUTH_SECRET` | Your secure secret | Production |
| `GOOGLE_CLIENT_ID` | Your Google client ID | Production |
| `GOOGLE_CLIENT_SECRET` | Your Google client secret | Production |

## 🗄️ Step 4: Database Setup (Optional)

### Option A: Use SQLite (Simple)
- Keep `DATABASE_URL="file:./dev.db"`
- Works for small applications
- Data persists between deployments

### Option B: Use PostgreSQL (Recommended for production)
1. **Get a PostgreSQL database:**
   - [Vercel Postgres](https://vercel.com/storage/postgres) (recommended)
   - [Supabase](https://supabase.com) (free tier)
   - [Railway](https://railway.app)
   - [PlanetScale](https://planetscale.com)

2. **Update DATABASE_URL:**
   ```env
   DATABASE_URL="postgresql://username:password@host:port/database"
   ```

3. **Run migrations:**
   ```bash
   npx prisma db push
   ```

## ✅ Step 5: Verify Deployment

1. **Check build logs** in Vercel dashboard
2. **Visit your deployed app**
3. **Test Google OAuth:**
   - Click "Sign in with Google"
   - Complete authentication flow
   - Verify user session works

## 🔧 Troubleshooting

### Common Issues

**Build Fails:**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript types are correct

**OAuth Redirect Error:**
- Verify redirect URI in Google Cloud Console
- Check `NEXTAUTH_URL` matches your domain exactly
- Ensure `NEXTAUTH_SECRET` is set

**Database Connection Issues:**
- Verify `DATABASE_URL` format
- Check database provider is accessible
- Run `npx prisma db push` if using PostgreSQL

**Environment Variables Not Working:**
- Redeploy after adding environment variables
- Check variable names match exactly
- Ensure no trailing spaces in values

## 🔄 Continuous Deployment

Once connected to GitHub:
- **Automatic deployments** on every push to main branch
- **Preview deployments** for pull requests
- **Rollback capability** to previous deployments

## 📊 Monitoring

Vercel provides:
- **Analytics** - Page views and performance
- **Functions** - API route monitoring  
- **Speed Insights** - Core Web Vitals
- **Error tracking** - Runtime errors

## 🎯 Next Steps After Deployment

1. **Test all functionality** thoroughly
2. **Set up custom domain** (optional)
3. **Configure analytics** (Google Analytics, etc.)
4. **Add monitoring** (Sentry for error tracking)
5. **Start building SAT features!**

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [NextAuth.js Deployment](https://next-auth.js.org/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)

---

**Your SAT Prep website is now live! 🎉**
