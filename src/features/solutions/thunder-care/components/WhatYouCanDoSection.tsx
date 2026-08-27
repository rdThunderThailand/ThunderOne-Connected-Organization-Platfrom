"use client";

// === What You Can Do Section: ฝั่งซ้ายหัวข้อ + คำอธิบาย + checklist 6 ข้อ,
// ฝั่งขวากลุ่มภาพ 3 ส่วน (การ์ดแจ้งปัญหาใหม่, รูปเจ้าหน้าที่ support,
// การ์ดติดตามสถานะคำขอพร้อม SLA gauge) ===

import { Check, ChevronDown } from "lucide-react";
import type { WhatYouCanDoContent } from "../types";

type WhatYouCanDoSectionProps = {
  content: WhatYouCanDoContent;
};

function SlaGauge({ percent }: { percent: number }) {
  return (
    <span
      className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full"
      style={{ background: `conic-gradient(#2f5fe0 ${percent}%, #e2e8f0 0)` }}
      role="img"
      aria-label={`SLA achieved ${percent}%`}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xs font-bold text-brand-navy">
        {percent}%
      </span>
    </span>
  );
}

export function WhatYouCanDoSection({ content }: WhatYouCanDoSectionProps) {
  const { createTicketCard, trackingCard } = content;

  return (
    <section id="what-you-can-do" className="px-4 py-10 sm:px-6 lg:py-20">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,510px)_1fr] lg:items-center lg:gap-20">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-blue">{content.label}</p>
          <h2 className="mt-3 whitespace-pre-line text-3xl font-bold leading-snug text-brand-blue sm:text-4xl">
            {content.title}
          </h2>
          <p className="mt-4 whitespace-pre-line text-slate-600">{content.description}</p>

          <ul className="mt-6 space-y-3">
            {content.checklist.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0 overflow-x-auto">
          <div className="flex min-w-120 items-start justify-center gap-4 lg:min-w-0">
            {/* TODO: replace with real asset */}
            <div className="w-56 shrink-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg">
              <p className="text-xs font-bold text-brand-navy">{createTicketCard.title}</p>

              <p className="mt-3 text-[10px] font-medium text-slate-400">{createTicketCard.requestTypeLabel}</p>
              <p className="mt-1 flex items-center justify-between rounded-md bg-slate-50 px-2 py-1.5 text-xs text-slate-700">
                {createTicketCard.requestTypeValue}
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </p>

              <p className="mt-3 text-[10px] font-medium text-slate-400">{createTicketCard.categoryLabel}</p>
              <p className="mt-1 flex items-center justify-between rounded-md bg-slate-50 px-2 py-1.5 text-xs text-slate-700">
                {createTicketCard.categoryValue}
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </p>

              <p className="mt-3 rounded-md border border-slate-100 px-2 py-1.5 text-[11px] leading-snug text-slate-500">
                {createTicketCard.detailsValue}
              </p>

              <span className="mt-3 block rounded-md bg-brand-blue py-1.5 text-center text-[11px] font-semibold text-white">
                {createTicketCard.submitButton}
              </span>
            </div>

            {/* TODO: replace with real asset — photo of a support agent wearing a headset */}
            <div
              role="img"
              aria-label="Support agent wearing a headset placeholder"
              className="h-72 w-56 shrink-0 rounded-2xl bg-gradient-to-br from-blue-200 to-slate-400"
            />

            <div className="w-64 shrink-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg">
              <p className="text-xs font-bold text-brand-navy">{trackingCard.title}</p>

              <div className="mt-4 flex items-start">
                {trackingCard.steps.map((step, index) => {
                  const isLast = index === trackingCard.steps.length - 1;
                  return (
                    <div key={step.label} className="flex flex-1 items-start">
                      <div className="flex flex-col items-center gap-1 text-center">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand-blue text-white">
                          <Check className="h-2.5 w-2.5" />
                        </span>
                        <span className="text-[9px] font-semibold text-brand-navy">{step.label}</span>
                        <span className="text-[8px] text-slate-400">{step.time}</span>
                      </div>
                      {!isLast && (
                        <span aria-hidden="true" className="mt-2 h-px flex-1 border-t border-blue-300" />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
                <div>
                  <p className="text-[10px] font-medium text-slate-400">{trackingCard.assignedToLabel}</p>
                  <p className="text-xs font-medium text-slate-700">{trackingCard.assignedToValue}</p>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-slate-400">{trackingCard.dueDateLabel}</p>
                  <p className="text-xs font-medium text-slate-700">{trackingCard.dueDateValue}</p>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-slate-50 p-3">
                <p className="text-[10px] font-semibold text-slate-500">{trackingCard.slaPerformanceTitle}</p>
                <div className="mt-2 flex items-center gap-3">
                  <SlaGauge percent={trackingCard.slaPercent} />
                  <p className="text-[10px] text-slate-600">{trackingCard.slaAchievedLabel}</p>
                </div>
                <a
                  href="#"
                  className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-brand-blue hover:underline"
                >
                  {trackingCard.viewSlaReport}
                  <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
