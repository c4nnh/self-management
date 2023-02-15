import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { GetServerSidePropsContext } from 'next'
import { getServerSession, NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import DiscordProvider from 'next-auth/providers/discord'
import { prisma } from './db'

export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, token }) {
      if (token.user) {
        session.user = token.user
      }
      return session
    },
    jwt({ token, user }) {
      if (user) {
        token.user = user
      }
      return token
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.JWT_SECRET_KEY,
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'someone@gmail.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null
        const { email, password } = credentials

        const data = await prisma.user.findFirst({
          where: {
            email,
            password,
          },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            image: true,
          },
        })

        return data
      },
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
}

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext['req']
  res: GetServerSidePropsContext['res']
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions)
}
