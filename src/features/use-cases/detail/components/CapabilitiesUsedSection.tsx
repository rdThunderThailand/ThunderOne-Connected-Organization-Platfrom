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
    <section className="bg-white px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-3xl">
        <SectionHeader number={content.number} title={content.title} />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {content.items.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Check className="h-3.5 w-3.5" />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
