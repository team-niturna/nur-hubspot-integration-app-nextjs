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
        type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-950" : "border-rose-200 bg-rose-50 text-rose-950",
      )}
    >
      <p className="font-semibold">{type === "success" ? "Success" : "Error"}</p>
      <p className="mt-1 text-sm leading-6">{message}</p>
    </div>
  );
}
