"use client";

// === Unified Platform Section: heading + subtext ตามด้วยแถว 5 icon
// เรียงแนวนอน (มือถือ wrap เป็น 2 แถว) แต่ละอันมี icon + label ใต้ icon
// สื่อถึงจุดร่วมที่ทุกโซลูชันทำงานบนบริบทเดียวกัน ===

import type { LucideIcon } from "lucide-react";
import { BarChart3, Link2, ShieldCheck, Sparkles, Workflow } from "lucide-react";
import type { UnifiedPlatformContent } from "../types";

const ICON_ORDER: { icon: LucideIcon; badgeClassName: string }[] = [
  { icon: Link2, badgeClassName: "bg-brand-blue" },
  { icon: ShieldCheck, badgeClassName: "bg-emerald-500" },
  { icon: Sparkles, badgeClassName: "bg-violet-600" },
  { icon: Workflow, badgeClassName: "bg-orange-500" },
  { icon: BarChart3, badgeClassName: "bg-cyan-500" },
];

type UnifiedPlatformSectionProps = {
  content: UnifiedPlatformContent;
};

export function UnifiedPlatformSection({ content }: UnifiedPlatformSectionProps) {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="text-3xl font-bold text-brand-navy sm:text-4xl">{content.title}</h2>
        <p className="mt-4 text-slate-600 ">{content.subtitle}</p>

        <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-10 sm:flex-nowrap sm:justify-between">
          {content.items.map((label, index) => {
            const { icon: Icon, badgeClassName } = ICON_ORDER[index % ICON_ORDER.length];
            return (
              <div key={label} className="flex w-32 flex-col items-center gap-3">
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-full text-white shadow-md ${badgeClassName}`}
                >
                  <Icon className="h-6 w-6" />
                </span>
                <span className="text-sm font-semibold text-brand-navy">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
