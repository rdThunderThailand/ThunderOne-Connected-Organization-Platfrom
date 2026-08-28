"use client";

// === Trust & CTA Section: 2 คอลัมน์ (มือถือ stack แนวตั้ง) — ฝั่งซ้าย
// หัวข้อ "องค์กรที่ไว้วางใจ" + แถวโลโก้ลูกค้า, ฝั่งขวา การ์ด CTA
// "ยังไม่แน่ใจว่าจะเริ่มจากตรงไหน?" พร้อมปุ่มพูดคุยกับเรา ===

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { TrustAndCtaContent } from "../types";

const CUSTOMER_LOGOS = [
  { name: "CPALL", src: "/images/logos/cpall.svg" },
  { name: "Bangchak", src: "/images/logos/bangchak.svg" },
  { name: "SCG", src: "/images/logos/scg.svg" },
  { name: "ThaiBev", src: "/images/logos/thaibev.svg" },
  { name: "PTT", src: "/images/logos/ptt.svg" },
  { name: "BJC", src: "/images/logos/bjc.png" },
];

type TrustAndCtaSectionProps = {
  content: TrustAndCtaContent;
};

export function TrustAndCtaSection({ content }: TrustAndCtaSectionProps) {
  return (
    <section className="px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_minmax(0,420px)] lg:items-center">
        <div>
          <h2 className="text-lg font-semibold text-brand-navy">{content.trustedTitle}</h2>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            {CUSTOMER_LOGOS.map((logo) => (
              <span
                key={logo.name}
                className="flex h-12 items-center justify-center rounded-xl px-5 shadow-sm"
              >
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={96}
                  height={32}
                  className="h-6 w-auto object-contain"
                />
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
            className="mt-6 inline-flex rounded-full bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-blue"
          >
            {content.cardCta}
          </Link>
          <p className="mt-3 text-xs text-slate-400">{content.cardNote}</p>
        </div>
      </div>
    </section>
  );
}
