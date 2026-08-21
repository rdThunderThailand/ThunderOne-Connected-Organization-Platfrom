"use client";

// === What You Can Do Section: ฝั่งซ้ายหัวข้อ + คำอธิบาย + checklist 5 ข้อ,
// ฝั่งขวาภาพจอ digital signage ในห้าง (placeholder) พร้อม floating card
// "Publish to" และ "Schedule" ซ้อนทับ ===

import { Check } from "lucide-react";
import type { WhatYouCanDoContent } from "../types";

type WhatYouCanDoSectionProps = {
  content: WhatYouCanDoContent;
};

export function WhatYouCanDoSection({ content }: WhatYouCanDoSectionProps) {
  return (
    <section id="what-you-can-do" className="bg-white px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-blue">{content.label}</p>
          <h2 className="mt-3 text-3xl font-bold leading-snug text-brand-blue sm:text-4xl">
            {content.title}
          </h2>
          <p className="mt-4 text-slate-600">{content.description}</p>

          <ul className="mt-6 space-y-3">
            {content.checklist.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          {/* TODO: replace with real asset */}
          <div className="relative flex aspect-4/3 flex-col justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-brand-navy to-slate-700 p-6 shadow-lg">
            <div className="w-fit rounded-xl bg-brand-blue/90 px-5 py-4 text-white shadow-lg backdrop-blur">
              <p className="text-lg font-extrabold uppercase leading-tight">{content.screenHeadline}</p>
              <p className="text-sm font-semibold">{content.screenTagline}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-blue-100">
                {content.screenDate}
              </p>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-100">
                {content.screenLocation}
              </p>
              <span className="mt-3 inline-block rounded-full bg-white px-4 py-1.5 text-xs font-bold text-brand-navy">
                {content.screenCta}
              </span>
            </div>
          </div>

          <div className="absolute -left-4 top-4 w-48 rounded-xl border border-slate-100 bg-white p-3 shadow-lg sm:-left-8">
            <p className="text-xs font-bold text-brand-navy">{content.publishCard.title}</p>
            <ul className="mt-2 space-y-1.5">
              {content.publishCard.options.map((option, index) => (
                <li key={option.label} className="flex items-center gap-2 text-[11px] text-slate-600">
                  <span
                    className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-sm border ${
                      index === 0 ? "border-brand-blue bg-brand-blue" : "border-slate-300"
                    }`}
                  >
                    {index === 0 && <Check className="h-2.5 w-2.5 text-white" />}
                  </span>
                  <span className="truncate">{option.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="absolute -bottom-6 -right-4 w-48 rounded-xl border border-slate-100 bg-white p-3 shadow-lg sm:-right-8">
            <p className="text-xs font-bold text-brand-navy">{content.scheduleCard.title}</p>
            <p className="mt-2 rounded-md bg-slate-50 px-2 py-1.5 text-[11px] text-slate-600">
              {content.scheduleCard.dateValue} &bull; {content.scheduleCard.timeValue}
            </p>
            <p className="mt-1.5 flex items-center justify-between rounded-md bg-slate-50 px-2 py-1.5 text-[11px] text-slate-600">
              <span>{content.scheduleCard.repeatLabel}</span>
              <span className="font-semibold text-brand-navy">{content.scheduleCard.repeatValue}</span>
            </p>
            <span className="mt-2 block rounded-md bg-brand-blue py-1.5 text-center text-[11px] font-semibold text-white">
              {content.scheduleCard.saveButton}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
