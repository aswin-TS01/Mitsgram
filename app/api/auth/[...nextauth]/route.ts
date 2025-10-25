import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials!;

        // 🟩 Try to find in User table (students)
        let user = await prisma.user.findUnique({
          where: { email },
        });

        // 🟩 If not found, check Faculty table
        if (!user) {
          const faculty = await prisma.faculty.findUnique({
            where: { email },
          });
          if (faculty) {
            user = faculty;
          }
        }

        // 🟥 If no user found or password mismatch → reject login
        if (!user || !(await bcrypt.compare(password, user.password))) {
          return null;
        }

        // 🟩 Return minimal safe user object
        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },
    async redirect({ baseUrl }) {
      // Redirect all logins (student or faculty) to /users
      return `${baseUrl}/users`;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };



