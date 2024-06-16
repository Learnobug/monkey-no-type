import NextAuth from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials'

import bcrypt from "bcrypt"

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const handler = NextAuth({
  providers: [
    CredentialsProvider({
        name: 'Credentials',
        credentials: {
          email: { label: 'email', type: 'text', placeholder: '' },
          password: { label: 'password', type: 'password', placeholder: '' },
        },
        async authorize(credentials: any) {
            const hashedPassword = await bcrypt.hash(credentials.password, 10);
            const existingUser = await prisma.user.findFirst({
                where: {
                    email : credentials.email
                }
            });
            if (existingUser) {
                const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password);
                if (passwordValidation) {
                    return {
                        id: existingUser.id.toString(),
                        // name: existingUser.name,
                        email: existingUser.email
                    }
                }
                return null;
            }
            console.log(credentials)
            try {
                const user = await prisma.user.create({
                    data: {
                        email: credentials.email,
                        password: hashedPassword
                    }
                });
            
                return {
                    id: user.id.toString(),
                    // name: user.name,
                    email: user.email
                }
            } catch(e) {
                console.error(e);
            }

            return null
        },
      }),

  ],
  secret: process.env.NEXTAUTH_SECRET
})

export { handler as GET, handler as POST }