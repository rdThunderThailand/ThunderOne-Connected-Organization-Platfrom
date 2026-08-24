"use client";

import type { LucideIcon } from "lucide-react";

type OptionPillProps = {
  selected: boolean;
  onClick: () => void;
  label: string;
  description?: string;
  icon?: LucideIcon;
  // "row" — icon + title + description card, used for the topic list.
  // "pill" — small radio-pill chip, used for question options.
  variant?: "row" | "pill";
};

export function OptionPill({
  selected,
  onClick,
  label,
  description,
  icon: Icon,
  variant = "pill",
}: OptionPillProps) {
  if (variant === "row") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={selected}
        className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-colors ${
          selected
            ? "border-brand-blue bg-brand-blue/5"
            : "border-slate-200 hover:border-brand-blue/50 hover:bg-slate-50"
        }`}
      >
        {Icon && (
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              selected ? "bg-brand-blue text-white" : "bg-slate-100 text-slate-500"
            }`}
          >
            <Icon className="h-5 w-5" />
          </span>
        )}
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-brand-navy">{label}</span>
          {description && (
            <span className="mt-0.5 block text-xs text-slate-500">{description}</span>
          )}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
        selected
          ? "border-brand-blue bg-brand-blue text-white"
          : "border-slate-200 text-slate-600 hover:border-brand-blue/50 hover:text-brand-blue"
      }`}
    >
      {label}
    </button>
  );
}
