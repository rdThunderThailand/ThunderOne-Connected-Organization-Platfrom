"use client";

// === What ThunderOne Connects Section: SectionHeader + radial diagram (5
// satellite nodes with icon/label/description around a center "ThunderOne
// Communication" badge, dashed spokes) on desktop/tablet. Falls back to a
// simple stacked list on mobile — a 5-node radial diagram with full label +
// description text per node is too cramped to stay legible on small
// screens (per the task's own responsive guidance for this section). Not
// built on HeroOrbitDiagram: that component's center slot is hardcoded to
// the ThunderOne logo mark and its nodes only carry a label, not a
// description. ===

import { SectionHeader } from "./SectionHeader";
import { ICONS } from "../../iconRegistry";
import type { ConnectsContent } from "../types";

const RADIUS_PERCENT = 38;

function round(value: number) {
  return Math.round(value * 10000) / 10000;
}

type ConnectsDiagramSectionProps = {
  content: ConnectsContent;
};

export function ConnectsDiagramSection({ content }: ConnectsDiagramSectionProps) {
  const angleStep = 360 / content.items.length;

  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <SectionHeader number={content.number} title={content.title} className="justify-center" />

        <div className="mx-auto mt-12 hidden max-w-2xl lg:block">
          <div className="relative aspect-square w-full">
            <div className="absolute inset-[14%] rounded-full border border-dashed border-slate-200" />

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
                  className="absolute flex w-32 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 text-center"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-full text-white shadow-md ${item.badgeClassName}`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-xs font-bold text-brand-navy">{item.label}</span>
                  <span className="text-[11px] text-slate-500">{item.description}</span>
                </div>
              );
            })}

            <div className="absolute left-1/2 top-1/2 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-4 border-white bg-brand-navy px-3 text-center shadow-lg">
              <span className="text-xs font-bold leading-tight text-white">{content.centerLabel}</span>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-2 lg:hidden">
          {content.items.map((item) => {
            const Icon = ICONS[item.icon];
            return (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-xl border border-slate-200 p-3"
              >
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
    </section>
  );
}
