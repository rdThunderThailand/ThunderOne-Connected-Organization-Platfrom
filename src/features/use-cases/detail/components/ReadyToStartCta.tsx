"use client";

// === Ready to get started? CTA: an equal-height cell in the closing 4-card
// row — SectionHeader ("10") + description + a full-width blue pill button to
// /contact + two check-marked reassurance lines, all top-aligned to match the
// sibling cards. ===

import { Check, MessageCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionHeader } from "./SectionHeader";
import type { ReadyToStartContent } from "../types";

type ReadyToStartCtaProps = {
  content: ReadyToStartContent;
};

export function ReadyToStartCta({ content }: ReadyToStartCtaProps) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6">
      <SectionHeader number={content.number} title={content.title} />

      <p className="mt-6 whitespace-pre-line text-xs leading-relaxed text-slate-600">{content.description}</p>

      <Link
        href="/contact"
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-brand-blue"
      >
        {content.cta}
        <MessageCircle className="h-4 w-4" />
      </Link>

      <div className="mt-5 space-y-2">
        {[content.point1, content.point2].map((point) => (
          <span key={point} className="flex items-center gap-2 text-[11px] text-slate-600">
            <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
            {point}
          </span>
        ))}
      </div>
    </div>
  );
}
