"use client";

// === Solutions Grid Section: badge + heading + intro paragraph + "see all"
// link on the left, 4 solution cards (icon, tagline, description, small
// illustrative mockup, "explore" link) in a row on the right ===

// TODO: swap the illustrative per-card mockups below for real product
// screenshots once design assets are available (same placeholder
// convention as ProductShowcaseSection's mock dashboard).

import type { LucideIcon } from "lucide-react";
import { ArrowRight, Boxes, Headset, Megaphone, Monitor } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { SolutionsContent } from "../types";

type MockupVariant = "signage" | "communication" | "care" | "asset";

type SolutionsGridSectionProps = {
  content: SolutionsContent;
};

const ITEM_STYLES: { icon: LucideIcon; iconClassName: string; mockup: MockupVariant }[] = [
  { icon: Monitor, iconClassName: "bg-brand-blue text-white", mockup: "signage" },
  { icon: Megaphone, iconClassName: "bg-blue-600 text-white", mockup: "communication" },
  { icon: Headset, iconClassName: "bg-purple-600 text-white", mockup: "care" },
  { icon: Boxes, iconClassName: "bg-teal-600 text-white", mockup: "asset" },
];

function SolutionMockup({ variant }: { variant: MockupVariant }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center gap-1 border-b border-slate-100 bg-slate-50 px-3 py-2">
        <span className="h-1.5 w-1.5 rounded-full bg-red-300" />
        <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
      </div>

      {variant === "signage" && (
        <div className="grid grid-cols-2 gap-1.5 p-3">
          <span className="col-span-2 h-10 rounded-md bg-gradient-to-br from-brand-blue to-blue-400" />
          <span className="h-6 rounded-md bg-slate-100" />
          <span className="h-6 rounded-md bg-slate-100" />
        </div>
      )}

      {variant === "communication" && (
        <div className="flex flex-col gap-2 p-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="h-5 w-5 shrink-0 rounded-full bg-blue-100" />
              <span className="h-2 flex-1 rounded-full bg-slate-100" />
            </div>
          ))}
        </div>
      )}

      {variant === "care" && (
        <div className="flex flex-col gap-2 p-3">
          {["bg-red-400", "bg-slate-300", "bg-brand-blue"].map((dot, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} />
              <span className="h-2 flex-1 rounded-full bg-slate-100" />
            </div>
          ))}
        </div>
      )}

      {variant === "asset" && (
        <div className="flex items-center gap-3 p-3">
          <div className="flex-1 space-y-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="block h-2 rounded-full bg-slate-100"
                style={{ width: `${70 - i * 15}%` }}
              />
            ))}
          </div>
          <span
            className="h-10 w-10 shrink-0 rounded-full"
            style={{
              background:
                "conic-gradient(#2563eb 0% 30%, #0d9488 30% 55%, #f59e0b 55% 75%, #9333ea 75% 100%)",
            }}
          />
        </div>
      )}
    </div>
  );
}

export function SolutionsGridSection({ content }: SolutionsGridSectionProps) {
  return (
    <section className="bg-slate-50 py-16 sm:px-4 lg:py-20">
      <div className="mx-auto max-w-7xl rounded-3xl border border-slate-100 bg-white px-4 py-12 shadow-lg sm:px-6 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,300px)_1fr] lg:items-start">
          <div className="min-w-0">
            <span className="text-sm font-semibold uppercase tracking-wide text-brand-blue">
              {content.badge}
            </span>
            <h2 className="mt-4 text-3xl font-bold leading-snug text-brand-navy sm:text-4xl">
              {content.title}
            </h2>
            <p className="mt-4 wrap-break-word text-slate-600">{content.description}</p>
            <Link
              href="/solutions"
              className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand-blue hover:underline"
            >
              {content.cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="min-w-0 overflow-x-auto">
            <div className="grid min-w-180 grid-cols-4 gap-5 lg:min-w-0">
              {content.items.map((item, index) => {
                const style = ITEM_STYLES[index % ITEM_STYLES.length];
                const Icon = style.icon;
                return (
                  <Link
                    key={item.title}
                    href={item.link}
                    className="group flex h-full flex-col rounded-2xl border border-slate-200 p-5 transition-colors hover:border-brand-blue"
                  >
                    <span
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${style.iconClassName}`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 text-xs font-bold tracking-wide text-brand-navy">
                      {item.title}
                    </h3>
                    <p className="mt-2 wrap-break-word text-sm font-semibold text-brand-navy">
                      {item.tagline}
                    </p>
                    <p className="mt-2 wrap-break-word text-sm text-slate-500">{item.description}</p>

                    <div className="mt-4">
                      <SolutionMockup variant={style.mockup} />
                    </div>

                    <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-brand-blue">
                      {item.cta}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
