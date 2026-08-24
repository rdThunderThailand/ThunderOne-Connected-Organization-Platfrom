"use client";

// === Before vs. With ThunderOne Section: SectionHeader + one bordered card
// split into two columns (divider on desktop, stacked on mobile) — red-X
// "Before" rows paired row-by-row with green-check "With ThunderOne" rows. ===

import { Check, X } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import type { BeforeAfterContent } from "../types";

type BeforeAfterSectionProps = {
  content: BeforeAfterContent;
};

export function BeforeAfterSection({ content }: BeforeAfterSectionProps) {
  return (
    <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-5xl">
        <SectionHeader number={content.number} title={content.title} />

        <div className="mt-8 grid overflow-hidden rounded-2xl border border-slate-200 bg-white sm:grid-cols-2">
          <div className="border-b border-slate-200 sm:border-b-0 sm:border-r">
            <p className="bg-red-50 px-6 py-3 text-sm font-bold text-red-700">{content.beforeTitle}</p>
            <ul className="space-y-4 p-6">
              {content.before.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-500">
                    <X className="h-3.5 w-3.5" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="bg-emerald-50 px-6 py-3 text-sm font-bold text-emerald-700">{content.afterTitle}</p>
            <ul className="space-y-4 p-6">
              {content.after.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
