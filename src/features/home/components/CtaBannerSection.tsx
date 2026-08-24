"use client";

// === CTA Banner Section: closing dark banner with headline, description,
// "talk to us" CTA, and LINE OA chat link ===

// TODO: point the LINE OA button at the real lin.ee/line.me URL once
// available — it's a "#" placeholder for now.

import { MessageCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { CtaContent } from "../types";

type CtaBannerSectionProps = {
  content: CtaContent;
};

export function CtaBannerSection({ content }: CtaBannerSectionProps) {
  return (
    <section className="bg-brand-navy">
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">{content.title}</h2>
        <p className="mt-4 text-lg text-slate-300">{content.description}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/contact"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-navy hover:bg-slate-100"
          >
            {content.ctaPrimary}
          </Link>
          <a
            href="#"
            className="flex items-center gap-2 rounded-full bg-[#06C755] px-6 py-3 text-sm font-semibold text-white hover:bg-[#05b34c]"
          >
            <MessageCircle className="h-4 w-4" />
            {content.ctaLine}
          </a>
        </div>
      </div>
    </section>
  );
}
