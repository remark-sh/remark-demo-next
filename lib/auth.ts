import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

import { db } from "@/lib/db/drizzle";
import { schema } from "@/lib/db/schema";
import { theta } from "@/config/theta";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  databaseHooks: {
    user: {
      create: {
        async after(user) {
          // 1. Split the name into two parts.
          const [firstName, lastName] = user.name.split(" ");

          // 2. Create a new contact in Theta.
          const { error } = await theta.contacts.create({
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
          // 1. Split the name into two parts.
          const [firstName, lastName] = user.name.split(" ");

          // 2. Update the contact in Theta.
          const { error } = await theta.contacts.update({
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
        const { error } = await theta.contacts.delete({
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
