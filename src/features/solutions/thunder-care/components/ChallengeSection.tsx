"use client";

// === Challenge Section: heading + subtext ตามด้วยแถว 5 icon (มือถือ wrap)
// สื่อถึงความท้าทายที่องค์กรกำลังเผชิญเรื่องการดูแล IT และอุปกรณ์ —
// ไอคอนทั้งหมดใช้โทนม่วงเดียวกัน (ต่างจากหน้าอื่นที่สลับหลายสี) ===

import type { LucideIcon } from "lucide-react";
import { BarChart3, Clock, Monitor, Settings, Users } from "lucide-react";
import type { ChallengeContent } from "../types";

const ICONS: LucideIcon[] = [Clock, Monitor, Users, BarChart3, Settings];

type ChallengeSectionProps = {
  content: ChallengeContent;
};

export function ChallengeSection({ content }: ChallengeSectionProps) {
  return (
    <section className="px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="text-3xl font-bold text-brand-navy sm:text-4xl">{content.title}</h2>
        <p className="mt-4 whitespace-pre-line text-slate-600">{content.subtitle}</p>

        <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-10">
          {content.items.map((label, index) => {
            const Icon = ICONS[index % ICONS.length];
            return (
              <div key={label} className="flex w-36 flex-col items-center gap-3">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
                  <Icon className="h-6 w-6 text-brand-blue" />
                </span>
                <span className="whitespace-pre-line text-sm font-semibold text-brand-navy">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
