"use client";

// === How It Works Section: heading ตามด้วย StepFlowRow (shared) 5 ขั้นตอน
// เรียงแนวนอน เชื่อมด้วยเส้นประ ===

import type { LucideIcon } from "lucide-react";
import { BarChart3, Megaphone, PenLine, Send, Users } from "lucide-react";
import { StepFlowRow, type StepFlowStep } from "@/components/ui/StepFlowRow";
import type { HowItWorksContent } from "../types";

const STEP_ICONS: LucideIcon[] = [PenLine, Users, Send, Megaphone, BarChart3];

type HowItWorksSectionProps = {
  content: HowItWorksContent;
};

export function HowItWorksSection({ content }: HowItWorksSectionProps) {
  const steps: StepFlowStep[] = content.steps.map((step, index) => ({
    ...step,
    icon: STEP_ICONS[index % STEP_ICONS.length],
  }));

  return (
    <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-3xl font-bold text-brand-navy sm:text-4xl">{content.title}</h2>
        <div className="mt-12">
          <StepFlowRow steps={steps} />
        </div>
      </div>
    </section>
  );
}
