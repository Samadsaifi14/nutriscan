import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        if (!user.email) return false
        const { error } = await supabaseAdmin
          .from("user_profiles")
          .upsert({
            user_id: user.id,
            email: user.email,
            name: user.name,
            avatar_url: user.image,
            updated_at: new Date().toISOString(),
          }, { onConflict: "user_id" })
        if (error) {
          console.error("Supabase insert error:", error.message)
          return false
        }
        return true
      } catch (err) {
        console.error("SignIn error:", err)
        return false
      }
    },
    async jwt({ token, account }) {
      if (account) {
        token.provider = account.provider
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.userId = token.sub ?? ""
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }