import { createAuthClient } from "better-auth/react";

// const theta = new Theta(process.env.THETA_API_KEY!);

export const authClient = createAuthClient();

export const signIn = async () => {
  const data = await authClient.signIn.social(
    {
      provider: "github",
    },
    {
      onSuccess: async (ctx) => {
        // 1. Get session
        const { data: session } = await authClient.getSession();

        // 2. Create a new contact in theta

        // await theta.contacts.create({
        //   id: session?.user.id,
        //   email: session?.user.email,
        //   firstName: session?.user.name.split(" ")[0],
        //   lastName: session?.user.name.split(" ")[1],
        // });
      },
    },
  );
};
