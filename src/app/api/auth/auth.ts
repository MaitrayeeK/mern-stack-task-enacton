import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { db } from "../../../../db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "john.doe@example.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password ",
        },
      },
      async authorize(credentials: any, req) {
        const user = await db
          .selectFrom("users")
          .selectAll()
          .where("email", "=", credentials?.email as any)
          .executeTakeFirst();

        const match: any = bcrypt.compare(
          credentials?.password,
          user?.password as string
        );

        if (user && match) {
          return {
            id: String(user.id),
            name: user.name,
            email: user.email,
            image: "",
          };
        } else {
          return null;
          // throw new Error("Invalid email or password");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // if (account && user) {
      //   const existingUser = await db
      //     .selectFrom("users")
      //     .select("id")
      //     .where("provider_id", "=", account.providerAccountId)
      //     .executeTakeFirst();

      //   if (!existingUser) {
      //     // User does not exist, insert them into the database
      //     await db
      //       .insertInto("users")
      //       .values({
      //         name: user.name as string,
      //         email: user.email as string,
      //         provider: account.provider,
      //         provider_id: account.providerAccountId,
      //       })
      //       .execute();
      //   }
      // }

      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
