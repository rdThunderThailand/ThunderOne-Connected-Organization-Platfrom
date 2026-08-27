"use client";

// === Challenge Section: heading + subtext ตามด้วยแถว 5 icon (มือถือ wrap)
// สื่อถึงความท้าทายที่องค์กรกำลังเผชิญเรื่องการสื่อสาร ===

import type { LucideIcon } from "lucide-react";
import { AlertTriangle, Clock, Eye, MonitorCloud, Settings, Share2, Users, UsersRound } from "lucide-react";
import type { ChallengeContent } from "../types";

const ICON_ORDER: { icon: LucideIcon; badgeClassName: string; iconClassName: string }[] = [
  { icon: Clock, badgeClassName: "bg-violet-100", iconClassName: "text-violet-600" },
  { icon: MonitorCloud, badgeClassName: "bg-blue-100", iconClassName: "text-blue-600" },
  { icon: UsersRound, badgeClassName: "bg-green-100", iconClassName: "text-green-600" },
  { icon: Users, badgeClassName: "bg-orange-100", iconClassName: "text-orange-600" },
  { icon: Settings, badgeClassName: "bg-violet-100", iconClassName: "text-violet-600" },
];

type ChallengeSectionProps = {
  content: ChallengeContent;
};

export function ChallengeSection({ content }: ChallengeSectionProps) {
  return (
    <section className="px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="text-3xl font-bold text-brand-navy sm:text-4xl">{content.title}</h2>
        <p className="text-slate-600">{content.subtitle}</p>

        <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-10">
          {content.items.map((label, index) => {
            const { icon: Icon, badgeClassName, iconClassName } = ICON_ORDER[index % ICON_ORDER.length];
            return (
              <div key={label} className="flex w-36 flex-col items-center gap-3">
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-xl ${badgeClassName}`}
                >
                  <Icon className={`h-10 w-10 ${iconClassName}`} />
                </span>
                <span className="text-sm font-semibold text-brand-navy">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
