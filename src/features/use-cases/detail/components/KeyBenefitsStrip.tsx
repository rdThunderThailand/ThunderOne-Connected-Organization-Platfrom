"use client";

// === Key Benefits Strip: 5-column FeatureCardGrid (shared) directly under
// the hero, no section number/heading per the reference design. ===

import { FeatureCardGrid, type FeatureCardItem } from "@/components/ui/FeatureCardGrid";
import { ICONS } from "../../iconRegistry";
import type { KeyBenefitsContent } from "../types";

type KeyBenefitsStripProps = {
  content: KeyBenefitsContent;
};

// Vertical divider between cards, drawn as an inset ::before hairline on every
// card that is not the first in its row (5 cols on lg, 2 cols on sm..lg).
// Columns are flush (gap-x 0) so the line lands on the seam; inset-y-4 keeps
// it clear of the strip's rounded corners instead of running edge to edge.
const DIVIDER_CLASSNAME = `
  [&>*]:relative sm:gap-x-0
  lg:[&>*:not(:nth-child(5n+1))]:before:absolute
  lg:[&>*:not(:nth-child(5n+1))]:before:inset-y-4
  lg:[&>*:not(:nth-child(5n+1))]:before:-left-4
  lg:[&>*:not(:nth-child(5n+1))]:before:w-px
  lg:[&>*:not(:nth-child(5n+1))]:before:bg-slate-200
  lg:[&>*:not(:nth-child(5n+1))]:before:content-['']
  sm:max-lg:[&>*:nth-child(2n)]:before:absolute
  sm:max-lg:[&>*:nth-child(2n)]:before:inset-y-4
  sm:max-lg:[&>*:nth-child(2n)]:before:-left-4
  sm:max-lg:[&>*:nth-child(2n)]:before:w-px
  sm:max-lg:[&>*:nth-child(2n)]:before:bg-slate-200
  sm:max-lg:[&>*:nth-child(2n)]:before:content-['']
`;

export function KeyBenefitsStrip({ content }: KeyBenefitsStripProps) {
  const items: FeatureCardItem[] = content.items.map((item) => ({
    title: item.title,
    description: item.description,
    icon: ICONS[item.icon],
  }));

  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-2xl border border-slate-200">
        <FeatureCardGrid
          items={items}
          columnsClassName="sm:grid-cols-2 lg:grid-cols-5"
          dividerClassName={DIVIDER_CLASSNAME}
        />
      </div>
    </section>
  );
}
