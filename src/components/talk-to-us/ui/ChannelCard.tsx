"use client";

import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";

type ChannelCardProps = {
  icon: LucideIcon;
  title: string;
  badge?: string;
  checklist: string[];
  ctaLabel: string;
  onCtaClick: () => void;
  tone: "line" | "default";
};

export function ChannelCard({
  icon: Icon,
  title,
  badge,
  checklist,
  ctaLabel,
  onCtaClick,
  tone,
}: ChannelCardProps) {
  const isLine = tone === "line";

  return (
    <div
      className={`rounded-2xl border p-5 ${
        isLine ? "border-[#06C755] bg-[#06C755]/5" : "border-slate-200"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            isLine ? "bg-[#06C755] text-white" : "bg-slate-100 text-slate-500"
          }`}
        >
          <Icon className="h-5 w-5" />
        </span>
        <span className="text-sm font-bold text-brand-navy">{title}</span>
        {badge && (
          <span className="ml-auto shrink-0 rounded-full bg-[#06C755] px-2.5 py-0.5 text-xs font-semibold text-white">
            {badge}
          </span>
        )}
      </div>

      <ul className="mt-4 space-y-2">
        {checklist.map((item) => (
          <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
            <Check className="h-4 w-4 shrink-0 text-emerald-500" />
            {item}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onCtaClick}
        className={`mt-5 w-full rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
          isLine
            ? "bg-[#06C755] text-white hover:bg-[#05b34c]"
            : "border border-brand-navy text-brand-navy hover:bg-slate-50"
        }`}
      >
        {ctaLabel}
      </button>
    </div>
  );
}
