"use client";

// === What You Can Do Section: ฝั่งซ้ายหัวข้อ + คำอธิบาย + checklist 6 ข้อ,
// ฝั่งขวากลุ่มภาพ 3 ส่วน (การ์ดสร้างข้อความ, รูปคนใช้แล็ปท็อป + การ์ด
// ตัวอย่างข้อความลอยทับ, มือถือ mockup แชท LINE OA) ===

import { Check, Mail, MessageCircle, MonitorSmartphone, Send, Smartphone } from "lucide-react";
import type { WhatYouCanDoContent } from "../types";

const CHANNEL_ICONS = [Mail, MonitorSmartphone, MessageCircle, Send, Smartphone];

type WhatYouCanDoSectionProps = {
  content: WhatYouCanDoContent;
};

export function WhatYouCanDoSection({ content }: WhatYouCanDoSectionProps) {
  const { createMessageCard, previewCard, lineChat } = content;

  return (
    <section id="what-you-can-do" className="bg-white px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto flex justify-between max-w-7xl gap-12 lg:grid-cols-[minmax(0,380px)_1fr] lg:items-center">
       
       <div >
       <div >
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
       </div>
       
 
        <div>
        <div className="min-w-0 overflow-x-auto">
          <div className="flex min-w-180 items-start gap-4 lg:min-w-0">
            {/* TODO: replace with real asset */}
            <div className="w-56 shrink-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg">
              <p className="text-xs font-bold text-brand-navy">{createMessageCard.title}</p>
              <p className="mt-3 text-[10px] font-medium text-slate-400">
                {createMessageCard.titleFieldLabel}
              </p>
              <p className="mt-1 rounded-md bg-slate-50 px-2 py-1.5 text-xs text-slate-700">
                {createMessageCard.titleFieldValue}
              </p>

              <p className="mt-3 text-[10px] font-medium text-slate-400">{createMessageCard.channelLabel}</p>
              <div className="mt-1.5 flex gap-1.5">
                {CHANNEL_ICONS.map((Icon, index) => (
                  <span
                    key={index}
                    className={`flex h-6 w-6 items-center justify-center rounded-full ${
                      index === 0 ? "bg-brand-blue text-white" : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    <Icon className="h-3 w-3" />
                  </span>
                ))}
              </div>

              <p className="mt-3 text-[10px] font-medium text-slate-400">{createMessageCard.audienceLabel}</p>
              <p className="mt-1 rounded-md bg-slate-50 px-2 py-1.5 text-xs text-slate-700">
                {createMessageCard.audienceValue}
              </p>

              <p className="mt-2 text-[10px] text-slate-400">
                {createMessageCard.dateValue} &bull; {createMessageCard.timeValue}
              </p>

              <span className="mt-3 block rounded-md bg-brand-blue py-1.5 text-center text-[11px] font-semibold text-white">
                {createMessageCard.nextButton}
              </span>
            </div>

            {/* TODO: replace with real asset */}
            <div className="relative h-72 w-56 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-300 to-slate-500">
              <div
                role="img"
                aria-label="Person using a laptop placeholder"
                className="h-full w-full"
              />

              <div className="absolute bottom-4 left-1/2 w-48 -translate-x-1/2 rounded-xl bg-brand-navy p-4 text-white shadow-lg">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-200">
                  {previewCard.label}
                </p>
                <p className="mt-1 text-sm font-extrabold uppercase leading-tight">{previewCard.headline}</p>
                <p className="text-[11px] text-slate-300">{previewCard.subheadline}</p>
                <p className="mt-2 text-[10px] text-slate-400">{previewCard.meta}</p>
                <span className="mt-2 block rounded-md bg-brand-blue py-1.5 text-center text-[11px] font-semibold text-white">
                  {previewCard.viewDetails}
                </span>
              </div>
            </div>

            <div className="h-72 w-40 shrink-0 rounded-[2rem] border-4 border-slate-900 bg-slate-900 p-1.5 shadow-lg">
              <div className="flex h-full w-full flex-col rounded-[1.5rem] bg-slate-50 p-3">
                <p className="flex items-center gap-1 text-xs font-bold text-brand-navy">
                  <MessageCircle className="h-3.5 w-3.5 text-[#06C755]" />
                  {lineChat.productLabel}
                </p>
                <div className="mt-4 flex-1 rounded-xl bg-white p-2.5 shadow-sm">
                  <p className="text-[10px] font-bold text-brand-navy">{lineChat.title}</p>
                  <p className="mt-1 text-[9px] text-slate-500">{lineChat.meta}</p>
                  <span className="mt-2 block rounded-md bg-[#06C755] py-1.5 text-center text-[10px] font-semibold text-white">
                    {lineChat.ctaLabel}
                  </span>
                </div>
                <p className="mt-2 text-center text-[10px] font-semibold text-brand-blue">
                  {lineChat.dontMissIt}
                </p>
              </div>
            </div>
          </div>
        </div>


        </div>






      </div>
    </section>
  );
}
