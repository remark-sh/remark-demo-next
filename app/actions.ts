"use server";

import { Remark } from "@remark-sh/sdk";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

const remark = new Remark(process.env.REMARK_API_KEY!);

export async function send(text: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const { error } = await remark.feedbacks.create({
    from: session.user.email,
    text,
  });

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
}
