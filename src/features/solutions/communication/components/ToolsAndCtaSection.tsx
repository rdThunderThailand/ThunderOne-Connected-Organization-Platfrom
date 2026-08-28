"use client";

// === CTA Section: การ์ดปิดท้ายหน้า Communication "พร้อมยกระดับการสื่อสาร
// หรือยัง?" — หัวข้อใหญ่ + คำอธิบาย + ปุ่มพูดคุยกับเรา + หมายเหตุ
// (แถวโลโก้เครื่องมือแยกไปที่ ToolsLogosSection (shared) แล้ว) ===

import { useTalkToUsStore } from "@/store/talkToUsStore";
import type { ToolsAndCtaContent } from "../types";

type ToolsAndCtaSectionProps = {
  content: ToolsAndCtaContent;
};

export function ToolsAndCtaSection({ content }: ToolsAndCtaSectionProps) {
  const openTalkToUs = useTalkToUsStore((s) => s.openWithTopic);

  return (
    <section className="px-4 py-3 sm:px-6 lg:py-4">
      <div className="mx-auto max-w-7xl text-center">
        <div className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-3 shadow-md sm:p-4">
          <h3 className="text-lg font-bold text-brand-navy">{content.ctaTitle}</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">{content.ctaDescription}</p>
          <button
            type="button"
            onClick={() => openTalkToUs("communication")}
            className="mt-3 inline-flex rounded-full bg-blue-700 px-5 py-2.5 text-xs font-semibold text-white hover:bg-brand-blue"
          >
            {content.ctaPrimary}
          </button>
          <p className="mt-2 text-[11px] text-slate-400">{content.ctaNote}</p>
        </div>
      </div>
    </section>
  );
}
