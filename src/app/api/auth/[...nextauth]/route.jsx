import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials) {
        const { email, password } = credentials;
        
        // validate here your username and password
        if(email !== 'alex@gmail.com' && password !== "123456") {
          throw new Error('invalid credentials');
        }
        // confirmed users
        return {id: 1, name: 'Alex', email: 'alex@gmail.com'}
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
