# SAT Prep Website Setup

## 🚀 Quick Start

### 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://your-domain.com/api/auth/callback/google` (for production)

### 2. Environment Variables

Update `.env.local` with your Google OAuth credentials:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-here-change-this-to-something-random-and-secure"

# Google OAuth - Replace with your actual values
GOOGLE_CLIENT_ID="your-google-client-id-here"
GOOGLE_CLIENT_SECRET="your-google-client-secret-here"
```

### 3. Install Dependencies & Run

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to see your SAT prep website!

## 🔧 Current Features

### ✅ Implemented
- Google OAuth authentication
- User session management
- Role-based access (USER/ADMIN)
- Responsive design with Tailwind CSS
- Database setup with Prisma + SQLite
- Custom sign-in/error pages

### 🚧 Coming Soon (Ready for Implementation)
- Question bank management
- Practice test system
- Analytics dashboard
- Admin panel
- Progress tracking
- Test scoring system

## 📁 Project Structure

```
src/
├── app/
│   ├── api/auth/[...nextauth]/     # NextAuth API routes
│   ├── auth/                       # Authentication pages
│   ├── layout.tsx                  # Root layout with providers
│   └── page.tsx                    # Main homepage
├── components/
│   ├── auth/                       # Authentication components
│   └── providers/                  # Context providers
├── lib/
│   ├── auth.ts                     # NextAuth configuration
│   └── prisma.ts                   # Prisma client
└── types/
    └── next-auth.d.ts              # NextAuth type extensions
```

## 🗄️ Database Schema

Current schema includes NextAuth.js required tables:
- `User` - User profiles with role-based access
- `Account` - OAuth account linking
- `Session` - User sessions
- `VerificationToken` - Email verification

Ready for SAT-specific tables:
- `Question` - SAT questions with answers/explanations
- `PracticeSession` - User practice sessions
- `TestScore` - Test results and analytics
- `SavedQuestion` - User bookmarked questions

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production
```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-production-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## 🔐 Security Features

- Secure session management with NextAuth.js
- Role-based access control
- CSRF protection
- Secure cookie handling
- Input validation ready

## 📈 Next Steps

1. **Set up Google OAuth** (required for authentication)
2. **Test authentication flow**
3. **Add question bank models** to Prisma schema
4. **Implement practice test system**
5. **Build analytics dashboard**
6. **Add admin panel for content management**

## 🛠️ Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npx prisma studio    # Open database GUI
npx prisma generate  # Regenerate Prisma client
npx prisma db push   # Push schema changes to database
```

Your SAT prep website foundation is ready! 🎉
