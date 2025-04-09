import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { Remark } from "@remark-sh/sdk";

import { db } from "@/lib/db/drizzle";
import { schema } from "@/lib/db/schema";

export const remark = new Remark(process.env.REMARK_API_KEY!);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  databaseHooks: {
    user: {
      create: {
        async after(user) {
          const [firstName, lastName] = user.name.split(" ");

          const { error } = await remark.contacts.create({
            email: user.email,
            lastName,
            firstName,
          });

          if (error) {
            throw new Error(error.message);
          }
        },
      },
      update: {
        async after(user) {
          const [firstName, lastName] = user.name.split(" ");

          const { error } = await remark.contacts.update({
            email: user.email,
            lastName,
            firstName,
          });

          if (error) {
            throw new Error(error.message);
          }
        },
      },
    },
  },
  user: {
    deleteUser: {
      enabled: true,
      beforeDelete: async (user) => {
        const { error } = await remark.contacts.delete({
          email: user.email,
        });

        if (error) {
          throw new Error(error.message);
        }
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
