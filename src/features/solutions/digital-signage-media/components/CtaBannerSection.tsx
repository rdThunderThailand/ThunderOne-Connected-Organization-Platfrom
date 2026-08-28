"use client";

// === CTA Banner Section: แบนเนอร์ปิดท้าย — การ์ดพื้นเข้ม (navy) มุมโค้งใหญ่
// วางกลางคอนเทนต์ แบ่งเป็น 3 โซนแนวนอน: ซ้าย headline + subtext,
// กลาง ปุ่ม "พูดคุยกับเรา" (น้ำเงิน) + หมายเหตุ, ขวา (คั่นด้วยเส้นแบ่ง)
// ข้อความ LINE OA + ปุ่มเขียว @thunderone ===

// TODO: point the LINE OA button at the real lin.ee/line.me URL once
// available — it's a "#" placeholder for now.

import { MessageCircle } from "lucide-react";
import { useTalkToUsStore } from "@/store/talkToUsStore";
import type { CtaContent } from "../types";

type CtaBannerSectionProps = {
  content: CtaContent;
};

export function CtaBannerSection({ content }: CtaBannerSectionProps) {
  const openTalkToUs = useTalkToUsStore((s) => s.openWithTopic);

  return (
    <section className="px-4 py-12 sm:px-6 lg:py-16">
      <div className="mx-auto max-w-7xl rounded-3xl bg-brand-navy px-6 py-10 sm:px-10 lg:px-14">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-10">
          <div className="lg:flex-1">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">{content.title}</h2>
            <p className="mt-3 max-w-md whitespace-pre-line text-sm text-slate-400">
              {content.description}
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 lg:items-center">
            <button
              type="button"
              onClick={() => openTalkToUs("digital-signage")}
              className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-blue"
            >
              {content.ctaPrimary}
              <MessageCircle className="h-4 w-4" />
            </button>
            <span className="text-xs text-slate-400">{content.ctaNote}</span>
          </div>

          <div className="hidden w-px self-stretch bg-white/15 lg:block" />

          <div className="flex flex-col items-start gap-2 lg:items-end">
            <p className="text-xs text-slate-400">{content.lineLabel}</p>
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full bg-[#06C755] px-6 py-3 text-sm font-semibold text-white hover:bg-[#05b34c]"
            >
              <span
                className="h-4 w-4 shrink-0 rounded-full border-2 border-white"
                aria-hidden="true"
              />
              {content.lineHandle}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
