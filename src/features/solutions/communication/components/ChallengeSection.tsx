"use client";

// === Challenge Section: heading + subtext ตามด้วยแถว 5 icon (มือถือ wrap)
// สื่อถึงความท้าทายที่องค์กรกำลังเผชิญเรื่องการสื่อสาร ===

import type { LucideIcon } from "lucide-react";
import { AlertTriangle, Eye, Settings, Share2, Users } from "lucide-react";
import type { ChallengeContent } from "../types";

const ICON_ORDER: { icon: LucideIcon; badgeClassName: string; iconClassName: string }[] = [
  { icon: Share2, badgeClassName: "bg-blue-100", iconClassName: "text-blue-600" },
  { icon: AlertTriangle, badgeClassName: "bg-sky-100", iconClassName: "text-sky-600" },
  { icon: Eye, badgeClassName: "bg-purple-100", iconClassName: "text-purple-600" },
  { icon: Users, badgeClassName: "bg-orange-100", iconClassName: "text-orange-600" },
  { icon: Settings, badgeClassName: "bg-violet-100", iconClassName: "text-violet-600" },
];

type ChallengeSectionProps = {
  content: ChallengeContent;
};

export function ChallengeSection({ content }: ChallengeSectionProps) {
  return (
    <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="text-3xl font-bold text-brand-navy sm:text-4xl">{content.title}</h2>
        <p className="mt-4 text-slate-600">{content.subtitle}</p>

        <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-10">
          {content.items.map((label, index) => {
            const { icon: Icon, badgeClassName, iconClassName } = ICON_ORDER[index % ICON_ORDER.length];
            return (
              <div key={label} className="flex w-36 flex-col items-center gap-3">
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-full ${badgeClassName}`}
                >
                  <Icon className={`h-6 w-6 ${iconClassName}`} />
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
