"use client";

// === Industries + Platform + CTA Section: 3 คอลัมน์บนพื้นขาว — คอลัมน์ 1
// "เหมาะสำหรับทุกอุตสาหกรรม" (5 icon), คอลัมน์ 2 "ทำงานร่วมกับ ThunderOne
// Platform" (แถว icon เชื่อมด้วยเส้นประ วงกลม T1 อยู่กลาง), คอลัมน์ 3
// การ์ด CTA ปิดท้าย ===

import type { LucideIcon } from "lucide-react";
import { BarChart3, Boxes, Building2, ClipboardCheck, Factory, GraduationCap, HeartPulse, Landmark, Users } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { CtaContent, IndustriesContent, PlatformContent } from "../types";

const INDUSTRY_ICONS: LucideIcon[] = [Landmark, Building2, Factory, GraduationCap, HeartPulse];

const PLATFORM_NODE_STYLES: Record<string, { icon: LucideIcon; badgeClassName: string }> = {
  work: { icon: ClipboardCheck, badgeClassName: "bg-emerald-500" },
  assets: { icon: Boxes, badgeClassName: "bg-blue-600" },
  people: { icon: Users, badgeClassName: "bg-amber-500" },
  reports: { icon: BarChart3, badgeClassName: "bg-purple-500" },
};

type IndustriesCtaSectionProps = {
  industries: IndustriesContent;
  platform: PlatformContent;
  cta: CtaContent;
};

export function IndustriesCtaSection({ industries, platform, cta }: IndustriesCtaSectionProps) {
  const [firstNode, secondNode, ...restNodes] = platform.items;
  const [thirdNode, fourthNode] = restNodes;

  return (
    <section className="bg-white px-4 py-8 sm:px-6 lg:py-10 flex justify-center">
      <div className="mx-auto flex max-w-8xl gap-8 lg:flex-cols-3">
        <div>
          <h2 className="text-xl font-bold text-brand-navy text-center mt-6">{industries.title}</h2>
          <div className="mt-15 flex flex-wrap gap-1">
            {industries.items.map((label, index) => {
              const Icon = INDUSTRY_ICONS[index % INDUSTRY_ICONS.length];
              return (
                <div key={label} className="flex w-24 flex-col items-center gap-2 text-center">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-brand-blue">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-xs font-semibold text-brand-navy">{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex justify-center">
              <h2 className="text-xl font-bold text-brand-navy w-sm text-center mt-6">{platform.title}</h2>
          </div>
          <div className="mt-6 min-w-0">
            <div className="flex min-w-80 items-center justify-between gap-2">
              {[firstNode, secondNode].map((item) => {
                const style = PLATFORM_NODE_STYLES[item.key];
                const Icon = style.icon;
                return (
                  <div key={item.key} className="flex flex-1 flex-col items-center gap-2">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-full text-white shadow-md ${style.badgeClassName}`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="whitespace-nowrap text-[11px] font-semibold text-brand-navy">{item.label}</span>
                  </div>
                );
              })}

              <span aria-hidden="true" className="mb-5 h-px flex-1 border-t border-dashed border-slate-300" />

              <div className="flex flex-col items-center gap-2">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-white bg-brand-navy text-base font-extrabold text-white shadow-lg">
                  T1
                </span>
                <span className="whitespace-nowrap text-[11px] font-bold text-brand-navy">{platform.centerLabel}</span>
              </div>

              <span aria-hidden="true" className="mb-5 h-px flex-1 border-t border-dashed border-slate-300" />

              {[thirdNode, fourthNode].map((item) => {
                const style = PLATFORM_NODE_STYLES[item.key];
                const Icon = style.icon;
                return (
                  <div key={item.key} className="flex flex-1 flex-col items-center gap-2">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-full text-white shadow-md ${style.badgeClassName}`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="whitespace-nowrap text-[11px] font-semibold text-brand-navy">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-lg w-sm">
          <h3 className="text-xl font-bold text-brand-navy">{cta.title}</h3>
          <p className="mt-2 text-slate-600">{cta.description}</p>
          <Link
            href="/contact"
            className="mt-4 inline-flex rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            {cta.ctaPrimary}
          </Link>
          {/* TODO: confirm copy — TH ctaNote as given in the design brief translates
              differently from the EN "No long forms"; using it as provided pending
              content team confirmation (2026-08-20). */}
          <p className="mt-2 text-xs text-slate-400">{cta.ctaNote}</p>
        </div>
      </div>
    </section>
  );
}
