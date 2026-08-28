"use client";

// === Shared Tools Logos Section: หัวข้อเล็กจัดกึ่งกลาง + แถวโลโก้เครื่องมือ/
// ระบบที่เชื่อมต่อได้แบบเต็มความกว้าง ใช้ร่วมกันในหน้า Communication และ
// Thunder Care (แต่ละหน้าคุม vertical spacing เองผ่าน prop `className`).
//
// แบรนด์มาร์กเป็นสีจริงแบบเรียบง่าย (ยังไม่มีไฟล์โลโก้อย่างเป็นทางการใน repo)
// เพื่อให้แถวอ่านออกว่าเป็นแบรนด์ ไม่ใช่ pill ข้อความล้วน
// TODO: swap for real logo assets when available.

import type { ReactNode } from "react";

export type ToolsLogosContent = {
  title: string;
  note: string;
};

function MicrosoftMark() {
  return (
    <span className="grid h-6 w-6 grid-cols-2 gap-0.5" aria-hidden="true">
      <span className="bg-[#F25022]" />
      <span className="bg-[#7FBA00]" />
      <span className="bg-[#00A4EF]" />
      <span className="bg-[#FFB900]" />
    </span>
  );
}

function GoogleMark() {
  return (
    <span className="text-lg font-bold" aria-hidden="true">
      <span className="text-[#4285F4]">G</span>
      <span className="text-[#EA4335]">o</span>
      <span className="text-[#FBBC05]">o</span>
      <span className="text-[#4285F4]">g</span>
      <span className="text-[#34A853]">l</span>
      <span className="text-[#EA4335]">e</span>
    </span>
  );
}

function LineMark() {
  return (
    <span
      className="flex h-7 items-center justify-center rounded-md bg-[#06C755] px-2 text-[11px] font-bold text-white"
      aria-hidden="true"
    >
      LINE
    </span>
  );
}

function TeamsMark() {
  return (
    <span
      className="flex h-7 w-7 items-center justify-center rounded-md bg-[#5059C9] text-xs font-bold text-white"
      aria-hidden="true"
    >
      T
    </span>
  );
}

function SapMark() {
  return (
    <span
      className="flex h-8 items-center justify-center rounded-md bg-[#0F70D7] px-2.5 text-sm font-bold italic tracking-wide text-white"
      aria-hidden="true"
    >
      SAP
    </span>
  );
}

function PowerBiMark() {
  return (
    <span className="flex h-6 items-end gap-1" aria-hidden="true">
      <span className="h-3 w-1.5 rounded-[1px] bg-[#F2C811]" />
      <span className="h-4 w-1.5 rounded-[1px] bg-[#EAA300]" />
      <span className="h-6 w-1.5 rounded-[1px] bg-[#F2C811]" />
    </span>
  );
}

type ToolLogo = {
  key: string;
  mark: ReactNode;
  label: ReactNode;
};

const TOOL_LOGOS: ToolLogo[] = [
  { key: "microsoft-365", mark: <MicrosoftMark />, label: "Microsoft 365" },
  { key: "google-workspace", mark: <GoogleMark />, label: "Workspace" },
  { key: "line", mark: <LineMark />, label: "LINE" },
  { key: "teams", mark: <TeamsMark />, label: "Teams" },
  { key: "sap", mark: <SapMark />, label: null },
  { key: "oracle", mark: null, label: <span className="font-bold tracking-wide text-[#C74634]">ORACLE</span> },
  { key: "power-bi", mark: <PowerBiMark />, label: "Power BI" },
];

type ToolsLogosSectionProps = {
  content: ToolsLogosContent;
  /** Classes on the outer <section> — lets each page keep its own vertical rhythm. */
  className?: string;
};

export function ToolsLogosSection({
  content,
  className = "px-4 py-16 sm:px-6 lg:py-20",
}: ToolsLogosSectionProps) {
  return (
    <section className={className}>
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="text-xl font-semibold text-brand-navy sm:text-2xl">{content.title}</h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {TOOL_LOGOS.map((tool) => (
            <span key={tool.key} className="flex items-center gap-2.5 text-base font-semibold text-slate-700">
              {tool.mark}
              {tool.label}
            </span>
          ))}
          <span className="text-base text-slate-500">{content.note}</span>
        </div>
      </div>
    </section>
  );
}
