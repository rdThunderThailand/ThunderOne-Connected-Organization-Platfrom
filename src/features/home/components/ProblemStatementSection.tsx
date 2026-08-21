"use client";

// === Problem Statement Section: eyebrow + two-line headline on the left,
// a row of 7 "organizational context" icons on the right whose dashed
// spokes converge onto a shared dashed line carrying the "fragmented
// context" pill, with the ThunderOne tagline underneath ===

import type { LucideIcon } from "lucide-react";
import {
  Building2,
  BriefcaseMedical,
  FileText,
  Layers,
  MessageCircle,
  Sparkles,
  Target,
  UserPlus,
} from "lucide-react";
import type { ProblemContent } from "../types";

type ProblemStatementSectionProps = {
  content: ProblemContent;
};

const CONTEXT_ITEMS: { key: keyof ProblemContent["contextItems"]; icon: LucideIcon }[] = [
  { key: "people", icon: UserPlus },
  { key: "work", icon: BriefcaseMedical },
  { key: "data", icon: FileText },
  { key: "communication", icon: MessageCircle },
  { key: "system", icon: Layers },
  { key: "space", icon: Building2 },
  { key: "asset", icon: Target },
];

export function ProblemStatementSection({ content }: ProblemStatementSectionProps) {
  return (
    <section className="bg-slate-50 py-16 sm:px-2 lg:py-10">
      <div className="mx-auto max-w-7xl rounded-3xl border border-slate-100 bg-white px-3 py-6 shadow-lg sm:px-6 sm:py-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,500px)_1fr] lg:items-center">
          <div className="w-xl ">
            <span className="text-sm font-semibold tracking-wide text-brand-blue">
              {content.badge}
            </span>
            <h3 className="mt-8 text-3xl font-bold leading-snug text-brand-navy sm:text-3xl w-full">
              <span className="block">{content.titleLine1}</span>
              <span className=" min-w-0">{content.titleLine2}</span>
            </h3>
          </div>

          <div className="min-w-0">
            <div className="overflow-x-auto">
              <div className="min-w-120">
                <div className="flex justify-between gap-2 sm:gap-4">
                  {CONTEXT_ITEMS.map(({ key, icon: Icon }) => (
                    <div key={key} className="flex flex-col items-center gap-3">
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-brand-navy shadow-sm">
                        <Icon className="h-6 w-6" />
                      </span>
                      <span className="whitespace-nowrap text-xs font-medium text-slate-600">
                        {content.contextItems[key]}
                      </span>
                      <span className="h-8 w-px border-l border-dashed border-slate-300" />
                    </div>
                  ))}
                </div>

                <div className="relative border-t border-dashed border-slate-300 pb-5">
                  <span className="absolute left-1/2 top-0 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white shadow-md">
                    <Sparkles className="h-4 w-4 text-brand-blue" />
                    {content.connectorLabel}
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-3  wrap-break-word text-center text-lg font-bold text-brand-blue sm:text-xl">
              {content.tagline}
            </p>

          </div>
        </div>
      </div>
    </section>
  );
}
