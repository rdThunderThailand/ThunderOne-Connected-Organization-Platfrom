// === Step 2 content: "View Asset Info" — placeholder, no real design
// supplied yet. Left: phone mockup showing a read-only asset detail view.
// Right: card explaining the step. ===

// TODO: replace with real design once available

import { PhoneFrame } from "../PhoneFrame";
import type { TourAssetContent, TourPlaceholderStepContent } from "../../types";

type Step2ViewAssetInfoProps = {
  content: TourPlaceholderStepContent;
  asset: TourAssetContent;
};

export function Step2ViewAssetInfo({ content, asset }: Step2ViewAssetInfoProps) {
  const rows = [asset.location, asset.category, asset.assetId, asset.age, asset.value];

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <div className="mx-auto lg:mx-0">
        <PhoneFrame>
          <p className="text-center text-[11px] font-semibold text-slate-500">{content.phoneTitle}</p>

          <div className="mt-3 rounded-xl border border-slate-100 p-3">
            <div className="flex items-center gap-2">
              {/* TODO: replace with real asset photo */}
              <div
                role="img"
                aria-label="Air conditioner unit photo placeholder"
                className="h-9 w-9 shrink-0 rounded-lg bg-gradient-to-br from-blue-200 to-slate-400"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-bold text-brand-navy">{asset.id}</p>
                <p className="truncate text-[10px] text-slate-400">{asset.name}</p>
              </div>
              <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-semibold text-emerald-600">
                {asset.statusActive}
              </span>
            </div>

            <dl className="mt-3 space-y-2 border-t border-slate-100 pt-3">
              {rows.map((row) => (
                <div key={row.label} className="flex items-center justify-between text-[10px]">
                  <dt className="text-slate-400">{row.label}</dt>
                  <dd className="font-semibold text-slate-700">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <p className="mt-3 text-center text-[10px] text-slate-400">{content.phoneDescription}</p>
        </PhoneFrame>
      </div>

      <div className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-brand-navy">{content.cardTitle}</h3>
        <p className="mt-2 text-sm text-slate-600">{content.cardDescription}</p>

        <dl className="mt-5 space-y-3 border-t border-slate-100 pt-4">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-4 text-sm">
              <dt className="text-slate-500">{row.label}</dt>
              <dd className="font-medium text-slate-700">{row.value}</dd>
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
