"use client";

import { cn } from "@/lib/utils";

interface ToastProps {
  type: "success" | "error";
  message: string;
  visible: boolean;
}

export function Toast({ type, message, visible }: ToastProps) {
  if (!visible) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 max-w-sm rounded-3xl border px-5 py-4 shadow-2xl shadow-slate-900/15 transition-all duration-200",
        type === "success"
          ? "border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-300"
          : "border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 text-rose-950 dark:text-rose-300",
      )}
    >
      <p className="font-semibold text-base">{type === "success" ? "Success" : "Error"}</p>
      <p className="mt-1 text-sm leading-6">{message}</p>
    </div>
  );
}
