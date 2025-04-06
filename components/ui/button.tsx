import { Slot, Slottable } from "@radix-ui/react-slot";
import { VariantProps, cva } from "class-variance-authority";
import { Loader } from "lucide-react";
import { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium text-sm outline-offset-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-black/5 shadow-xs hover:bg-primary/90",
        outline:
          "border border-input bg-background shadow-black/5 shadow-xs hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "",
      },
      loading: {
        true: "text-transparent",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    compoundVariants: [
      {
        size: "default",
        variant: ["default", "outline"],
        className: "h-9 px-4 py-2 has-[>svg:not(.loading)]:px-3",
      },
    ],
  },
);

function Button({
  className,
  variant,
  size,
  children,
  disabled,
  asChild = false,
  loading = false,
  ...props
}: ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className, loading }))}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Loader
          size={16}
          className={cn(
            "absolute animate-spin",
            variant === "default" ? "text-muted" : "text-muted-foreground",
            // Used for conditional styling when button is loading
            "loading",
          )}
        />
      )}
      <Slottable>{children}</Slottable>
    </Comp>
  );
}

export { Button, buttonVariants };
