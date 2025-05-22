"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { send } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  text: z.string().min(2).max(2000),
  path: z.string().min(2).max(2000).optional(),
});

export function FeedbackForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
      path: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await send(data.text, data.path);
  };

  return form.formState.isSubmitted ? (
    <div className="text-muted-foreground space-y-1">
      <p className="text-sm">That&apos;s it!</p>
      <p className="text-sm">
        You can now go to your dashboard to see your feedback.
      </p>
    </div>
  ) : (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="text"
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
        <FormField
          control={form.control}
          name="path"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pathname (For AI to be more specific)</FormLabel>
              <FormControl>
                <div className="flex">
                  <span className="border-input bg-background text-muted-foreground z-1 inline-flex items-center rounded-l-md border px-3 text-sm">
                    /
                  </span>
                  <Input
                    type="text"
                    className="z-2 -ms-px rounded-none shadow-none"
                    placeholder="settings"
                    {...field}
                  />
                </div>
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
