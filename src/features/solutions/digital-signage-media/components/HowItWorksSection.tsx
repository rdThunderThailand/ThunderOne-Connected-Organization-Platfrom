"use client";

// === How It Works Section: heading ตามด้วย 5 ขั้นตอนเรียงแนวนอน
// (มือถือ stack แนวตั้ง) เชื่อมด้วยเส้นประ แต่ละอันมีวงกลมเลข+icon,
// ชื่อขั้นตอน, คำอธิบายสั้น ===

import type { LucideIcon } from "lucide-react";
import { BarChart3, ClipboardList, Monitor, Send, UploadCloud } from "lucide-react";
import type { HowItWorksContent } from "../types";

const STEP_ICONS: LucideIcon[] = [UploadCloud, ClipboardList, Send, Monitor, BarChart3];

type HowItWorksSectionProps = {
  content: HowItWorksContent;
};

export function HowItWorksSection({ content }: HowItWorksSectionProps) {
  return (
    <section className="px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-3xl font-bold text-brand-navy sm:text-4xl">{content.title}</h2>

        <div className="mt-12">
          <div className="flex min-w-200 items-start gap-2 lg:min-w-0 lg:gap-4">
            {content.steps.map((step, index) => {
              const Icon = STEP_ICONS[index % STEP_ICONS.length];
              const isLast = index === content.steps.length - 1;
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
      </div>
    </section>
  );
}
