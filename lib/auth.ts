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
          // Every new user is added to the theta contact list
          const res = await theta.contacts.create({
            id: user.id,
            email: user.email,
            firstName: user.name.split(" ")[0],
            lastName: user.name.split(" ")[1],
          });

          console.log("created contact:");

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
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },

  plugins: [nextCookies()],
});
