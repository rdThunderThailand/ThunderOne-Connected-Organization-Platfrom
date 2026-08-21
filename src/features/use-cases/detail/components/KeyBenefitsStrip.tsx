"use client";

// === Key Benefits Strip: 5-column FeatureCardGrid (shared) directly under
// the hero, no section number/heading per the reference design. ===

import { FeatureCardGrid, type FeatureCardItem } from "@/components/ui/FeatureCardGrid";
import { ICONS } from "../../iconRegistry";
import type { KeyBenefitsContent } from "../types";

type KeyBenefitsStripProps = {
  content: KeyBenefitsContent;
};

export function KeyBenefitsStrip({ content }: KeyBenefitsStripProps) {
  const items: FeatureCardItem[] = content.items.map((item) => ({
    title: item.title,
    description: item.description,
    icon: ICONS[item.icon],
  }));

  return (
    <section className="bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <FeatureCardGrid items={items} columnsClassName="sm:grid-cols-2 lg:grid-cols-5" />
      </div>
    </section>
  );
}
