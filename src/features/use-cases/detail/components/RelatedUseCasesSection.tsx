"use client";

// === Related Use Cases Section: an equal-height cell in the closing 4-card
// row — SectionHeader + a compact list of links (small icon + title + arrow,
// hover background) with a "See all use cases" outline pill pinned to the
// card bottom. ===

import { Link } from "@/i18n/navigation";
import { SectionHeader } from "./SectionHeader";
import { ICONS } from "../../iconRegistry";
import type { RelatedContent } from "../types";

type RelatedUseCasesSectionProps = {
  content: RelatedContent;
};

export function RelatedUseCasesSection({ content }: RelatedUseCasesSectionProps) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6">
      <SectionHeader number={content.number} title={content.title} />

      <ul className="mt-6 space-y-1">
        {content.items.map((item) => {
          const Icon = ICONS[item.icon];
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className="-mx-2 flex items-center gap-2.5 rounded-lg px-2 py-2 transition hover:bg-slate-50"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <span className="min-w-0 flex-1 text-xs font-semibold text-brand-blue">{item.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto pt-5 text-center">
        <Link
          href="/use-cases"
          className="inline-flex items-center gap-1.5 rounded-xl border border-brand-blue px-4 py-2 text-xs font-semibold text-brand-blue transition hover:bg-slate-50"
        >
          {content.seeAllLabel}
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
