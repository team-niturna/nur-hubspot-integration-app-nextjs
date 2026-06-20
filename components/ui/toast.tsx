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
        "fixed bottom-6 right-6 z-50 flex max-w-sm items-start gap-3 rounded-2xl border px-5 py-4 shadow-xl transition-all duration-300",
        type === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-900"
          : "border-rose-200 bg-rose-50 text-rose-900",
      )}
    >
      <span className="mt-0.5 text-lg leading-none">
        {type === "success" ? "✅" : "❌"}
      </span>
      <div>
        <p className="font-bold text-sm">{type === "success" ? "Success" : "Error"}</p>
        <p className="mt-0.5 text-sm leading-5">{message}</p>
      </div>
    </div>
  );
}
