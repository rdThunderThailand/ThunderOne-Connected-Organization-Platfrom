"use client";

// === Key Capabilities Section: heading ตามด้วย FeatureCardGrid (shared)
// การ์ด 5 อัน (icon + title + คำอธิบายสั้น 1 บรรทัด) ===

import type { LucideIcon } from "lucide-react";
import { BarChart3, FolderOpen, ListVideo, MonitorCheck, Share2 } from "lucide-react";
import { FeatureCardGrid, type FeatureCardItem } from "@/components/ui/FeatureCardGrid";
import type { KeyCapabilitiesContent } from "../types";

const ICONS: LucideIcon[] = [FolderOpen, ListVideo, Share2, MonitorCheck, BarChart3];
const BADGE_CLASSES = [
  "bg-purple-100 text-purple-600",
  "bg-blue-100 text-blue-600",
  "bg-teal-100 text-teal-600",
  "bg-orange-100 text-orange-600",
  "bg-sky-100 text-sky-600",
];

type KeyCapabilitiesSectionProps = {
  content: KeyCapabilitiesContent;
};

export function KeyCapabilitiesSection({ content }: KeyCapabilitiesSectionProps) {
  const items: FeatureCardItem[] = content.items.map((item, index) => ({
    ...item,
    icon: ICONS[index % ICONS.length],
    badgeClassName: BADGE_CLASSES[index % BADGE_CLASSES.length],
  }));

  return (
    <section className="px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-3xl font-bold text-brand-navy sm:text-4xl">{content.title}</h2>
        <div className="mt-12">
          <FeatureCardGrid items={items} columnsClassName="sm:grid-cols-2 lg:grid-cols-5" />
        </div>
      </div>
    </section>
  );
}
