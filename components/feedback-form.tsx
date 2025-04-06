"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

const formSchema = z.object({
  message: z.string().min(2).max(2000),
});

export function FeedbackForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };

  return form.formState.isSubmitted ? (
    <div className="space-y-1">
      <p className="text-sm font-medium">That's it!</p>
      <p className="text-sm opacity-80">
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
