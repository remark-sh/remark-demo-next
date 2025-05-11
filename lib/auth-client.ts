import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

export const signIn = async (provider: "github" | "google") => {
  await authClient.signIn.social({
    provider,
  });
};
