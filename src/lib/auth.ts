import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "./prisma-nuclear"
import { ensureDatabaseInitialized } from "./init-db"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "database" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  // CRITICAL: Fix cookie configuration for OAuth state cookie error
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    },
    pkceCodeVerifier: {
      name: `next-auth.pkce.code_verifier`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 15 // 15 minutes
      }
    },
    state: {
      name: `next-auth.state`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 15 // 15 minutes - CRITICAL for OAuth flow
      }
    },
    nonce: {
      name: `next-auth.nonce`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  useSecureCookies: process.env.NODE_ENV === 'production',
  callbacks: {
    async session({ session, user }: any) {
      // Ensure database is initialized before any session operations
      await ensureDatabaseInitialized()
      
      if (session?.user && user) {
        session.user.id = user.id
        // Add role to session with error handling
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { role: true }
          })
          session.user.role = dbUser?.role || 'USER'
        } catch (error) {
          console.error('Error fetching user role:', error)
          session.user.role = 'USER'
        }
      }
      return session
    },
    async signIn() {
      // Ensure database is initialized before sign-in
      await ensureDatabaseInitialized()
      return true
    },
    async redirect({ url, baseUrl }: any) {
      // Enhanced redirect handling for OAuth callback
      console.log('OAuth Redirect callback:', { url, baseUrl })
      
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  events: {
    async signIn({ user }: any) {
      console.log(`✅ User signed in successfully: ${user.email}`)
    },
    async signOut({ session }: any) {
      console.log(`👋 User signed out: ${session?.user?.email}`)
    },
  },
  debug: process.env.NODE_ENV === 'development',
}
