import NextAuth from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from "bcrypt";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: '' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const hashedPassword = await bcrypt.hash(credentials?.password, 10);
          const existingUser = await prisma.user.findFirst({
            where: { email: credentials?.email }
          });

          if (existingUser) {
            const passwordValid = await bcrypt.compare(credentials?.password, existingUser.password);
            if (passwordValid) {
              return { id: existingUser.id.toString(), email: existingUser.email };
            }
            return null;
          }

          const newUser = await prisma.user.create({
            data: { email: credentials?.email, password: hashedPassword }
          });

          if (newUser) {
            return { id: newUser.id.toString(), email: newUser.email };
          }

          return null; // Should not reach here under normal circumstances
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
