"use client";

// === Unified Platform Section: heading + subtext ตามด้วยแถว 5 icon
// เรียงแนวนอน (มือถือ wrap เป็น 2 แถว) แต่ละอันมี icon + label ใต้ icon
// สื่อถึงจุดร่วมที่ทุกโซลูชันทำงานบนบริบทเดียวกัน ===

import type { LucideIcon } from "lucide-react";
import { BarChart3, Brain, Link2, ShieldCheck, Workflow } from "lucide-react";
import type { UnifiedPlatformContent } from "../types";

const ICON_ORDER: { icon: LucideIcon; iconClassName: string }[] = [
  { icon: Link2, iconClassName: "text-brand-navy" },
  { icon: ShieldCheck, iconClassName: "text-brand-navy" },
  { icon: Brain, iconClassName: "text-brand-blue" },
  { icon: Workflow, iconClassName: "text-brand-navy" },
  { icon: BarChart3, iconClassName: "text-brand-navy" },
];

type UnifiedPlatformSectionProps = {
  content: UnifiedPlatformContent;
};

export function UnifiedPlatformSection({ content }: UnifiedPlatformSectionProps) {
  return (
    <section className="px-4 py-14 sm:px-6 ">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="text-3xl font-bold text-brand-navy sm:text-4xl">{content.title}</h2>
        <p className="mt-4 text-slate-600 ">{content.subtitle}</p>

        <div className="mt-12 flex flex-wrap justify-center gap-y-10 sm:flex-nowrap sm:justify-between sm:divide-x sm:divide-slate-200">
          {content.items.map((label, index) => {
            const { icon: Icon, iconClassName } = ICON_ORDER[index % ICON_ORDER.length];
            return (
              <div key={label} className="flex w-50 flex-col items-center gap-3 px-8">
                <Icon className={`h-14 w-14 ${iconClassName}`} strokeWidth={1.75} />
                <span className="whitespace-pre-line text-sm font-semibold text-brand-navy">
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
