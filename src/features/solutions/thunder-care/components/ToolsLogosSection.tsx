"use client";

// === Tools Logos Section: หัวข้อเล็กตรงกลาง ตามด้วยแถวโลโก้เครื่องมือ
// ที่เชื่อมต่อได้แบบเต็มความกว้าง (แยกชั้นจาก PlatformAndCtaSection
// ต่างจากหน้า Communication ที่รวมโลโก้กับ CTA ไว้ในการ์ดเดียว) ===

import type { ToolsContent } from "../types";

// TODO: replace with real tool/integration logo assets
const TOOL_LOGOS = [
  "Microsoft 365",
  "Google Workspace",
  "LINE",
  "Microsoft Teams",
  "SAP",
  "ORACLE",
  "ZERO TIER",
];

type ToolsLogosSectionProps = {
  content: ToolsContent;
};

export function ToolsLogosSection({ content }: ToolsLogosSectionProps) {
  return (
    <section className="bg-white px-4 pb-16 sm:px-6 lg:pb-20">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="text-lg font-semibold text-brand-navy">{content.title}</h2>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          {TOOL_LOGOS.map((name) => (
            <span
              key={name}
              role="img"
              aria-label={`${name} logo placeholder`}
              className="flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-500 shadow-sm"
            >
              {name}
            </span>
          ))}
          <span className="text-sm text-slate-500">{content.logosNote}</span>
        </div>
      </div>
    </section>
  );
}
