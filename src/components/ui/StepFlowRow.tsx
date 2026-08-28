"use client";

// === Shared numbered step-flow row: N steps in a horizontal row (scrolls
// on mobile), each with an icon badge, title, and description, connected by
// a dashed line. Used by "How it works"-style sections across solution and
// use-case detail pages — icons/labels are supplied by the caller.
//
// A step may carry an `accent` for a per-step colour (tinted icon circle +
// number badge). When any step is accented the connectors render in neutral
// slate so the row reads as multi-colour instead of mono-blue. `numberStyle`
// switches between a corner badge on the icon circle (default) and an inline
// "N." prefix on the title. ===

import type { LucideIcon } from "lucide-react";

export type StepAccent = "blue" | "emerald" | "purple" | "orange" | "amber" | "rose" | "cyan";

export type StepFlowStep = {
  title: string;
  description: string;
  icon: LucideIcon;
  accent?: StepAccent;
};

type StepFlowRowProps = {
  steps: StepFlowStep[];
  numberStyle?: "badge" | "inline";
};

const ACCENT_STYLES: Record<StepAccent, { circle: string; badge: string }> = {
  blue: { circle: "bg-blue-50 text-blue-600", badge: "bg-blue-600" },
  emerald: { circle: "bg-emerald-50 text-emerald-600", badge: "bg-emerald-600" },
  purple: { circle: "bg-purple-50 text-purple-600", badge: "bg-purple-600" },
  orange: { circle: "bg-orange-50 text-orange-600", badge: "bg-orange-600" },
  amber: { circle: "bg-amber-50 text-amber-600", badge: "bg-amber-600" },
  rose: { circle: "bg-rose-50 text-rose-600", badge: "bg-rose-600" },
  cyan: { circle: "bg-cyan-50 text-cyan-600", badge: "bg-cyan-600" },
};

export function StepFlowRow({ steps, numberStyle = "badge" }: StepFlowRowProps) {
  const isAccented = steps.some((step) => step.accent);
  const connectorClass = isAccented ? "border-slate-300" : "border-brand-blue";
  const chevronClass = isAccented ? "text-slate-300" : "text-brand-blue";

  return (
    <div>
      <div className="flex min-w-200 items-start gap-2 lg:min-w-0 lg:gap-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === steps.length - 1;
          const accent = step.accent ? ACCENT_STYLES[step.accent] : null;
          return (
            <div key={step.title} className="flex flex-1 items-start">
              <div className="flex w-32 flex-col items-center gap-3 text-center sm:w-40">
                <span
                  className={`relative flex h-14 w-14 items-center justify-center rounded-full ${
                    accent ? accent.circle : "bg-white text-brand-blue shadow-md"
                  }`}
                >
                  {numberStyle === "badge" && (
                    <span
                      className={`absolute -top-1.5 -left-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-slate-50 text-[10px] font-bold text-white ${
                        accent ? accent.badge : "bg-brand-blue"
                      }`}
                    >
                      {index + 1}
                    </span>
                  )}
                  <Icon className="h-6 w-6" />
                </span>
                <p className="text-sm font-bold text-brand-navy">
                  {numberStyle === "inline" ? `${index + 1}. ${step.title}` : step.title}
                </p>
                <p className="whitespace-pre-line text-xs text-slate-500">{step.description}</p>
              </div>

              {!isLast && (
                <div className="mt-7 flex flex-1 items-center">
                  <div className={`h-px flex-1 border-t border-dashed ${connectorClass}`} />
                  <span className={chevronClass}>&rsaquo;</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
