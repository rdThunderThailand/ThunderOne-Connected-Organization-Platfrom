"use client";

// === How It Works Section: heading ตามด้วย StepFlowRow (shared) 6 ขั้นตอน
// ของ ticket lifecycle เรียงแนวนอน เชื่อมด้วยเส้นประ (สี badge กำหนดโดย
// StepFlowRow เอง ไม่รับ prop จากหน้านี้อีกต่อไป) ===

import type { LucideIcon } from "lucide-react";
import { CheckCircle2, Gauge, Send, Share2, TrendingUp, Users } from "lucide-react";
import { StepFlowRow, type StepFlowStep } from "@/components/ui/StepFlowRow";
import type { HowItWorksContent } from "../types";

const STEP_ICONS: LucideIcon[] = [Send, Share2, Users, CheckCircle2, Gauge, TrendingUp];

type HowItWorksSectionProps = {
  content: HowItWorksContent;
};

export function HowItWorksSection({ content }: HowItWorksSectionProps) {
  const steps: StepFlowStep[] = content.steps.map((step, index) => ({
    ...step,
    icon: STEP_ICONS[index % STEP_ICONS.length],
  }));

  return (
    <section className="px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-3xl font-bold text-brand-navy sm:text-4xl">{content.title}</h2>
        <div className="mt-12">
          <StepFlowRow steps={steps} />
        </div>
      </div>
    </section>
  );
}
