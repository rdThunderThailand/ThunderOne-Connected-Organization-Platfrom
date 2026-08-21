"use client";

// === Shared feature-card grid: bordered cards with a colored icon badge,
// title, and one-line description. Used for "key capabilities"-style
// sections across solution detail pages — items/columns supplied by the
// caller. ===

import type { LucideIcon } from "lucide-react";

export type FeatureCardItem = {
  title: string;
  description: string;
  icon: LucideIcon;
  badgeClassName?: string;
};

type FeatureCardGridProps = {
  items: FeatureCardItem[];
  columnsClassName?: string;
};

export function FeatureCardGrid({
  items,
  columnsClassName = "sm:grid-cols-2 lg:grid-cols-3",
}: FeatureCardGridProps) {
  return (
    <div className={`grid gap-6 ${columnsClassName}`}>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.title} className="flex rounded-2xl border border-slate-200 p-3">
            <div>
            <span
              className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${
                item.badgeClassName ?? "bg-brand-blue/10 text-brand-blue"
              }`}
            >
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-sm font-bold text-brand-navy">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-500">{item.description}</p>
            </div>

          </div>
        );
      })}
    </div>
  );
}
