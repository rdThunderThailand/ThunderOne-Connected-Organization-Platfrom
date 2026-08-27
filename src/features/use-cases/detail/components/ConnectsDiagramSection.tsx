"use client";

// === What ThunderOne Connects: a card in the 3-column detail row.
// SectionHeader + a compact radial diagram (center "ThunderOne Communication"
// badge with N satellite nodes on dashed spokes) on >= sm; a stacked
// icon/label/description list below sm, where the radial is too cramped to
// stay legible. Icon colours come from each item's badgeClassName. ===

import { SectionHeader } from "./SectionHeader";
import { ICONS } from "../../iconRegistry";
import type { ConnectsContent } from "../types";

const RADIUS_PERCENT = 33;

function round(value: number) {
  return Math.round(value * 10000) / 10000;
}

type ConnectsDiagramSectionProps = {
  content: ConnectsContent;
};

export function ConnectsDiagramSection({ content }: ConnectsDiagramSectionProps) {
  const angleStep = 360 / content.items.length;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <SectionHeader number={content.number} title={content.title} size="compact" />

      <div className="mx-auto mt-8 hidden w-full max-w-[280px] sm:block">
        <div className="relative aspect-square w-full">
          <div className="absolute inset-[20%] rounded-full border border-dashed border-slate-200" />

          {content.items.map((item, i) => {
            const angle = angleStep * i - 90;
            return (
              <div
                key={`spoke-${item.label}`}
                className="absolute left-1/2 top-1/2 h-px origin-left border-t border-dashed border-slate-300"
                style={{ width: `${RADIUS_PERCENT}%`, transform: `rotate(${round(angle)}deg)` }}
              />
            );
          })}

          {content.items.map((item, i) => {
            const angle = angleStep * i - 90;
            const rad = (angle * Math.PI) / 180;
            const x = round(50 + RADIUS_PERCENT * Math.cos(rad));
            const y = round(50 + RADIUS_PERCENT * Math.sin(rad));
            const Icon = ICONS[item.icon];

            return (
              <div
                key={item.label}
                className="absolute flex w-20 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 text-center"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-white shadow-md ${item.badgeClassName}`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-[10px] font-bold leading-tight text-brand-navy">{item.label}</span>
                <span className="text-[9px] leading-tight text-slate-500">{item.description}</span>
              </div>
            );
          })}

          <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-4 border-white bg-brand-navy px-2 text-center shadow-lg">
            <span className="text-[9px] font-bold leading-tight text-white">{content.centerLabel}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:hidden">
        {content.items.map((item) => {
          const Icon = ICONS[item.icon];
          return (
            <div key={item.label} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white ${item.badgeClassName}`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-brand-navy">{item.label}</p>
                <p className="text-xs text-slate-500">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
