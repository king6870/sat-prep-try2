# 🎯 SAT Prep Website

A comprehensive SAT preparation platform built with Next.js, featuring Google OAuth authentication, user management, and a foundation ready for SAT-specific features.

## ✨ Features

### 🔐 **Authentication & User Management**
- Google OAuth integration with NextAuth.js
- Secure session management with database persistence
- Role-based access control (USER/ADMIN)
- Custom sign-in and error pages

### 🎨 **Modern UI/UX**
- Responsive design with Tailwind CSS
- Mobile-friendly interface
- Professional landing page
- Loading states and error handling
- Dark/light theme ready

### 🗄️ **Database & Backend**
- Prisma ORM with SQLite (development) / PostgreSQL (production)
- Type-safe database operations
- User profiles and session management
- Ready for SAT-specific data models

### 🏗️ **Technical Architecture**
- Next.js 15 with App Router
- TypeScript for type safety
- Component-based architecture
- API routes ready for expansion
- Production-ready build system

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Google Cloud Console account for OAuth

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/sat-prep-website.git
cd sat-prep-website
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

### 4. Configure environment variables
Create `.env.local` file:
```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 5. Set up database
```bash
npx prisma generate
npx prisma db push
```

### 6. Run development server
```bash
npm run dev
```

Visit `http://localhost:3000` to see your app!

## 📁 Project Structure

```
src/
├── app/
│   ├── api/auth/[...nextauth]/     # NextAuth API routes
│   ├── auth/                       # Authentication pages
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Homepage
├── components/
│   ├── auth/                       # Authentication components
│   └── providers/                  # Context providers
├── lib/
│   ├── auth.ts                     # NextAuth configuration
│   └── prisma.ts                   # Database client
└── types/
    └── next-auth.d.ts              # Type definitions
```

## 🎯 Roadmap - SAT Features to Implement

### Phase 1: Question Bank
- [ ] Question model with multiple choice, grid-in, reading passages
- [ ] Question categorization (Math, Reading, Writing)
- [ ] Difficulty levels and tagging system
- [ ] Question search and filtering

### Phase 2: Practice System
- [ ] Timed and untimed practice modes
- [ ] Custom test builder
- [ ] Progress tracking
- [ ] Performance analytics

### Phase 3: Full Tests
- [ ] Complete SAT practice tests
- [ ] Auto-grading system
- [ ] Detailed score reports
- [ ] Time analysis per question

### Phase 4: Analytics & Admin
- [ ] User progress dashboard
- [ ] Performance graphs and insights
- [ ] Admin panel for content management
- [ ] Bulk question upload

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npx prisma studio    # Open database GUI
```

### Database Management
```bash
npx prisma generate  # Regenerate Prisma client
npx prisma db push   # Push schema changes
npx prisma migrate   # Create migrations
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub** (already done!)

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables

3. **Environment Variables for Production:**
   ```env
   DATABASE_URL="your-production-database-url"
   NEXTAUTH_URL="https://your-domain.vercel.app"
   NEXTAUTH_SECRET="your-production-secret"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. **Update Google OAuth:**
   - Add production redirect URI: `https://your-domain.vercel.app/api/auth/callback/google`

### Other Deployment Options
- Netlify
- AWS Amplify
- Railway
- Render

## 🔧 Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** NextAuth.js
- **Database:** Prisma ORM (SQLite/PostgreSQL)
- **Deployment:** Vercel

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

- Create an issue for bugs or feature requests
- Check existing issues before creating new ones
- Provide detailed information for faster resolution

---

**Built with ❤️ for SAT preparation success!**
