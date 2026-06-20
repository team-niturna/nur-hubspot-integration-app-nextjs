"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { label: string; value: string }[];
  searchable?: boolean;
  value: string;
  onValueChange?: (value: string) => void;
}

const selectClassName =
  "flex h-11 w-full appearance-none rounded-2xl border border-slate-200 bg-white bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364748b%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3e%3cpolyline points=%226 9 12 15 18 9%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1.25em_1.25em] bg-no-repeat bg-[right_0.75rem_center] px-4 py-2 pr-10 text-sm text-slate-900 shadow-sm transition duration-200 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100";

const searchInputClassName =
  "flex h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm transition duration-200 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100";

export function Select({ label, options, searchable, value, onValueChange, className, ...props }: SelectProps) {
  const [query, setQuery] = React.useState("");
  const filteredOptions = React.useMemo(
    () => options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()) || option.value.toLowerCase().includes(query.toLowerCase())),
    [options, query],
  );

  return (
    <div className={cn("space-y-2", className)}>
      {label && <label className="block text-sm font-semibold text-slate-700">{label}</label>}
      {searchable ? (
        <div className="space-y-2">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search properties..."
            className={searchInputClassName}
          />
          <select
            value={value}
            onChange={(event) => {
              onValueChange?.(event.target.value);
              setQuery("");
            }}
            className={selectClassName}
            {...props}
          >
            <option value="">Do Not Map</option>
            {filteredOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <select
          value={value}
          onChange={(event) => onValueChange?.(event.target.value)}
          className={selectClassName}
          {...props}
        >
          <option value="">Select...</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
