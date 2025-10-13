import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  
  callbacks: {
    async session({ session }) {
      // Добавляем email в сессию (и можно пометить админа)
      if (session?.user?.email === "elfasatasa@gmail.com") {
        session.user.role = "admin";
      } else {
        session.user.role = "user";
      }
      return session;
    },
  },
};
