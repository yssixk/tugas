import type { InputHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type Props = InputHTMLAttributes<HTMLInputElement> & { error?: string };

export function Input({ className, error, ...props }: Props) {
  return (
    <div className="w-full">
      <input
        className={cn(
          "h-11 w-full rounded-xl border bg-white px-3 text-slate-900 shadow-sm transition placeholder:text-slate-400",
          "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100",
          "dark:bg-slate-900 dark:text-slate-100 dark:border-slate-800 dark:focus:border-emerald-400 dark:focus:ring-emerald-900/30",
          error && "border-rose-400 focus:border-rose-500 focus:ring-rose-100 dark:border-rose-500/60 dark:focus:ring-rose-900/30",
          className,
        )}
        {...props}
      />
      {error ? <p className="mt-1 text-sm text-rose-600 dark:text-rose-400">{error}</p> : null}
    </div>
  );
}

