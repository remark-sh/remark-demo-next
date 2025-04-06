import { createAuthClient } from "better-auth/react";

// const theta = new Theta(process.env.THETA_API_KEY!);

export const authClient = createAuthClient();

export const signIn = async () => {
  await authClient.signIn.social({
    provider: "github",
  });
};
