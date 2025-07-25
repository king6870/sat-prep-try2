# 📚 GitHub Repository Setup Instructions

## 🚀 Create GitHub Repository

### Step 1: Create Repository on GitHub
1. Go to [github.com](https://github.com) and sign in
2. Click the **"+"** button → **"New repository"**
3. Fill in repository details:
   - **Repository name:** `sat-prep-website`
   - **Description:** `SAT preparation platform with Google OAuth, built with Next.js and Prisma`
   - **Visibility:** Public (recommended) or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)

4. Click **"Create repository"**

### Step 2: Connect Local Repository to GitHub
Copy and run these commands in your terminal:

```bash
cd /mnt/c/Users/lionv/sat-prep-website

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/sat-prep-website.git

# Push to GitHub
git push -u origin main
```

### Step 3: Verify Upload
1. Refresh your GitHub repository page
2. You should see all your files uploaded
3. Check that `.env.local` is NOT visible (it should be excluded by .gitignore)

## 🚀 Deploy to Vercel

### Option A: Quick Deploy Button
Once your repository is on GitHub, you can use this deploy button:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/sat-prep-website)

### Option B: Manual Deployment
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login (can use GitHub account)
3. Click **"New Project"**
4. Import your `sat-prep-website` repository
5. Configure environment variables (see DEPLOYMENT.md)
6. Deploy!

## ⚙️ Required Environment Variables for Vercel

Add these in Vercel dashboard → Settings → Environment Variables:

```env
DATABASE_URL=file:./dev.db
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-super-secure-secret-here
GOOGLE_CLIENT_ID=50307876793-tpmb4m8iopq9gu8clgfa9n4egnmgtibj.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
```

## 🔧 Update Google OAuth for Production

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to your OAuth 2.0 credentials
3. Add authorized redirect URI: `https://your-app-name.vercel.app/api/auth/callback/google`

## ✅ Success Checklist

- [ ] GitHub repository created
- [ ] Local code pushed to GitHub
- [ ] Vercel project created and connected
- [ ] Environment variables configured
- [ ] Google OAuth updated for production
- [ ] Deployment successful
- [ ] Google sign-in working on live site

## 🎉 You're Done!

Your SAT prep website is now:
- ✅ Version controlled on GitHub
- ✅ Deployed on Vercel
- ✅ Ready for continuous deployment
- ✅ Ready to add SAT features

**Next steps:** Start building your question bank and practice test features!
