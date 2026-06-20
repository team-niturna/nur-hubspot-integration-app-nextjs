"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "outline" | "secondary";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  default:
    "bg-slate-950 text-white hover:bg-slate-900 focus-visible:ring-slate-950",
  outline:
    "border border-slate-200 bg-white text-slate-950 hover:bg-slate-50 focus-visible:ring-slate-950",
  secondary:
    "bg-slate-100 text-slate-950 hover:bg-slate-200 focus-visible:ring-slate-950",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-10 rounded-xl px-4 text-sm",
  md: "h-12 rounded-2xl px-5 text-sm font-medium",
  lg: "h-14 rounded-[1.25rem] px-6 text-base font-semibold",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      isLoading,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-60",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white" />
        ) : null}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button };
