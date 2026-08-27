"use client";

// === Situation / Outcome Section: two columns (divider between them on
// desktop, stacked on mobile) — 01 The Situation (illustration + red-X
// bullet list) and 02 The Outcome (illustration + green-check bullet
// list). ===

import { Check, X } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { ConfusedPersonIllustration } from "./illustrations/ConfusedPersonIllustration";
import { HappyPersonIllustration } from "./illustrations/HappyPersonIllustration";
import type { SituationOutcomeContent } from "../types";

type SituationOutcomeSectionProps = {
  content: SituationOutcomeContent;
};

export function SituationOutcomeSection({ content }: SituationOutcomeSectionProps) {
  const { situation, outcome } = content;

  return (
    <section className="px-4 py-8 sm:px-6 lg:py-10">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:divide-x lg:divide-slate-100 lg:gap-0">
        <div className="lg:pr-12">
          <SectionHeader number={situation.number} title={situation.title} subtitle={situation.subtitle} />
          <p className="mt-4 text-slate-600">{situation.description}</p>

          <div className="flex mt-3">
          <ul className="mt-4 space-y-3">
            {situation.points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm text-slate-600">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-500">
                  <X className="h-3.5 w-3.5" />
                </span>
                {point}
              </li>
            ))}
          </ul>
          <ConfusedPersonIllustration />
          </div>

        </div>

        <div className="lg:pl-12">
          <SectionHeader number={outcome.number} title={outcome.title} subtitle={outcome.subtitle} />

         <div className="flex mt-8">

          <ul className="mt-4 space-y-3">
            {outcome.points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm text-slate-600">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {point}
              </li>
            ))}
          </ul>
            <HappyPersonIllustration />
            </div>
       
        </div>
      </div>
    </section>
  );
}
