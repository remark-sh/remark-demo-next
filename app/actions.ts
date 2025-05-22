"use server";

import { Remark } from "@remark-sh/sdk";
import { headers } from "next/headers";
import { userAgent } from "next/server";

import { auth } from "@/lib/auth";

const remark = new Remark(process.env.REMARK_API_KEY!);

export async function send(text: string, path?: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const { os, device, browser } = userAgent({
    headers: await headers(),
  });

  const { error } = await remark.feedbacks.create({
    from: session.user.email,
    text,
    metadata: {
      os: os.name,
      path: path ? `/${path}` : undefined,
      device: device.type,
      browser: browser.name,
    },
  });

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
}
