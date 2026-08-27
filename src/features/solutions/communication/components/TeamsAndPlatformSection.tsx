"use client";

// === Teams & Platform Section: 2 คอลัมน์ — ฝั่งซ้าย "เหมาะสำหรับทุกทีม"
// พร้อมแถว 6 icon, ฝั่งขวา "ทำงานร่วมกับ ThunderOne Platform" พร้อม
// คำอธิบาย + กริด icon 4 อัน (3 ต่อแถว) ===

import type { LucideIcon } from "lucide-react";
import { AlertTriangle, Boxes, Building2, ClipboardCheck, Headset, Monitor, Share2, Users } from "lucide-react";
import type { TeamsAndPlatformContent } from "../types";

// Icon colour only — no tinted/solid background behind the icons.
const TEAM_ICONS: { icon: LucideIcon; badgeClassName: string }[] = [
  { icon: Building2, badgeClassName: "text-blue-600" },
  { icon: Users, badgeClassName: "text-purple-600" },
  { icon: Share2, badgeClassName: "text-teal-600" },
  { icon: ClipboardCheck, badgeClassName: "text-orange-600" },
  { icon: Monitor, badgeClassName: "text-sky-600" },
  { icon: AlertTriangle, badgeClassName: "text-red-600" },
];

const PLATFORM_ICONS: Record<string, { icon: LucideIcon; badgeClassName: string }> = {
  work: { icon: ClipboardCheck, badgeClassName: "text-emerald-500" },
  assetIntelligence: { icon: Boxes, badgeClassName: "text-green-700" },
  peopleOrganization: { icon: Users, badgeClassName: "text-blue-600" },
  thunderCare: { icon: Headset, badgeClassName: "text-purple-500" },
};

type TeamsAndPlatformSectionProps = {
  content: TeamsAndPlatformContent;
};

export function TeamsAndPlatformSection({ content }: TeamsAndPlatformSectionProps) {
  return (
    <section className="px-4 py-16 sm:px-6 lg:py-10 ">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_minmax(0,480px)]">
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <h2 className="text-center text-2xl font-bold text-brand-navy sm:text-3xl">{content.teamsTitle}</h2>
          <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-10">
            {content.teams.map((label, index) => {
              const { icon: Icon, badgeClassName } = TEAM_ICONS[index % TEAM_ICONS.length];
              return (
                <div key={label} className="flex w-28 flex-col items-center gap-2 text-center">
                  <span className={`flex h-12 w-12 items-center justify-center ${badgeClassName}`}>
                    <Icon className="h-8 w-8" />
                  </span>
                  <span className="whitespace-pre-line text-xs font-semibold text-brand-navy">{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-brand-navy">{content.platformTitle}</h3>
          <p className="mt-2 whitespace-pre-line text-sm text-slate-600">{content.platformDescription}</p>

          <div className="mt-6 flex  gap-x-4 gap-y-6">
            {content.platformItems.map((item) => {
              const style = PLATFORM_ICONS[item.key];
              const Icon = style.icon;
              return (
                <div key={item.key} className="flex w-24 flex-col items-center gap-2 text-center">
                  <span className={`flex h-10 w-10 items-center justify-center ${style.badgeClassName}`}>
                    <Icon className="h-7 w-7" />
                  </span>
                  <span className="text-[11px] font-semibold leading-tight text-brand-navy">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
