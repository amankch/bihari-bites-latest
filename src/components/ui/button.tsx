import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bihari-terracotta disabled:pointer-events-none disabled:opacity-50 select-none shadow-sm",
  {
    variants: {
      variant: {
        default:
          "bg-bihari-terracotta text-white hover:bg-[#9a2b1c] active:scale-[0.98]",
        secondary:
          "bg-bihari-haldi text-white hover:bg-[#b86303] active:scale-[0.98]",
        outline:
          "border border-bihari-terracotta/30 bg-transparent text-bihari-dark hover:bg-bihari-parchment",
        ghost:
          "hover:bg-amber-100/60 text-bihari-dark hover:text-bihari-terracotta shadow-none",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]",
        success:
          "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-xl px-6 text-base font-semibold",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
