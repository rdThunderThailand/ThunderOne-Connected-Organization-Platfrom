"use client";

// === Capabilities Used Section: SectionHeader + vertical checklist, green
// check icon per line. The check icon is a universal structural symbol (not
// content that varies per use case), so it's imported directly here rather
// than routed through the icon data file. ===

import { Check } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import type { CapabilitiesContent } from "../types";

type CapabilitiesUsedSectionProps = {
  content: CapabilitiesContent;
};

export function CapabilitiesUsedSection({ content }: CapabilitiesUsedSectionProps) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6">
      <SectionHeader number={content.number} title={content.title} />
      <ul className="mt-6 space-y-3">
        {content.items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-xs text-slate-700">
            <span className="mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Check className="h-2.5 w-2.5" />
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
