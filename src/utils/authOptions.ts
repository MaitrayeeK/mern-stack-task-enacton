import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "../../db";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    // GitHubProvider({
    //   clientId: process.env.GITHUB_ID ?? "",
    //   clientSecret: process.env.GITHUB_SECRET ?? "",
    // }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_ID ?? "",
    //   clientSecret: process.env.GOOGLE_SECRET ?? "",
    // }),
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
      async authorize(credentials, req) {
        const user = await db
          .selectFrom("users")
          .selectAll()
          .where("email", "=", credentials?.email as any)
          .executeTakeFirst();

        if (!user) {
          return null;
        }

        const match = await bcrypt.compare(
          credentials?.password as string,
          user?.password as string
        );

        if (user && match) {
          return {
            id: String(user.id),
            name: user.name,
            email: user.email,
            isVerified: Boolean(user.is_verified),
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
    async jwt({ token, user, trigger, session }) {
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
      if (trigger === "update" && session?.isVerified) {
        token.isVerified = session.isVerified;
      }
      if (user) {
        token.id = user.id;
        token.isVerified = (user as any).isVerified;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).isVerified = token.isVerified;
      }
      return session;
    },
  },
};
