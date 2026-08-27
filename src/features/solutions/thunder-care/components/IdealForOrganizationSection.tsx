"use client";

// === Ideal for Organization Section: heading ตามด้วยแถว 6 รายการ
// (icon + title + คำอธิบายสั้น) สื่อว่า Thunder Care เหมาะกับองค์กร
// ประเภทไหนบ้าง — ไอคอนทั้งหมดใช้โทนม่วงเดียวกัน ===

import type { LucideIcon } from "lucide-react";
import { Building2, Factory, GraduationCap, HeartPulse, Landmark, ShoppingBag } from "lucide-react";
import type { IdealForContent } from "../types";

const ICONS: LucideIcon[] = [Building2, ShoppingBag, Factory, GraduationCap, HeartPulse, Landmark];

type IdealForOrganizationSectionProps = {
  content: IdealForContent;
};

export function IdealForOrganizationSection({ content }: IdealForOrganizationSectionProps) {
  return (
    <section className="px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-3xl font-bold text-brand-navy sm:text-4xl">{content.title}</h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {content.items.map((item, index) => {
            const Icon = ICONS[index % ICONS.length];
            return (
              <div key={item.title} className="flex flex-col items-center gap-3 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-brand-blue">
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
