"use client";

// === Hero Section: หัวข้อหลัก (2 บรรทัด, บรรทัดที่ 2 สี accent) + คำอธิบาย +
// ปุ่ม CTA หลัก/รอง ฝั่งซ้าย, diagram วงกลม 7 icon รอบโลโก้ ThunderOne
// พร้อม badge "Intelligence + AI" ฝั่งขวา ===

import type { LucideIcon } from "lucide-react";
import { Box, Building2, Headset, Megaphone, Package, Users, ClipboardCheck } from "lucide-react";
import { HeroOrbitDiagram, type OrbitNode } from "@/components/diagrams/HeroOrbitDiagram";
import { useTalkToUsStore } from "@/store/talkToUsStore";
import type { SolutionsHeroContent } from "../types";

type SolutionsHeroSectionProps = {
  content: SolutionsHeroContent;
};

const NODE_ORDER: {
  key: keyof SolutionsHeroContent["diagramNodes"];
  icon: LucideIcon;
  badgeClassName: string;
}[] = [
  { key: "people", icon: Users, badgeClassName: "bg-sky-500" },
  { key: "work", icon: ClipboardCheck, badgeClassName: "bg-emerald-500" },
  { key: "communication", icon: Megaphone, badgeClassName: "bg-cyan-500" },
  { key: "service", icon: Headset, badgeClassName: "bg-violet-600" },
  { key: "device", icon: Package, badgeClassName: "bg-indigo-600" },
  { key: "asset", icon: Box, badgeClassName: "bg-blue-600" },
  { key: "space", icon: Building2, badgeClassName: "bg-orange-500" },
];

export function SolutionsHeroSection({ content }: SolutionsHeroSectionProps) {
  const openTalkToUs = useTalkToUsStore((s) => s.open);

  const nodes: OrbitNode[] = NODE_ORDER.map(({ key, icon, badgeClassName }) => ({
    key,
    icon,
    badgeClassName,
    label: content.diagramNodes[key],
  }));

  return (
    <section className="overflow-hidden">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-8 lg:grid-cols-2 lg:items-start lg:pb-28 lg:pt-12">
        <div>
          <h1 className="text-4xl font-bold leading-tight text-brand-navy sm:text-5xl">
            <span className="block">{content.title1}</span>
            <span className="block text-brand-blue">{content.title2}</span>
          </h1>
          <p className="mt-6 max-w-xl whitespace-pre-line text-lg text-slate-600">{content.description}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={openTalkToUs}
              className="rounded-full bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-blue"
            >
              {content.ctaPrimary}
            </button>
            <a
              href="#solutions-grid"
              className="rounded-full border border-brand-navy px-6 py-3 text-sm font-semibold text-brand-navy hover:bg-slate-50"
            >
              {content.ctaSecondary}
            </a>
          </div>
        </div>

        <div className="relative lg:self-center">
          <div className="absolute left-1/2 top-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/10 blur-3xl" />
          <HeroOrbitDiagram
            nodes={nodes}
            caption={{ title: content.diagramBadge, subtitle: content.diagramTagline }}
          />
        </div>
      </div>
    </section>
  );
}
