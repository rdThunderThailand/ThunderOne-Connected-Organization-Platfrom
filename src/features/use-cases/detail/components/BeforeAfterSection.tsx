"use client";

// === Before vs. With ThunderOne Section: SectionHeader + two tight columns
// inside one bordered card — a red pill "Before" list (X rows) beside a green
// pill "With ThunderOne" list (check rows). Rendered as an equal-height cell
// in the closing 4-card row, so the columns stay narrow. ===

import { Check, X } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import type { BeforeAfterContent } from "../types";

type BeforeAfterSectionProps = {
  content: BeforeAfterContent;
};

export function BeforeAfterSection({ content }: BeforeAfterSectionProps) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6">
      <SectionHeader number={content.number} title={content.title} />

      <div className="mt-6 grid grid-cols-2">
        <div className="pr-4">
          <span className="inline-block rounded-full bg-red-50 px-3 py-1 text-[11px] font-bold text-red-700">
            {content.beforeTitle}
          </span>
          <ul className="mt-3 space-y-3">
            {content.before.map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-slate-600">
                <span className="mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-500">
                  <X className="h-2.5 w-2.5" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-l border-slate-200 pl-4">
          <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
            {content.afterTitle}
          </span>
          <ul className="mt-3 space-y-3">
            {content.after.map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-slate-600">
                <span className="mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Check className="h-2.5 w-2.5" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
