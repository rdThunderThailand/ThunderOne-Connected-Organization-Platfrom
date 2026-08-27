"use client";

import { Lightbulb, MessageCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { HelpCtaContent } from "../types";

type HelpCtaProps = {
  content: HelpCtaContent;
};

export function HelpCta({ content }: HelpCtaProps) {
  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-blue-50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-blue-500 shadow-sm">
          <Lightbulb className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-base font-bold text-brand-navy">{content.title}</p>
          <p className="mt-1 text-sm text-slate-500">{content.description}</p>
        </div>
      </div>

      <Link
        href="/contact"
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-blue"
      > {content.button}
        <MessageCircle className="h-4 w-4" aria-hidden="true" />
       
      </Link>
    </div>
  );
}
