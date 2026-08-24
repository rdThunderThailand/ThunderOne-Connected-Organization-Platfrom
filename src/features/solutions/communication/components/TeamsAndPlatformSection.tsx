"use client";

// === Teams & Platform Section: 2 คอลัมน์ — ฝั่งซ้าย "เหมาะสำหรับทุกทีม"
// พร้อมแถว 6 icon, ฝั่งขวา "ทำงานร่วมกับ ThunderOne Platform" พร้อม
// คำอธิบาย + แถว icon เล็ก 4 อัน ===

import type { LucideIcon } from "lucide-react";
import { AlertTriangle, Boxes, Building2, ClipboardCheck, Headset, Monitor, Share2, Users } from "lucide-react";
import type { TeamsAndPlatformContent } from "../types";

const TEAM_ICONS: { icon: LucideIcon; badgeClassName: string }[] = [
  { icon: Building2, badgeClassName: "bg-blue-100 text-blue-600" },
  { icon: Users, badgeClassName: "bg-purple-100 text-purple-600" },
  { icon: Share2, badgeClassName: "bg-teal-100 text-teal-600" },
  { icon: ClipboardCheck, badgeClassName: "bg-orange-100 text-orange-600" },
  { icon: Monitor, badgeClassName: "bg-sky-100 text-sky-600" },
  { icon: AlertTriangle, badgeClassName: "bg-red-100 text-red-600" },
];

const PLATFORM_ICONS: Record<string, { icon: LucideIcon; badgeClassName: string }> = {
  work: { icon: ClipboardCheck, badgeClassName: "bg-emerald-500" },
  assetIntelligence: { icon: Boxes, badgeClassName: "bg-blue-600" },
  peopleOrganization: { icon: Users, badgeClassName: "bg-purple-600" },
  thunderCare: { icon: Headset, badgeClassName: "bg-red-500" },
};

type TeamsAndPlatformSectionProps = {
  content: TeamsAndPlatformContent;
};

export function TeamsAndPlatformSection({ content }: TeamsAndPlatformSectionProps) {
  return (
    <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:py-10 ">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_minmax(0,400px)]">
        <div className="rounded-2xl border  bg-white border-slate-200">
          <h2 className="mt-6 text-2xl text-center font-bold text-brand-navy sm:text-3xl">{content.teamsTitle}</h2>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-8">
            {content.teams.map((label, index) => {
              const { icon: Icon, badgeClassName } = TEAM_ICONS[index % TEAM_ICONS.length];
              return (
                <div key={label} className="flex w-28 flex-col items-center gap-2 text-center">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${badgeClassName}`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-xs font-semibold text-brand-navy">{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-bold text-brand-navy">{content.platformTitle}</h3>
          <p className="mt-2 text-sm text-slate-600">{content.platformDescription}</p>

          <div className="mt-6 flex flex-wrap justify-between gap-4">
            {content.platformItems.map((item) => {
              const style = PLATFORM_ICONS[item.key];
              const Icon = style.icon;
              return (
                <div key={item.key} className="flex flex-col items-center gap-2">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-white ${style.badgeClassName}`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="whitespace-nowrap text-[11px] font-semibold text-brand-navy">
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
