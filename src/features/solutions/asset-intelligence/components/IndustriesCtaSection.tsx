"use client";

// === Industries + Platform + CTA Section: 3 คอลัมน์บนพื้นขาว — คอลัมน์ 1
// "เหมาะสำหรับทุกอุตสาหกรรม" (5 icon), คอลัมน์ 2 "ทำงานร่วมกับ ThunderOne
// Platform" (แถว icon เชื่อมด้วยเส้นประจุด โลโก้ ThunderOne อยู่กลาง),
// คอลัมน์ 3 การ์ด CTA ปิดท้าย ===

import type { LucideIcon } from "lucide-react";
import { BarChart3, Boxes, Building2, ClipboardCheck, Factory, GraduationCap, HeartPulse, Landmark, Users } from "lucide-react";
import Image from "next/image";
import thunderOneMark from "@/components/logo/Black.svg";
import { useTalkToUsStore } from "@/store/talkToUsStore";
import type { CtaContent, IndustriesContent, PlatformContent, PlatformNodeItem } from "../types";

const INDUSTRY_ICONS: LucideIcon[] = [Landmark, Building2, Factory, GraduationCap, HeartPulse];

const PLATFORM_NODE_STYLES: Record<string, { icon: LucideIcon; badgeClassName: string }> = {
  work: { icon: ClipboardCheck, badgeClassName: "bg-emerald-500" },
  assets: { icon: Boxes, badgeClassName: "bg-blue-600" },
  people: { icon: Users, badgeClassName: "bg-amber-500" },
  reports: { icon: BarChart3, badgeClassName: "bg-purple-500" },
};

const CONNECTOR_CLASS = "mb-6 h-px w-10 shrink-0 border-t-2 border-dotted border-blue-300";

function PlatformNode({ item }: { item: PlatformNodeItem }) {
  const style = PLATFORM_NODE_STYLES[item.key];
  const Icon = style.icon;
  return (
    <div className="flex flex-col items-center gap-2">
      <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white shadow-md ${style.badgeClassName}`}>
        <Icon className="h-6 w-6" />
      </span>
      <span className="whitespace-nowrap text-xs font-semibold text-brand-navy">{item.label}</span>
    </div>
  );
}

type IndustriesCtaSectionProps = {
  industries: IndustriesContent;
  platform: PlatformContent;
  cta: CtaContent;
};

export function IndustriesCtaSection({ industries, platform, cta }: IndustriesCtaSectionProps) {
  const [firstNode, secondNode, ...restNodes] = platform.items;
  const [thirdNode, fourthNode] = restNodes;
  const openTalkToUs = useTalkToUsStore((s) => s.openWithTopic);

  return (
    <section className="px-4 py-8 sm:px-6 lg:py-10 flex justify-center">
      <div className="mx-auto flex max-w-8xl gap-8 lg:flex-cols-3">
        {/* คอลัมน์ 1: "เหมาะสำหรับทุกอุตสาหกรรม" — title + icon grid ที่ wrap ได้ */}
        <div>
          <h2 className="text-xl font-bold text-brand-navy text-center mt-6">{industries.title}</h2>
          <div className="mt-12 flex flex-wrap gap-1">
            {industries.items.map((label, index) => {
              const Icon = INDUSTRY_ICONS[index % INDUSTRY_ICONS.length];
              return (
                <div key={label} className="flex w-24 flex-col items-center gap-2 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-white text-brand-blue">
                    <Icon className="h-8 w-8" />
                  </span>
                  <span className="text-xs font-semibold text-brand-navy">{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* คอลัมน์ 2: "ทำงานร่วมกับ ThunderOne Platform" — diagram โหนดซ้าย 2 อัน,
            โลโก้ ThunderOne ตรงกลาง, โหนดขวา 2 อัน เชื่อมด้วยเส้นประจุด */}
        <div>
          <div className="flex justify-center">
            <h2 className="text-xl font-bold text-brand-navy w-sm text-center mt-6">{platform.title}</h2>
          </div>
          <div className="mt-6 flex min-w-0 items-center">
            <div className="flex min-w-140 items-center justify-center gap-2 lg:min-w-0">
              <PlatformNode item={firstNode} />
              <span aria-hidden="true" className={CONNECTOR_CLASS} />
              <PlatformNode item={secondNode} />
              <span aria-hidden="true" className={CONNECTOR_CLASS} />

              <div className="flex flex-col items-center gap-2">
                <span className="flex shrink-0 items-center justify-center shadow-lg">
                  <Image src={thunderOneMark} alt="ThunderOne" className="h-14 w-14 rounded-2xl" />
                </span>
                <span className="whitespace-nowrap text-xs font-bold text-brand-navy">{platform.centerLabel}</span>
              </div>

              <span aria-hidden="true" className={CONNECTOR_CLASS} />
              <PlatformNode item={thirdNode} />
              <span aria-hidden="true" className={CONNECTOR_CLASS} />
              <PlatformNode item={fourthNode} />
            </div>
          </div>
        </div>

        {/* คอลัมน์ 3: การ์ด CTA ปิดท้าย — title, description, ปุ่มลิงก์ไปหน้า contact, ctaNote */}
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-lg w-sm">
          <h3 className="text-xl font-bold text-brand-navy">{cta.title}</h3>
          <p className="mt-2 text-slate-600">{cta.description}</p>
          <button
            type="button"
            onClick={() => openTalkToUs("asset-intelligence")}
            className="mt-4 inline-flex rounded-full bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-blue"
          >
            {cta.ctaPrimary}
          </button>
          {/* TODO: confirm copy — TH ctaNote as given in the design brief translates
              differently from the EN "No long forms"; using it as provided pending
              content team confirmation (2026-08-20). */}
          <p className="mt-2 text-xs text-slate-400">{cta.ctaNote}</p>
        </div>
      </div>
    </section>
  );
}
