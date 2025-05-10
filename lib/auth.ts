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
        async after({ name, email }) {
          const { error } = await remark.contacts.create({
            name,
            email,
          });

          if (error) {
            throw new Error(error.message);
          }

          console.log("Contact created", { name, email });
        },
      },
      update: {
        async after({ name, email }) {
          const { error } = await remark.contacts.update({
            email,
            name,
          });

          if (error) {
            throw new Error(error.message);
          }

          console.log("Contact updated", { name, email });
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

        console.log("Contact deleted", { email: user.email });
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
