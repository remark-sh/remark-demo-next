import { Theta } from "@theta-sdk/node";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

import { db } from "@/lib/db/drizzle";
import { schema } from "@/lib/db/schema";

const theta = new Theta(process.env.THETA_API_KEY!);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  databaseHooks: {
    user: {
      create: {
        async after(user) {
          console.log("🔄 Creating new contact in Theta...");

          // Fix edge case where full name contains only one word
          const [firstName, lastName] = user.name.split(" ");

          const res = await theta.contacts.create({
            id: user.id,
            email: user.email,
            firstName: firstName || undefined,
            lastName: lastName || undefined,
          });

          console.log("✅ Contact created successfully!");
          console.log("📋 Contact details:");

          console.table({
            id: res?.data?.id,
            email: res?.data?.email,
            firstName: res?.data?.firstName,
            lastName: res?.data?.lastName,
          });
        },
      },
      update: {
        async after(user) {
          console.log("🔄 Updating contact in Theta...");

          // Fix edge case where full name contains only one word
          const [firstName, lastName] = user.name.split(" ");

          const res = await theta.contacts.update({
            id: user.id,
            email: user.email,
            firstName: firstName || undefined,
            lastName: lastName || undefined,
          });

          console.log("✅ Contact updated successfully!");
          console.log("📋 Contact details:");

          console.table({
            id: res?.data?.id,
            email: res?.data?.email,
            firstName: res?.data?.firstName,
            lastName: res?.data?.lastName,
          });
        },
      },
    },
  },
  user: {
    deleteUser: {
      enabled: true,
      beforeDelete: async (user) => {
        console.log("🔄 Deleting contact in Theta...");

        const res = await theta.contacts.delete(user.id);

        // If it fails, throw APIError to interrupt the deletion process.
        if (!res?.data?.id) {
          throw new Error("Can't delete in Theta, can't delete your account.");
        }

        console.log("✅ Contact deleted successfully!");

        console.log("📋 Contact details:");

        console.table({
          id: res?.data?.id,
        });
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
