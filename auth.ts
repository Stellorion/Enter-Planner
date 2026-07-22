import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { db } from '@/db/connect';
import { compareFunction } from '@/utils/hashFunction';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
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

        if (!existingUserByEmail) {
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
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userRole: user.userRole,
        };
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
          };
        }
      }

      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
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
