"use client";

// === Tools & CTA Section: 2 คอลัมน์บนพื้นขาว (ไม่มีแบนเนอร์เข้ม) —
// ฝั่งซ้ายโลโก้เครื่องมือที่เชื่อมต่อได้, ฝั่งขวาการ์ด CTA ปิดท้าย
// "พร้อมยกระดับการสื่อสารหรือยัง?" ===

import { Link } from "@/i18n/navigation";
import type { ToolsAndCtaContent } from "../types";

// TODO: replace with real tool/integration logo assets
const TOOL_LOGOS = ["Microsoft 365", "Google Workspace", "LINE", "Slack", "Microsoft Teams", "SAP"];

type ToolsAndCtaSectionProps = {
  content: ToolsAndCtaContent;
};

export function ToolsAndCtaSection({ content }: ToolsAndCtaSectionProps) {
  return (
    <section className="bg-white px-4 py-4 sm:px-6 lg:py-6">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_minmax(0,420px)] lg:items-center">
        <div>
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

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">
          <h3 className="text-xl font-bold text-brand-navy">{content.ctaTitle}</h3>
          <p className="mt-3 text-slate-600">{content.ctaDescription}</p>
          <Link
            href="/contact"
            className="mt-6 inline-flex rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            {content.ctaPrimary}
          </Link>
          <p className="mt-3 text-xs text-slate-400">{content.ctaNote}</p>
        </div>
      </div>
    </section>
  );
}
