"use client";

// === Works Seamlessly Section: หัวข้อ + คำอธิบาย + ลิงก์ไปหน้า platform
// ฝั่งซ้าย, แถว icon เชื่อมด้วยเส้นประ (Communication - Work - T1 ThunderOne
// (วงกลมกลาง ใหญ่กว่าอันอื่น) - Asset Intelligence - Thunder Care) ฝั่งขวา ===

import type { LucideIcon } from "lucide-react";
import { Boxes, ClipboardCheck, Headset, Megaphone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { WorksSeamlesslyContent } from "../types";

const NODE_STYLES: Record<string, { icon: LucideIcon; badgeClassName: string }> = {
  communication: { icon: Megaphone, badgeClassName: "bg-red-500" },
  work: { icon: ClipboardCheck, badgeClassName: "bg-emerald-500" },
  assetIntelligence: { icon: Boxes, badgeClassName: "bg-blue-600" },
  thunderCare: { icon: Headset, badgeClassName: "bg-purple-600" },
};

type WorksSeamlesslySectionProps = {
  content: WorksSeamlesslyContent;
};

export function WorksSeamlesslySection({ content }: WorksSeamlesslySectionProps) {
  const [first, second, ...rest] = content.connectedItems;
  const [third, fourth] = rest;

  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,320px)_1fr] lg:items-center">
        <div className="min-w-0">
          <h2 className="text-3xl font-bold leading-snug text-brand-navy sm:text-4xl">{content.title}</h2>
          <p className="mt-4 text-slate-600">{content.description}</p>
          <Link
            href="/platform"
            className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand-blue hover:underline"
          >
            {content.link}
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        <div className="min-w-0">
          <div className="flex min-w-140 items-center justify-between gap-2 lg:min-w-0">
            {[first, second].map((item) => {
              const style = NODE_STYLES[item.key];
              const Icon = style.icon;
              return (
                <div key={item.key} className="flex flex-1 flex-col items-center gap-2">
                  <span
                    className={`flex h-14 w-14 items-center justify-center rounded-full text-white shadow-md ${style.badgeClassName}`}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="whitespace-nowrap text-xs font-semibold text-brand-navy">{item.label}</span>
                </div>
              );
            })}

            <span aria-hidden="true" className="mb-6 h-px flex-1 border-t border-dashed border-slate-300" />

            <div className="flex flex-col items-center gap-2">
              <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-white bg-brand-navy text-lg font-extrabold text-white shadow-lg">
                T1
              </span>
              <span className="whitespace-nowrap text-xs font-bold text-brand-navy">{content.centerLabel}</span>
            </div>

            <span aria-hidden="true" className="mb-6 h-px flex-1 border-t border-dashed border-slate-300" />

            {[third, fourth].map((item) => {
              const style = NODE_STYLES[item.key];
              const Icon = style.icon;
              return (
                <div key={item.key} className="flex flex-1 flex-col items-center gap-2">
                  <span
                    className={`flex h-14 w-14 items-center justify-center rounded-full text-white shadow-md ${style.badgeClassName}`}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="whitespace-nowrap text-xs font-semibold text-brand-navy">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
