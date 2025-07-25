import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "./prisma"

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
  callbacks: {
    async session({ session, user }: any) {
      if (session?.user && user) {
        session.user.id = user.id
        // Add role to session
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true }
        })
        session.user.role = dbUser?.role || 'USER'
      }
      return session
    },
    async signIn() {
      // You can add custom sign-in logic here
      return true
    },
  },
  events: {
    async signIn({ user }: any) {
      console.log(`User signed in: ${user.email}`)
    },
  },
}
