"use client";

// === Ready to get started? Section: closing dark-navy CTA banner, modeled
// on solutions/digital-signage-media's CtaBannerSection — title +
// description + white pill button to /contact + two check-marked
// reassurance lines underneath. No section number, matching the reference
// design's plain CTA banner treatment. ===

import { Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { ReadyToStartContent } from "../types";

type ReadyToStartCtaProps = {
  content: ReadyToStartContent;
};

export function ReadyToStartCta({ content }: ReadyToStartCtaProps) {
  return (
    <section className="px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-7xl rounded-3xl bg-brand-navy px-6 py-12 text-center sm:px-12">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">{content.title}</h2>
        <p className="mx-auto mt-3 max-w-xl text-slate-300">{content.description}</p>

        <Link
          href="/contact"
          className="mt-8 inline-flex items-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-brand-navy hover:bg-slate-100"
        >
          {content.cta}
        </Link>

        <div className="mt-6 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-8">
          {[content.point1, content.point2].map((point) => (
            <span key={point} className="flex items-center gap-2 text-xs text-slate-300">
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              {point}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
