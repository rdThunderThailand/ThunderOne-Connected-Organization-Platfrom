"use client";

// === Key Capabilities Section: heading ตามด้วย FeatureCardGrid (shared)
// การ์ด 6 อัน (icon + title + คำอธิบายสั้น 1 บรรทัด) — icon badge ทั้งหมด
// ใช้โทนน้ำเงินเดียวกัน ===

// TODO: confirm copy — card #4 EN screenshot says "Inspection & Compliance",
// TH screenshot says "Inventory & Spare Parts" (different meaning). Using the
// EN meaning for both locales per team decision (2026-08-20); content team to
// confirm which is correct before publish.

import type { LucideIcon } from "lucide-react";
import { BarChart3, Boxes, ClipboardCheck, ClipboardList, Wifi, Wrench } from "lucide-react";
import { FeatureCardGrid, type FeatureCardItem } from "@/components/ui/FeatureCardGrid";
import type { KeyCapabilitiesContent } from "../types";

const ICONS: LucideIcon[] = [Boxes, ClipboardList, Wrench, ClipboardCheck, BarChart3, Wifi];
const BADGE_CLASS = "bg-blue-100 text-brand-blue";

type KeyCapabilitiesSectionProps = {
  content: KeyCapabilitiesContent;
};

export function KeyCapabilitiesSection({ content }: KeyCapabilitiesSectionProps) {
  const items: FeatureCardItem[] = content.items.map((item, index) => ({
    ...item,
    icon: ICONS[index % ICONS.length],
    badgeClassName: BADGE_CLASS,
  }));

  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-3xl font-bold text-brand-navy sm:text-4xl">{content.title}</h2>
        <div className="mt-12">
          <FeatureCardGrid items={items} />
        </div>
      </div>
    </section>
  );
}
