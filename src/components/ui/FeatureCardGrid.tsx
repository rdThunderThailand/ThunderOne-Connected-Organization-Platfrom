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
  /** Extra classes on the grid container, e.g. responsive divider borders. */
  dividerClassName?: string;
};

export function FeatureCardGrid({
  items,
  columnsClassName = "",
  dividerClassName = "",
}: FeatureCardGridProps) {
  return (
    <div className={`grid gap-3 ${columnsClassName} ${dividerClassName}`}>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          // Outer cell stretches to the row height; justify-center keeps the
          // content vertically centered instead of pinned to the top when a
          // sibling card is taller. Divider borders (see dividerClassName) land
          // on this element, so they span the full row height.
          <div key={item.title} className="flex w-full flex-col justify-center p-4">
            <div className="flex items-start gap-3">
              <span
                className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  item.badgeClassName ?? "bg-brand-blue/10 text-brand-blue"
                }`}
              >
                <Icon className="h-8 w-8" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-brand-navy">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.description}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
