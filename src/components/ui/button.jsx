import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FDC3A1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A] disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[#F4E7CD] text-[#1A1A1A] hover:bg-[#FDC3A1] font-inter font-semibold tracking-wider uppercase",
        destructive:
          "bg-[#8E8677] text-[#1A1A1A] hover:bg-[#F4E7CD]",
        outline:
          "border border-[#3A3A3A] bg-transparent text-[#F4E7CD] hover:border-[#FDC3A1] hover:text-[#FDC3A1]",
        secondary:
          "bg-[#232323] text-[#F4E7CD] border border-[#3A3A3A] hover:bg-[#2E2E2E]",
        ghost:
          "text-[#F4E7CD] hover:bg-[#232323] hover:text-[#FDC3A1]",
        link: "text-[#FDC3A1] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-7 py-2.5 text-xs",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-sm",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants };
