import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        if (!user.email) return false

        const { data: existing } = await supabaseAdmin
          .from('user_profiles')
          .select('user_id, welcome_email_sent')
          .eq('user_id', user.id)
          .single()

        const isNewUser = !existing

        const { error } = await supabaseAdmin
          .from('user_profiles')
          .upsert(
            {
              user_id: user.id,
              email: user.email,
              name: user.name,
              avatar_url: user.image,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' }
          )

        if (error) {
          console.error('Supabase upsert error:', error.message)
          return false
        }

        if (isNewUser) {
          const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
          fetch(`${baseUrl}/api/welcome-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-internal-secret': process.env.NEXTAUTH_SECRET || '', // ✅ added
            },
            body: JSON.stringify({
              userId: user.id,
              email: user.email,
              name: user.name,
            }),
          }).catch((err) =>
            console.log('Welcome email trigger error:', err.message)
          )
        }

        return true
      } catch (err) {
        console.error('SignIn error:', err)
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
        session.userId = token.sub ?? ''
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
}