"use client";

// === Who's Involved Section: SectionHeader + 4-column grid (2-col tablet,
// 1-col mobile) of round icon-avatar cards — role + short description. ===

import { SectionHeader } from "./SectionHeader";
import { ICONS } from "../../iconRegistry";
import type { StakeholdersContent } from "../types";

type StakeholdersSectionProps = {
  content: StakeholdersContent;
};

export function StakeholdersSection({ content }: StakeholdersSectionProps) {
  return (
    <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <SectionHeader number={content.number} title={content.title} />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {content.items.map((item) => {
            const Icon = ICONS[item.icon];
            return (
              <div
                key={item.role}
                className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 text-center"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                  <Icon className="h-7 w-7" />
                </span>
                <p className="mt-4 text-sm font-bold text-brand-navy">{item.role}</p>
                <p className="mt-1 text-xs text-slate-500">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
