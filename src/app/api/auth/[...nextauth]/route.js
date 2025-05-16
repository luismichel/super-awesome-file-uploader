import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare, hash } from "bcrypt";

import { prisma } from "@/lib/prisma";

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        //const user = await getUserByEmail(credentials?.email);
        const user = await prisma.user.findUnique({
          where: {
            email: credentials?.email,
          },
        });

        if (!user) throw new Error("No user found");

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) throw new Error("Invalid password");

        console.log("User found:", user, {
          id: user.id,
          email: user.email,
          role: user.role, // attach role
        });
        return {
          id: user.id,
          email: user.email,
          role: user.role, // attach role
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; // persist role in token
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
