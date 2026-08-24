"use client";

// === Perfect For Section: heading ตามด้วยแถว 5 รายการ (icon + title +
// คำอธิบายสั้น) สื่อว่าโซลูชันนี้เหมาะกับพื้นที่/วัตถุประสงค์แบบไหนบ้าง ===

import type { LucideIcon } from "lucide-react";
import { Building2, GraduationCap, Hotel, Info, ShoppingBag } from "lucide-react";
import type { PerfectForContent } from "../types";

const ITEM_STYLES: { icon: LucideIcon; badgeClassName: string }[] = [
  { icon: Building2, badgeClassName: "bg-blue-100 text-blue-600" },
  { icon: ShoppingBag, badgeClassName: "bg-purple-100 text-purple-600" },
  { icon: Hotel, badgeClassName: "bg-emerald-100 text-emerald-600" },
  { icon: GraduationCap, badgeClassName: "bg-orange-100 text-orange-600" },
  { icon: Info, badgeClassName: "bg-sky-100 text-sky-600" },
];

type PerfectForSectionProps = {
  content: PerfectForContent;
};

export function PerfectForSection({ content }: PerfectForSectionProps) {
  return (
    <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-3xl font-bold text-brand-navy sm:text-4xl">{content.title}</h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {content.items.map((item, index) => {
            const { icon: Icon, badgeClassName } = ITEM_STYLES[index % ITEM_STYLES.length];
            return (
              <div key={item.title} className="flex flex-col items-center gap-3 text-center">
                <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${badgeClassName}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <p className="text-sm font-bold text-brand-navy">{item.title}</p>
                <p className="text-xs text-slate-500">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
