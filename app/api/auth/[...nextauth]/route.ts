import NextAuth from "next-auth";
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
        username: { label: "Username (for new accounts)", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const existingUser = await prisma.user.findFirst({
          where: { email: credentials.email },
        });

        if (existingUser) {
          // Login: verify password
          const valid = await bcryptjs.compare(
            credentials.password,
            existingUser.password
          );
          if (!valid) return null;
          return {
            id: String(existingUser.id),
            email: existingUser.email,
            name: existingUser.username,
          };
        }

        // Register: create new user
        try {
          const hashed = await bcryptjs.hash(credentials.password, 10);
          const user = await prisma.user.create({
            data: {
              email: credentials.email,
              password: hashed,
              username: credentials.username || "Guest",
            },
          });
          return {
            id: String(user.id),
            email: user.email,
            name: user.username,
          };
        } catch (e) {
          console.error("Registration error:", e);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
        token.name = user.name;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (session.user) {
        (session.user as any).id = token.uid;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
