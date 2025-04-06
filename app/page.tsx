import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { SignInButton } from "@/components/sign-in-button";
import { FeedbackForm } from "@/components/feedback-form";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="grid min-h-dvh grid-cols-[1fr_2.5rem_minmax(0,var(--container-lg))_2.5rem_1fr] grid-rows-[1fr_auto_1fr] overflow-clip">
      <div className="border-border col-start-2 row-span-full border-x bg-[image:repeating-linear-gradient(315deg,_var(--color-border)_0,_var(--color-border)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] max-lg:hidden" />

      <main className="max-sm:bg-foreground/5 sm:before:border-border sm:before:bg-border/75 sm:after:bg-border/75 grid grid-cols-1 max-sm:col-span-full max-sm:col-start-1 max-sm:row-span-full max-sm:p-2 sm:relative sm:col-start-3 sm:row-start-2 sm:-mx-px sm:p-[calc(0.5rem+1px)] sm:before:absolute sm:before:top-0 sm:before:-left-[100vw] sm:before:h-px sm:before:w-[200vw] sm:after:absolute sm:after:bottom-0 sm:after:-left-[100vw] sm:after:h-px sm:after:w-[200vw]">
        <div className="bg-background grid grid-cols-1 items-center rounded-xl max-sm:p-6 sm:p-10">
          <div className="grid grid-cols-1 gap-10">
            {session ? <FeedbackForm /> : <SignInButton />}
          </div>
        </div>
      </main>

      <div className="border-border col-start-4 row-span-full border-x bg-[image:repeating-linear-gradient(315deg,_var(--color-border)_0,_var(--color-border)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] max-lg:hidden" />
    </div>
  );
}
