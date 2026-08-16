import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { db } from '@/db/connect';
import { compareFunction } from '@/utils/hashFunction';

const hasGoogleConfig = !!
  process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET;
const hasGithubConfig = !!
  process.env.GITHUB_CLIENT_ID && !!process.env.GITHUB_CLIENT_SECRET;

const getNameParts = (fullName?: string | null) => {
  const safeName = fullName?.trim() || 'User';
  const parts = safeName.split(/\s+/);

  return {
    firstName: parts[0] || 'User',
    lastName: parts.slice(1).join(' ') || '',
  };
};

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    ...(hasGoogleConfig
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
              params: {
                scope:
                  'openid email profile https://www.googleapis.com/auth/calendar.readonly',
              },
            },
          }),
        ]
      : []),
    ...(hasGithubConfig
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
          }),
        ]
      : []),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'example@gmail.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) {
          return null;
        }

        const existingUserByEmail = await db.user.findUnique({
          where: { email },
        });

        if (!existingUserByEmail || !existingUserByEmail.password) {
          return null;
        }

        const passwordMatches = await compareFunction(
          password,
          existingUserByEmail.password
        );

        if (!passwordMatches) {
          return null;
        }

        return {
          id: `${existingUserByEmail.id}`,
          email: existingUserByEmail.email,
          firstName: existingUserByEmail.firstName,
          lastName: existingUserByEmail.lastName,
          userRole: existingUserByEmail.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user?.email) {
        return false;
      }

      if (account?.provider !== 'google' && account?.provider !== 'github') {
        return true;
      }

      const existingUserByEmail = await db.user.findUnique({
        where: { email: user.email },
      });

      if (existingUserByEmail) {
        const nameParts = getNameParts(user.name);

        await db.user.update({
          where: { id: existingUserByEmail.id },
          data: {
            firstName: existingUserByEmail.firstName || nameParts.firstName,
            lastName: existingUserByEmail.lastName || nameParts.lastName,
            password: existingUserByEmail.password || '',
          },
        });

        return true;
      }

      const { firstName, lastName } = getNameParts(user.name);

      await db.user.create({
        data: {
          email: user.email,
          firstName,
          lastName,
          password: '',
        },
      });

      return true;
    },
    async jwt({ token, user, account }) {
      if (user?.email) {
        const dbUser = await db.user.findUnique({
          where: { email: user.email },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        });

        if (dbUser) {
          return {
            ...token,
            id: `${dbUser.id}`,
            email: dbUser.email,
            firstName: dbUser.firstName,
            lastName: dbUser.lastName,
            userRole: dbUser.role,
            accessToken: account?.access_token || token.accessToken,
            provider: account?.provider || token.provider,
          };
        }
      }

      if (token.id) {
        const dbUser = await db.user.findUnique({
          where: { id: Number(token.id) },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        });

        if (dbUser) {
          return {
            ...token,
            id: `${dbUser.id}`,
            email: dbUser.email,
            firstName: dbUser.firstName,
            lastName: dbUser.lastName,
            userRole: dbUser.role,
            accessToken: token.accessToken,
            provider: token.provider,
          };
        }
      }

      return {
        ...token,
        accessToken: token.accessToken,
        provider: token.provider,
      };
    },
    async session({ session, token }) {
      return {
        ...session,
        accessToken: token.accessToken,
        provider: token.provider,
        user: {
          ...session.user,
          id: token.id,
          email: token.email,
          firstName: token.firstName,
          lastName: token.lastName,
          userRole: token.userRole,
        },
      };
    },
  },
};

export default NextAuth(authOptions);
