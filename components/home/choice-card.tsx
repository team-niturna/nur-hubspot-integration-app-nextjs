"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChoiceCardProps {
  title: string;
  description: string;
  actionLabel: string;
  icon: string;
  selected: boolean;
  isLoading: boolean;
  onSelect: () => void;
}

export function ChoiceCard({
  title,
  description,
  actionLabel,
  icon,
  selected,
  isLoading,
  onSelect,
}: ChoiceCardProps) {
  return (
    <div
      className={cn(
        "group cursor-pointer rounded-2xl border-2 p-6 transition-all duration-200",
        selected
          ? "border-indigo-500 bg-indigo-50 shadow-lg"
          : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/30 hover:shadow-md hover:-translate-y-0.5",
      )}
      onClick={onSelect}
    >
      <div
        className={cn(
          "inline-flex h-14 w-14 items-center justify-center rounded-2xl text-2xl mb-4 transition",
          selected
            ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
            : "bg-slate-100 text-slate-700 group-hover:bg-indigo-100",
        )}
      >
        {icon}
      </div>

      <h3 className={cn("text-base font-bold mb-1", selected ? "text-indigo-900" : "text-slate-900")}>
        {title}
      </h3>
      <p className={cn("text-sm mb-5", selected ? "text-indigo-600" : "text-slate-500")}>
        {description}
      </p>

      <div className="flex items-center justify-between gap-3">
        <span className={cn(
          "rounded-full border px-3 py-1 text-xs font-semibold",
          selected
            ? "border-indigo-200 bg-indigo-100 text-indigo-700"
            : "border-slate-200 bg-slate-50 text-slate-500",
        )}>
          {selected ? "✓ Selected" : "Click to select"}
        </span>
        <Button
          type="button"
          variant={selected ? "secondary" : "default"}
          size="sm"
          isLoading={isLoading}
          onClick={(event) => {
            event.stopPropagation();
            onSelect();
          }}
        >
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}
