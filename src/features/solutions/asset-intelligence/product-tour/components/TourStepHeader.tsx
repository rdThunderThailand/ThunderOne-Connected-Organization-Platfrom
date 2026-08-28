// === Tour Step Header: scenario badge + italic scenario quote + "Step X of
// 6" + the current step's title/description. Sits above the step content in
// the center column. ===

import { TOTAL_TOUR_STEPS, formatStepOfLabel, type TourStepHeaderContent } from "../types";

type TourStepHeaderProps = {
  content: TourStepHeaderContent;
  currentStep: number;
};

export function TourStepHeader({ content, currentStep }: TourStepHeaderProps) {
  const index = currentStep - 1;

  return (
    <div className="border-b border-slate-100 pb-5">
      <span className="inline-flex items-center rounded-full bg-teal-600/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-teal-600">
        {content.scenarioBadge}
      </span>
      <p className="mt-3 text-sm italic text-slate-500">&ldquo;{content.scenarioQuote}&rdquo;</p>

      <p className="mt-4 text-xs font-semibold text-slate-400">
        {formatStepOfLabel(content.stepOfLabel, currentStep, TOTAL_TOUR_STEPS)}
      </p>
      <h2 className="mt-1 text-2xl font-bold text-brand-navy">{content.titles[index]}</h2>
      <p className="mt-2 max-w-2xl text-sm text-slate-600">{content.descriptions[index]}</p>
    </div>
  );
}
