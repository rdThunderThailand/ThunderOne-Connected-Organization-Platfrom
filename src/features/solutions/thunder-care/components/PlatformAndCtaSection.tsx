"use client";

// === Platform & CTA Section: 2 คอลัมน์บนพื้นขาว (ไม่มีแบนเนอร์เข้มเต็มความกว้าง
// แบบหน้า Digital Signage & Media) — ฝั่งซ้าย "ทำงานร่วมกับ ThunderOne Platform"
// + แถว icon เชื่อมด้วยเส้นประ (Communication - Work - ThunderOne Platform
// วงกลมกลาง ใหญ่กว่าอันอื่น - Asset Intelligence - Thunder Care),
// ฝั่งขวาการ์ด CTA ปิดท้าย "พร้อมเริ่มต้นดูแล IT ของคุณหรือยัง?" ===

import type { LucideIcon } from "lucide-react";
import { Boxes, ClipboardCheck, Headset, Megaphone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { PlatformAndCtaContent } from "../types";

const NODE_STYLES: Record<string, { icon: LucideIcon; badgeClassName: string }> = {
  communication: { icon: Megaphone, badgeClassName: "bg-red-500" },
  work: { icon: ClipboardCheck, badgeClassName: "bg-emerald-500" },
  assetIntelligence: { icon: Boxes, badgeClassName: "bg-blue-600" },
  thunderCare: { icon: Headset, badgeClassName: "bg-purple-600" },
};

type PlatformAndCtaSectionProps = {
  content: PlatformAndCtaContent;
};

export function PlatformAndCtaSection({ content }: PlatformAndCtaSectionProps) {
  const [first, second, ...rest] = content.connectedItems;
  const [third, fourth] = rest;

  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_minmax(0,380px)] lg:items-center">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold leading-snug text-brand-navy sm:text-3xl">
            {content.platformTitle}
          </h2>
          <p className="mt-4 text-slate-600">{content.platformDescription}</p>
          <Link
            href="/platform"
            className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-purple-600 hover:underline"
          >
            {content.exploreLink}
            <span aria-hidden="true">&rarr;</span>
          </Link>

          <div className="mt-8 min-w-0 overflow-x-auto">
            <div className="flex min-w-140 items-center justify-between gap-2">
              {[first, second].map((item) => {
                const style = NODE_STYLES[item.key];
                const Icon = style.icon;
                return (
                  <div key={item.key} className="flex flex-1 flex-col items-center gap-2">
                    <span
                      className={`flex h-14 w-14 items-center justify-center rounded-full text-white shadow-md ${style.badgeClassName}`}
                    >
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="whitespace-nowrap text-xs font-semibold text-brand-navy">{item.label}</span>
                  </div>
                );
              })}

              <span aria-hidden="true" className="mb-6 h-px flex-1 border-t border-dashed border-slate-300" />

              <div className="flex flex-col items-center gap-2">
                <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-white bg-brand-navy text-lg font-extrabold text-white shadow-lg">
                  T1
                </span>
                <span className="whitespace-nowrap text-xs font-bold text-brand-navy">{content.centerLabel}</span>
              </div>

              <span aria-hidden="true" className="mb-6 h-px flex-1 border-t border-dashed border-slate-300" />

              {[third, fourth].map((item) => {
                const style = NODE_STYLES[item.key];
                const Icon = style.icon;
                return (
                  <div key={item.key} className="flex flex-1 flex-col items-center gap-2">
                    <span
                      className={`flex h-14 w-14 items-center justify-center rounded-full text-white shadow-md ${style.badgeClassName}`}
                    >
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="whitespace-nowrap text-xs font-semibold text-brand-navy">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
          <h3 className="text-xl font-bold text-brand-navy">{content.ctaTitle}</h3>
          <p className="mt-3 text-slate-600">{content.ctaDescription}</p>
          <Link
            href="/contact"
            className="mt-6 inline-flex rounded-full bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-700"
          >
            {content.ctaPrimary}
          </Link>
          <p className="mt-3 text-xs text-slate-400">{content.ctaNote}</p>
        </div>
      </div>
    </section>
  );
}
