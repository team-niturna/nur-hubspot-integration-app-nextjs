"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card
      className={cn(
        "group cursor-pointer transition duration-300",
        "border-slate-200 bg-white hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg",
        selected && "border-slate-950/10 bg-slate-950/5 shadow-lg",
      )}
      onClick={onSelect}
    >
      <CardHeader>
        <div
          className={cn(
            "inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-2xl transition",
            selected ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700",
          )}
        >
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-4">
          <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
            {selected ? "Selected" : "Recommended"}
          </div>
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
      </CardContent>
    </Card>
  );
}
