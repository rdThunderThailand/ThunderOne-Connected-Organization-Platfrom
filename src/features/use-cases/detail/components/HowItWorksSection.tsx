"use client";

// === How it Works Section: SectionHeader + StepFlowRow (shared) — N
// numbered steps in a horizontal row connected by a dashed line, scrolls
// on mobile. ===

import { StepFlowRow, type StepFlowStep } from "@/components/ui/StepFlowRow";
import { SectionHeader } from "./SectionHeader";
import { ICONS } from "../../iconRegistry";
import type { HowItWorksContent } from "../types";

type HowItWorksSectionProps = {
  content: HowItWorksContent;
};

export function HowItWorksSection({ content }: HowItWorksSectionProps) {
  const steps: StepFlowStep[] = content.steps.map((step) => ({
    title: step.title,
    description: step.description,
    icon: ICONS[step.icon],
  }));

  return (
    <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <SectionHeader number={content.number} title={content.title} />
        <div className="mt-10 overflow-x-auto pb-2">
          <StepFlowRow steps={steps} />
        </div>
      </div>
    </section>
  );
}
