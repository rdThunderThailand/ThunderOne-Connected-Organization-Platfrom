"use client";

// === Tools & CTA Section: บนพื้นขาว (ไม่มีแบนเนอร์เข้ม) — แถวโลโก้
// เครื่องมือที่เชื่อมต่อได้ด้านบน, การ์ด CTA ปิดท้าย "พร้อมยกระดับ
// การสื่อสารหรือยัง?" ขนาดใหญ่ จัดกึ่งกลางด้านล่าง ===

import { Link } from "@/i18n/navigation";
import type { ToolsAndCtaContent } from "../types";

// TODO: replace with real tool/integration logo assets
const TOOL_LOGOS = ["Microsoft 365", "Google Workspace", "LINE", "Slack", "Microsoft Teams", "SAP"];

type ToolsAndCtaSectionProps = {
  content: ToolsAndCtaContent;
};

export function ToolsAndCtaSection({ content }: ToolsAndCtaSectionProps) {
  return (
    <section className="px-4 py-4 sm:px-6 lg:py-6">
      <div className="mx-auto max-w-7xl">

        <div className="flex items-center">
        <div className="">
          <h2 className="text-lg font-semibold text-brand-navy">{content.toolsTitle}</h2>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            {TOOL_LOGOS.map((name) => (
              <span
                key={name}
                role="img"
                aria-label={`${name} logo placeholder`}
                className="flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-500 shadow-sm"
              >
                {name}
              </span>
            ))}
            <span className="text-sm text-slate-500">{content.toolsNote}</span>
          </div>
        </div>

        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-3 shadow-lg sm:p-6">
          <h3 className="text-2xl font-bold text-brand-navy sm:text-2xl">{content.ctaTitle}</h3>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">{content.ctaDescription}</p>
          <Link
            href="#/contact"
            className="mt-3 inline-flex rounded-full bg-blue-700 px-8 py-3.5 text-sm font-semibold text-white hover:bg-brand-blue"
          >
            {content.ctaPrimary}
          </Link>
          <p className="mt-3 text-xs text-slate-400">{content.ctaNote}</p>
        </div>
        </div>
      </div>
    </section>
  );
}
