"use client";

// === Shared numbered step-flow row: N steps in a horizontal row (scrolls
// on mobile), each with a numbered icon badge, title, and description,
// connected by a dashed line. Used by "How it works"-style sections across
// solution detail pages — icons/labels are supplied by the caller. ===

import type { LucideIcon } from "lucide-react";

export type StepFlowStep = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type StepFlowRowProps = {
  steps: StepFlowStep[];
};

export function StepFlowRow({ steps }: StepFlowRowProps) {
  return (
    <div>
      <div className="flex min-w-200 items-start gap-2 lg:min-w-0 lg:gap-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === steps.length - 1;
          return (
            <div key={step.title} className="flex flex-1 items-start">
              <div className="flex w-32 flex-col items-center gap-3 text-center sm:w-40">
                <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-brand-blue text-white shadow-md">
                  <Icon className="h-6 w-6" />
                  <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-slate-50 bg-brand-navy text-[10px] font-bold text-white">
                    {index + 1}
                  </span>
                </span>
                <p className="text-sm font-bold text-brand-navy">{step.title}</p>
                <p className="text-xs text-slate-500">{step.description}</p>
              </div>

              {!isLast && (
                <span
                  aria-hidden="true"
                  className="mt-7 h-px flex-1 border-t border-dashed border-slate-300"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
