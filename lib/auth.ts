import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

import { db } from "@/lib/db/drizzle";
import { schema } from "@/lib/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  databaseHooks: {
    user: {
      create: {
        // after(user) {
        // // Every new user is added to the theta contact list
        // await theta.contacts.create({
        //   id: session?.user.id,
        //   email: session?.user.email,
        //   firstName: session?.user.name.split(" ")[0],
        //   lastName: session?.user.name.split(" ")[1],
        // });
        // },
      },
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },

  plugins: [nextCookies()],
});
