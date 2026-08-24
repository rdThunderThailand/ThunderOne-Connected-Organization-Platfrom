// === Step 6 content: "History and Reports" — placeholder, no real design
// supplied yet. Left: phone mockup showing a maintenance history list.
// Right: card with the same history rows plus a report action. ===

// TODO: replace with real design once available

import { History } from "lucide-react";
import { PhoneFrame } from "../PhoneFrame";
import type { TourPlaceholderStepContent } from "../../types";

type Step6HistoryAndReportsProps = {
  content: TourPlaceholderStepContent;
};

export function Step6HistoryAndReports({ content }: Step6HistoryAndReportsProps) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <div className="mx-auto lg:mx-0">
        <PhoneFrame>
          <p className="text-center text-[11px] font-semibold text-slate-500">{content.phoneTitle}</p>
          <ul className="mt-3 space-y-2">
            {content.fields.map((field) => (
              <li key={field.label} className="rounded-lg bg-slate-50 px-2.5 py-2 text-[10px]">
                <p className="font-semibold text-slate-500">{field.label}</p>
                <p className="mt-0.5 truncate text-slate-700">{field.value}</p>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-center text-[10px] text-slate-400">{content.phoneDescription}</p>
        </PhoneFrame>
      </div>

      <div className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-brand-blue" />
          <h3 className="text-base font-bold text-brand-navy">{content.cardTitle}</h3>
        </div>
        <p className="mt-2 text-sm text-slate-600">{content.cardDescription}</p>

        <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4">
          {content.fields.map((field) => (
            <li key={field.label} className="flex items-center justify-between gap-4 text-sm">
              <span className="shrink-0 text-slate-400">{field.label}</span>
              <span className="truncate text-right font-medium text-slate-700">{field.value}</span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          disabled
          className="mt-6 w-full rounded-full bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white opacity-60"
        >
          {content.actionButton}
        </button>
      </div>
    </div>
  );
}
