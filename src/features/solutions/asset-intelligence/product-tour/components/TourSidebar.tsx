// === Tour Sidebar: title + progress dots + the 6-step list (click to jump
// to a completed or the current step) + the "want real data?" CTA box. ===

import type { LucideIcon } from "lucide-react";
import { AlertTriangle, Check, History, Info, QrCode, Users, Wrench } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { TOTAL_TOUR_STEPS, formatStepOfLabel, type TourSidebarContent } from "../types";

const STEP_ICONS: LucideIcon[] = [QrCode, Info, AlertTriangle, Users, Wrench, History];

type TourSidebarProps = {
  content: TourSidebarContent;
  currentStep: number;
  completedSteps: number[];
  onSelectStep: (step: number) => void;
};

export function TourSidebar({ content, currentStep, completedSteps, onSelectStep }: TourSidebarProps) {
  return (
    <div className="flex h-full flex-col p-5">
      <h2 className="text-lg font-bold text-brand-navy">{content.title}</h2>
      <p className="mt-1.5 text-xs text-slate-500">{content.subtitle}</p>

      <div className="mt-5">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
          <span>{content.progressLabel}</span>
          <span>{formatStepOfLabel(content.stepOfLabel, currentStep, TOTAL_TOUR_STEPS)}</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          {content.steps.map((_, index) => {
            const step = index + 1;
            const isActiveOrPast = step <= currentStep || completedSteps.includes(step);
            return (
              <span
                key={step}
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                  isActiveOrPast ? "bg-brand-blue text-white" : "bg-slate-100 text-slate-400"
                }`}
              >
                {step}
              </span>
            );
          })}
        </div>
      </div>

      <ul className="mt-5 space-y-1.5">
        {content.steps.map((stepItem, index) => {
          const step = index + 1;
          const isCurrent = step === currentStep;
          const isCompleted = completedSteps.includes(step);
          const isClickable = isCurrent || isCompleted;
          const Icon = STEP_ICONS[index];

          return (
            <li key={stepItem.title}>
              <button
                type="button"
                onClick={() => isClickable && onSelectStep(step)}
                disabled={!isClickable}
                aria-current={isCurrent ? "step" : undefined}
                className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition-colors ${
                  isCurrent
                    ? "bg-blue-50 ring-1 ring-brand-blue/30"
                    : isClickable
                      ? "hover:bg-slate-50"
                      : "cursor-not-allowed opacity-50"
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    isCurrent ? "bg-brand-blue text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-brand-navy">{stepItem.title}</span>
                  <span className="mt-0.5 block text-xs text-slate-500">{stepItem.description}</span>
                </span>
                <span className="shrink-0 pt-1.5">
                  {isCompleted ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : isCurrent ? (
                    <span aria-hidden="true" className="text-brand-blue">
                      &rarr;
                    </span>
                  ) : null}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 rounded-xl bg-slate-50 p-4">
        <p className="text-sm font-bold text-brand-navy">{content.realDataPrompt.title}</p>
        <p className="mt-1 text-xs text-slate-500">{content.realDataPrompt.description}</p>
        <Link
          href="/contact"
          className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-brand-navy px-4 py-2 text-xs font-semibold text-brand-navy hover:bg-white"
        >
          {content.realDataPrompt.ctaButton}
        </Link>
      </div>
    </div>
  );
}
