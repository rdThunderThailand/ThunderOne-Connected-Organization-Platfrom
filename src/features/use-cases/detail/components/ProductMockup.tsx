"use client";

// === Product mockup panel: title + status badge, optional author/timestamp,
// optional body preview, optional channel icon row, and a 2-column stat grid.
// Used by InContextSection inside the narrow 3-column detail row (the hero
// has its own richer HeroMockup). Content/icons are supplied by the caller.
// An optional floating LINE notification bubble is still supported. ===

import { MessageCircle } from "lucide-react";
import { ICONS } from "../../iconRegistry";
import type { StatContent } from "../types";

const STATUS_BADGE_CLASSES: Record<"blue" | "green", string> = {
  blue: "bg-blue-100 text-blue-700",
  green: "bg-emerald-100 text-emerald-700",
};

export type ProductMockupProps = {
  panelTitle: string;
  statusLabel: string;
  statusColor: "blue" | "green";
  author?: string;
  timestamp: string;
  bodyPreview?: string;
  channelIcons?: string[];
  stats: StatContent[];
  lineNotification?: {
    appName: string;
    title: string;
    timestamp: string;
    cta: string;
  };
};

export function ProductMockup({
  panelTitle,
  statusLabel,
  statusColor,
  author,
  timestamp,
  bodyPreview,
  channelIcons,
  stats,
  lineNotification,
}: ProductMockupProps) {
  return (
    <div className="relative">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-bold text-brand-navy">{panelTitle}</p>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_BADGE_CLASSES[statusColor]}`}
          >
            {statusLabel}
          </span>
        </div>

        {(author || timestamp) && (
          <p className="mt-1 text-xs text-slate-400">
            {author}
            {author && timestamp ? " · " : ""}
            {timestamp}
          </p>
        )}

        {bodyPreview && <p className="text-xs leading-relaxed text-slate-600">{bodyPreview}</p>}

        {channelIcons && channelIcons.length > 0 && (
          <div className="mt-4 flex gap-3">
            {channelIcons.map((iconKey) => {
              const Icon = ICONS[iconKey];
              return (
                <span
                  key={iconKey}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500"
                >
                  <Icon className="h-4 w-4" />
                </span>
              );
            })}
          </div>
        )}

        <div className="mt-3 flex gap-5">
          {stats.map((stat, index) => (
            <div key={index} className="rounded-xl bg-slate-50 px-3 py-2">
              <p className="text-base font-bold text-[8px]  text-brand-navy">{stat.value}</p>
              <p className="text-[8px] font-medium text-slate-500">{stat.label}</p>
              {stat.percent && <p className="text-[6px] font-semibold text-emerald-500">{stat.percent}</p>}
            </div>
          ))}
        </div>
      </div>

      {lineNotification && (
        <div className="absolute top-full -right-2 -mt-6 w-52 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl sm:-right-6">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#06C755] text-white">
              <MessageCircle className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-brand-navy">{lineNotification.appName}</p>
              <p className="text-[10px] text-slate-400">{lineNotification.timestamp}</p>
            </div>
          </div>
          <p className="mt-2 text-xs font-semibold text-slate-700">{lineNotification.title}</p>
          <p className="mt-2 rounded-full bg-[#06C755]/10 px-2.5 py-1 text-center text-[11px] font-semibold text-[#06C755]">
            {lineNotification.cta}
          </p>
        </div>
      )}
    </div>
  );
}
