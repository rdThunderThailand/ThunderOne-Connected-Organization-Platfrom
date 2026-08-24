"use client";

// === Solutions Grid Section: heading + subtext ตามด้วย grid การ์ด 4
// โซลูชัน (มือถือ stack แนวตั้ง, tablet 2 คอลัมน์, desktop 4 คอลัมน์)
// แต่ละการ์ดมี icon กลมสี, ชื่อ, คำอธิบายสั้น, checklist 5 ข้อ, รูป
// screenshot placeholder, และลิงก์ "สำรวจโซลูชันนี้" ===

import type { LucideIcon } from "lucide-react";
import { ArrowRight, Boxes, Check, Headset, Megaphone, Monitor } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { SolutionGridItem, SolutionsGridContent } from "../types";

const ITEM_STYLES: Record<
  string,
  { icon: LucideIcon; iconClassName: string; gradientClassName: string; href: string }
> = {
  digitalSignage: {
    icon: Monitor,
    iconClassName: "bg-brand-blue text-white",
    gradientClassName: "from-brand-blue to-blue-300",
    href: "/solutions/digital-signage-media",
  },
  communication: {
    icon: Megaphone,
    iconClassName: "bg-blue-600 text-white",
    gradientClassName: "from-blue-600 to-sky-300",
    href: "/solutions/communication",
  },
  thunderCare: {
    icon: Headset,
    iconClassName: "bg-purple-600 text-white",
    gradientClassName: "from-purple-600 to-violet-300",
    href: "/solutions/thunder-care",
  },
  assetIntelligence: {
    icon: Boxes,
    iconClassName: "bg-teal-600 text-white",
    gradientClassName: "from-teal-600 to-cyan-300",
    href: "/solutions/asset-intelligence",
  },
};

function SolutionCard({ item }: { item: SolutionGridItem }) {
  const style = ITEM_STYLES[item.key];
  const Icon = style.icon;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 p-6 justify-between">
      <div>
      <span
        className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${style.iconClassName}`}
      >
        <Icon className="h-6 w-6" />
      </span>

      <h3 className="mt-4 text-lg font-bold text-brand-navy">{item.title}</h3>
      <p className="mt-2 text-sm text-slate-600">{item.description}</p>

      <ul className="mt-4 space-y-2">
        {item.checklist.map((checkItem) => (
          <li key={checkItem} className="flex items-start gap-2 text-sm text-slate-600">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
            <span>{checkItem}</span>
          </li>
        ))}
      </ul>

      </div>


<div>
      {/* TODO: replace with real asset */}
      <div
        className={`mt-5 flex h-32 items-center justify-center rounded-xl bg-gradient-to-br ${style.gradientClassName}`}
        role="img"
        aria-label={`${item.title} screenshot placeholder`}
      >
        <Icon className="h-8 w-8 text-white/70" />
      </div>

      <Link
        href={style.href}
        className="group mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-blue hover:underline"
      >
        {item.link}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
</div>

    </div>
  );
}

type SolutionsGridSectionProps = {
  content: SolutionsGridContent;
};

export function SolutionsGridSection({ content }: SolutionsGridSectionProps) {
  return (
    <section id="solutions-grid" className="bg-slate-50 px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-brand-navy sm:text-4xl">{content.title}</h2>
          <p className="mt-4 text-slate-600">{content.subtitle}</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {content.items.map((item) => (
            <SolutionCard key={item.key} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
