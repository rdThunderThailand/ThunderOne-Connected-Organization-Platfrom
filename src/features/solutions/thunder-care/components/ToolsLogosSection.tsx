"use client";

// === Tools Logos Section: หัวข้อเล็กตรงกลาง ตามด้วยแถวโลโก้เครื่องมือ
// ที่เชื่อมต่อได้แบบเต็มความกว้าง (แยกชั้นจาก PlatformAndCtaSection
// ต่างจากหน้า Communication ที่รวมโลโก้กับ CTA ไว้ในการ์ดเดียว) ===

import type { ReactNode } from "react";
import type { ToolsContent } from "../types";

// Simple brand-colored marks (not the real logo artwork — no official asset
// files exist in the repo yet) so the row reads as recognizable brands
// instead of plain text pills. TODO: swap for real logo assets when available.
function MicrosoftMark() {
  return (
    <span className="grid h-4 w-4 grid-cols-2 gap-0.5" aria-hidden="true">
      <span className="bg-[#F25022]" />
      <span className="bg-[#7FBA00]" />
      <span className="bg-[#00A4EF]" />
      <span className="bg-[#FFB900]" />
    </span>
  );
}

function GoogleMark() {
  return (
    <span className="text-sm font-bold" aria-hidden="true">
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
      className="flex h-5 items-center justify-center rounded-md bg-[#06C755] px-1.5 text-[9px] font-bold text-white"
      aria-hidden="true"
    >
      LINE
    </span>
  );
}

function TeamsMark() {
  return (
    <span
      className="flex h-5 w-5 items-center justify-center rounded-md bg-[#5059C9] text-[10px] font-bold text-white"
      aria-hidden="true"
    >
      T
    </span>
  );
}

function SapMark() {
  return (
    <span
      className="flex h-6 items-center justify-center rounded-md bg-[#0F70D7] px-2 text-xs font-bold italic tracking-wide text-white"
      aria-hidden="true"
    >
      SAP
    </span>
  );
}

function PowerBiMark() {
  return (
    <span className="flex h-4 items-end gap-0.5" aria-hidden="true">
      <span className="h-2 w-1 rounded-[1px] bg-[#F2C811]" />
      <span className="h-3 w-1 rounded-[1px] bg-[#EAA300]" />
      <span className="h-4 w-1 rounded-[1px] bg-[#F2C811]" />
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
  content: ToolsContent;
};

export function ToolsLogosSection({ content }: ToolsLogosSectionProps) {
  return (
    <section className="bg-white px-4 pb-16 sm:px-6 lg:pb-20">
      <div className="mx-auto max-w-7xl text-center ">
        <h2 className="text-lg font-semibold text-brand-navy">{content.title}</h2>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-5">
          {TOOL_LOGOS.map((tool) => (
            <span key={tool.key} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              {tool.mark}
              {tool.label}
            </span>
          ))}
          <span className="text-sm text-slate-500">{content.logosNote}</span>
        </div>
      </div>
    </section>
  );
}
