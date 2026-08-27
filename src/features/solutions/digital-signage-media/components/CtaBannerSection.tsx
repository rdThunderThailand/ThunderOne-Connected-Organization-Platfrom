"use client";

// === CTA Banner Section: แบนเนอร์ปิดท้ายพื้นเข้ม (navy) แบ่ง 2 ฝั่ง —
// ซ้าย headline + subtext + ปุ่ม "พูดคุยกับเรา" (ขาว), ขวาข้อความ LINE OA
// + ปุ่มเขียว @thunderone ===

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
    <section className="bg-brand-navy px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">{content.title}</h2>
          <p className="mt-3 text-slate-300">{content.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-blue"
            >
              {content.ctaPrimary}
            </Link>
            <span className="text-xs text-slate-400">{content.ctaNote}</span>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 lg:items-end">
          <p className="text-sm text-slate-300">{content.lineLabel}</p>
          <a
            href="#"
            className="flex items-center gap-2 rounded-full bg-[#06C755] px-6 py-3 text-sm font-semibold text-white hover:bg-[#05b34c]"
          >
            <MessageCircle className="h-4 w-4" />
            {content.lineHandle}
          </a>
        </div>
      </div>
    </section>
  );
}
