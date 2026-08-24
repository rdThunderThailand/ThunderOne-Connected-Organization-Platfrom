"use client";

// === Trust & CTA Section: 2 คอลัมน์ (มือถือ stack แนวตั้ง) — ฝั่งซ้าย
// หัวข้อ "องค์กรที่ไว้วางใจ" + แถวโลโก้ลูกค้า placeholder, ฝั่งขวา การ์ด CTA
// "ยังไม่แน่ใจว่าจะเริ่มจากตรงไหน?" พร้อมปุ่มพูดคุยกับเรา ===

import { Link } from "@/i18n/navigation";
import type { TrustAndCtaContent } from "../types";

// TODO: replace with real customer logo assets
const CUSTOMER_LOGOS = ["CPALL", "bangchak", "SCG", "ThaiBev", "ptt", "BJC"];

type TrustAndCtaSectionProps = {
  content: TrustAndCtaContent;
};

export function TrustAndCtaSection({ content }: TrustAndCtaSectionProps) {
  return (
    <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_minmax(0,420px)] lg:items-center">
        <div>
          <h2 className="text-lg font-semibold text-brand-navy">{content.trustedTitle}</h2>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            {CUSTOMER_LOGOS.map((name) => (
              <span
                key={name}
                role="img"
                aria-label={`${name} logo placeholder`}
                className="flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-500 shadow-sm"
              >
                {name}
              </span>
            ))}
            <span className="text-sm text-slate-500">{content.logosMore}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
          <h3 className="text-xl font-bold text-brand-navy">{content.cardTitle}</h3>
          <p className="mt-3 text-slate-600">{content.cardDescription}</p>
          <Link
            href="/contact"
            className="mt-6 inline-flex rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            {content.cardCta}
          </Link>
          <p className="mt-3 text-xs text-slate-400">{content.cardNote}</p>
        </div>
      </div>
    </section>
  );
}
