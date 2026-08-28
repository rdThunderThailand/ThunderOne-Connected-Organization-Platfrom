// === Step 4 content: "Assign Work" — placeholder, no real design supplied
// yet. Left: phone mockup showing the work order about to be assigned.
// Right: card with assignee/due-date fields. ===

// TODO: replace with real design once available

import { Users } from "lucide-react";
import { PhoneFrame } from "../PhoneFrame";
import type { TourPlaceholderStepContent } from "../../types";

type Step4AssignWorkProps = {
  content: TourPlaceholderStepContent;
};

export function Step4AssignWork({ content }: Step4AssignWorkProps) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <div className="mx-auto lg:mx-0">
        <PhoneFrame>
          <p className="text-center text-[11px] font-semibold text-slate-500">{content.phoneTitle}</p>
          <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 p-6 text-center">
            <Users className="h-10 w-10 text-brand-blue" />
            <p className="mt-3 text-[10px] text-slate-400">{content.phoneDescription}</p>
          </div>
        </PhoneFrame>
      </div>

      <div className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-brand-navy">{content.cardTitle}</h3>
        <p className="mt-2 text-sm text-slate-600">{content.cardDescription}</p>

        <dl className="mt-5 space-y-3 border-t border-slate-100 pt-4">
          {content.fields.map((field) => (
            <div key={field.label} className="flex items-center justify-between gap-4 text-sm">
              <dt className="text-slate-500">{field.label}</dt>
              <dd className="font-medium text-slate-700">{field.value}</dd>
            </div>
          ))}
        </dl>

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
