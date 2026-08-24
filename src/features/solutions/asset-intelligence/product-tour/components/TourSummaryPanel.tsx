// === Tour Summary Panel: right column — asset summary card + a checklist
// of what the tour covers. Content stays the same across all 6 steps. ===

import { Boxes, Check, Clock, MapPin, Tag, Wallet } from "lucide-react";
import type { TourAssetContent, TourSummaryPanelContent } from "../types";

type TourSummaryPanelProps = {
  content: TourSummaryPanelContent;
  asset: TourAssetContent;
};

export function TourSummaryPanel({ content, asset }: TourSummaryPanelProps) {
  const rows = [
    { icon: MapPin, ...asset.location },
    { icon: Boxes, ...asset.category },
    { icon: Tag, ...asset.assetId },
    { icon: Clock, ...asset.age },
    { icon: Wallet, ...asset.value },
  ];

  return (
    <div className="h-full overflow-y-auto p-5 bg-">
      <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">{content.title}</h2>

      <div className="mt-3 rounded-2xl border border-slate-200 p-4">
        <div className="flex items-center gap-3">
          {/* TODO: replace with real asset photo */}
          <div
            role="img"
            aria-label="Air conditioner unit photo placeholder"
            className="h-12 w-12 shrink-0 rounded-lg bg-gradient-to-br from-blue-200 to-slate-400"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-brand-navy">{asset.id}</p>
            <p className="truncate text-xs text-slate-500">{asset.name}</p>
          </div>
          <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold text-emerald-600">
            {asset.statusActive}
          </span>
        </div>

        <dl className="mt-4 space-y-2.5 border-t border-slate-100 pt-3">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center gap-2.5 text-xs">
              <row.icon className="h-4 w-4 shrink-0 text-slate-400" />
              <dt className="text-slate-400">{row.label}</dt>
              <dd className="ml-auto truncate font-medium text-slate-700">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <h3 className="mt-6 text-xs font-bold uppercase tracking-wide text-slate-500">
        {content.whatYouWillSeeTitle}
      </h3>
      <ul className="mt-3 space-y-2.5">
        {content.items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
