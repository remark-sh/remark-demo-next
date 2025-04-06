"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { theta } from "@/config/theta";
import { authClient } from "@/lib/auth-client";
import { usePathname } from "next/navigation";

const formSchema = z.object({
  message: z.string().min(2).max(2000),
});

export function FeedbackForm() {
  const { data: session } = authClient.useSession();
  const pathname = usePathname();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!session?.user?.email) {
      return;
    }

    await theta.feedbacks.create({
      from: session?.user?.email,
      where: pathname, // optional but helpful for context, can be a url or a string
      message: data.message,
    });
  };

  return form.formState.isSubmitted ? (
    <div className="text-muted-foreground space-y-1">
      <p className="text-sm">That's it!</p>
      <p className="text-sm">
        You can now go to your dashboard to see your feedback.
      </p>
    </div>
  ) : (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  className="min-h-28 p-3"
                  placeholder="Submit a feedback..."
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            loading={form.formState.isSubmitting}
            disabled={!form.formState.isDirty}
          >
            Send
          </Button>
        </div>
      </form>
    </Form>
  );
}
