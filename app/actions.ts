"use server";

import { Theta } from "@theta-sdk/node";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

const theta = new Theta(process.env.THETA_API_KEY!);

export async function send(text: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await theta.feedbacks.create({
    from: session.user.email,
    text,
  });
}
