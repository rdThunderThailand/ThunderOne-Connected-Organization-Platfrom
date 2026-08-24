// === Tour Bottom Bar: 💡 tip text + Back/Next (Next becomes "Finish" and
// closes the tour on the last step) navigation controls. ===

import { Lightbulb } from "lucide-react";
import { TOTAL_TOUR_STEPS, type TourBottomBarContent } from "../types";

type TourBottomBarProps = {
  content: TourBottomBarContent;
  currentStep: number;
  onBack: () => void;
  onNext: () => void;
};

export function TourBottomBar({ content, currentStep, onBack, onNext }: TourBottomBarProps) {
  const isLastStep = currentStep === TOTAL_TOUR_STEPS;

  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="flex items-start gap-2 text-xs text-slate-500 sm:max-w-md">
        <Lightbulb className="h-4 w-4 shrink-0" />
        <span>{content.tip}</span>
      </p>

      <div className="flex shrink-0 gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={currentStep === 1}
          className="rounded-full border border-brand-navy px-5 py-2 text-sm font-semibold text-brand-navy hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {content.backButton}
        </button>
        <button
          type="button"
          onClick={onNext}
          className="rounded-full bg-brand-blue px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          {isLastStep ? content.finishButton : content.nextButton}
        </button>
      </div>
    </div>
  );
}
