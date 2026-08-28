"use client";

// === CTA Banner Section: closing dark banner with headline, description,
// "talk to us" CTA, and LINE OA chat link ===

// TODO: point the LINE OA button at the real lin.ee/line.me URL once
// available — it's a "#" placeholder for now.

import { MessageCircle } from "lucide-react";
import { useTalkToUsStore } from "@/store/talkToUsStore";
import type { CtaContent } from "../types";

type CtaBannerSectionProps = {
  content: CtaContent;
};


export function CtaBannerSection({ content }: CtaBannerSectionProps) {
  const openTalkToUs = useTalkToUsStore((s) => s.open);

  return (
    <section className="py-12 sm:px-6 lg:py-16">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-brand-navy">

        <div className="relative flex flex-col gap-10 px-6 py-10 sm:px-10 sm:py-12 md:flex-row md:items-center md:gap-6 lg:px-14">
          <div className="text-center md:w-[40%] md:text-left">
            <h2 className="text-2xl font-bold leading-snug text-white sm:text-3xl">{content.title}</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-[#A9B4CE] sm:text-base">
              {content.description}
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 md:w-[30%]">
            <button
              type="button"
              onClick={openTalkToUs}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 text-sm font-bold text-white hover:bg-brand-blue sm:w-auto"
            >
              {content.ctaPrimary}
              <MessageCircle className="h-4 w-4" />
            </button>
            <p className="text-center text-xs text-[#A9B4CE]">{content.ctaCaption}</p>
          </div>

          <div className="flex flex-col items-center gap-3 md:w-[30%] md:border-l md:border-white/25 md:pl-6">
            <p className="text-sm text-white">{content.lineLabel}</p>
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full bg-[#06C755] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#05b34c]"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white">
                <MessageCircle className="h-3 w-3 text-[#06C755]" fill="currentColor" />
              </span>
              {content.lineHandle}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
