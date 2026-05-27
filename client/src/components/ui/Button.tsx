import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
  size?: "sm" | "md";
};

export function Button({ className, variant = "primary", size = "md", ...props }: Props) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition disabled:opacity-60 disabled:cursor-not-allowed",
        size === "sm" ? "h-9 px-3 text-sm" : "h-11 px-4",
        variant === "primary" &&
          "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800",
        variant === "ghost" &&
          "bg-transparent text-slate-900 hover:bg-slate-200 active:bg-slate-300 dark:text-slate-100 dark:hover:bg-slate-800 dark:active:bg-slate-700",
        variant === "danger" && "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800",
        className,
      )}
      {...props}
    />
  );
}

