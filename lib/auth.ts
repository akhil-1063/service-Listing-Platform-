import { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import connectDB from "./mongodb";
import User from "@/models/User";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: 'customer' | 'professional';
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: 'customer' | 'professional';
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: 'customer' | 'professional';
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      async profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "customer",
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password");
        }

        await connectDB();
        const user = await User.findOne({ email: credentials.email.toLowerCase() });

        if (!user || !user.password) {
          throw new Error("No user found with this email");
        }

        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordCorrect) {
          throw new Error("Incorrect password");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        await connectDB();
        let existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          existingUser = await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            googleId: profile?.sub || account.providerAccountId,
            role: "customer", // Default; can onboard to professional later if desired
          });
        } else if (!existingUser.googleId) {
          existingUser.googleId = profile?.sub || account.providerAccountId;
          if (user.image && !existingUser.image) {
            existingUser.image = user.image;
          }
          await existingUser.save();
        }
        user.role = existingUser.role;
        user.id = existingUser._id.toString();
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};
