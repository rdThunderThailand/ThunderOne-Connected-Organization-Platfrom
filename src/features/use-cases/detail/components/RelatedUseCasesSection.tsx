"use client";

// === Related Use Cases Section: SectionHeader + vertical list of links
// (icon + title + trailing arrow, hover background) + "See all use cases"
// button back to the /use-cases list page. ===

import { Link } from "@/i18n/navigation";
import { SectionHeader } from "./SectionHeader";
import { ICONS } from "../../iconRegistry";
import type { RelatedContent } from "../types";

type RelatedUseCasesSectionProps = {
  content: RelatedContent;
};

export function RelatedUseCasesSection({ content }: RelatedUseCasesSectionProps) {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-3xl">
        <SectionHeader number={content.number} title={content.title} />

        <div className="mt-8 divide-y divide-slate-100 rounded-2xl border border-slate-200">
          {content.items.map((item) => {
            const Icon = ICONS[item.icon];
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1 text-sm font-semibold text-brand-navy">{item.title}</span>
                <span aria-hidden="true" className="text-slate-400">
                  &rarr;
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/use-cases"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-blue hover:underline"
          >
            {content.seeAllLabel}
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
