// === DemoStepper: dark bottom bar — the 6 steps laid out left to right
// (click any to jump), completed ones marked with a green check, the current
// one raised as a white card, plus Back / Next (Next → "Finish" on step 6). ===

import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { TOTAL_DEMO_STEPS, type DemoStepperContent } from "../types";

type DemoStepperProps = {
  content: DemoStepperContent;
  currentStep: number;
  completedSteps: number[];
  onSelectStep: (step: number) => void;
  onBack: () => void;
  onNext: () => void;
};

export function DemoStepper({
  content,
  currentStep,
  completedSteps,
  onSelectStep,
  onBack,
  onNext,
}: DemoStepperProps) {
  const isLastStep = currentStep === TOTAL_DEMO_STEPS;

  return (
    <div className="shrink-0 border-t border-white/10 bg-brand-navy px-3 py-3 sm:px-5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={currentStep === 1}
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/20 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">{content.back}</span>
        </button>

        <ol className="flex min-w-0 flex-1 items-stretch gap-1 overflow-x-auto">
          {content.items.map((item, index) => {
            const step = index + 1;
            const isCurrent = step === currentStep;
            const isCompleted = completedSteps.includes(step) && !isCurrent;

            return (
              <li key={item.name} className="flex min-w-0 flex-1 items-center">
                <button
                  type="button"
                  onClick={() => onSelectStep(step)}
                  aria-current={isCurrent ? "step" : undefined}
                  className={`flex min-w-0 flex-1 items-center gap-2 rounded-xl px-2.5 py-2 text-left transition-colors ${
                    isCurrent ? "bg-white shadow-lg" : "hover:bg-white/5"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                      isCurrent
                        ? "bg-brand-blue text-white"
                        : isCompleted
                          ? "bg-emerald-500 text-white"
                          : "bg-white/10 text-slate-300"
                    }`}
                  >
                    {isCompleted ? <Check className="h-3.5 w-3.5" /> : String(step).padStart(2, "0")}
                  </span>
                  <span className="hidden min-w-0 leading-tight lg:block">
                    <span
                      className={`block truncate text-xs font-bold ${
                        isCurrent ? "text-brand-navy" : "text-slate-200"
                      }`}
                    >
                      {item.name}
                    </span>
                    <span
                      className={`block truncate text-[10px] ${
                        isCurrent ? "text-slate-500" : "text-slate-400"
                      }`}
                    >
                      {item.tagline}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <button
          type="button"
          onClick={onNext}
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-brand-blue px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 sm:px-5 sm:text-sm"
        >
          <span>{isLastStep ? content.finish : content.next}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
