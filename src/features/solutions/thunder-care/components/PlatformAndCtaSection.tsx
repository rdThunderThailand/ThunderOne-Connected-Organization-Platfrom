"use client";

// === Platform & CTA Section: การ์ดพื้นเทาเดียว แบ่ง 3 คอลัมน์ (หัวข้อจัดชิด
// บนแนวเดียวกันทั้งฝั่งซ้ายและขวา) — ซ้าย "ทำงานร่วมกับ ThunderOne Platform"
// + ปุ่ม, กลางแถว icon เชื่อมด้วยเส้นประจุด (Communication - Work -
// ThunderOne Platform โลโก้กลาง - Asset Intelligence - Thunder Care), ขวา
// การ์ด CTA "พร้อมเริ่มต้นดูแล IT ของคุณหรือยัง?" คั่นด้วยเส้นแบ่งแนวตั้ง ===

import type { LucideIcon } from "lucide-react";
import { ArrowRight, Boxes, ClipboardCheck, Headset, Megaphone, MessageCircle } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTalkToUsStore } from "@/store/talkToUsStore";
import thunderOneMark from "@/components/logo/Black.svg";
import type { PlatformAndCtaContent, PlatformConnectedItem } from "../types";

const NODE_STYLES: Record<string, { icon: LucideIcon; badgeClassName: string }> = {
  communication: { icon: Megaphone, badgeClassName: "bg-white text-blue-500" },
  work: { icon: ClipboardCheck, badgeClassName: "bg-white text-emerald-500" },
  assetIntelligence: { icon: Boxes, badgeClassName: "bg-white text-teal-600" },
  thunderCare: { icon: Headset, badgeClassName: "bg-white text-violet-600" },
};

const CONNECTOR_CLASS = "mb-6 h-px w-10 shrink-0 border-t-2 border-dotted border-blue-300";

type PlatformAndCtaSectionProps = {
  content: PlatformAndCtaContent;
};

function PlatformNode({ item }: { item: PlatformConnectedItem }) {
  const style = NODE_STYLES[item.key];
  const Icon = style.icon;
  return (
    <div className="flex flex-col items-center gap-2">
      <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full shadow-md ${style.badgeClassName}`}>
        <Icon className="h-6 w-6" />
      </span>
      <span className="whitespace-nowrap text-xs font-semibold text-brand-navy">{item.label}</span>
    </div>
  );
}

export function PlatformAndCtaSection({ content }: PlatformAndCtaSectionProps) {
  const [first, second, ...rest] = content.connectedItems;
  const [third, fourth] = rest;
  const openTalkToUs = useTalkToUsStore((s) => s.openWithTopic);

  return (
    <section className="px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 rounded-3xl bg-slate-50 p-8 lg:grid-cols-[minmax(0,300px)_1fr_minmax(0,280px)] lg:p-10">
          <div className="min-w-0">
            <h2 className="whitespace-pre-line text-2xl font-bold leading-snug text-brand-navy sm:text-3xl">{content.platformTitle}</h2>
            <p className="mt-3 whitespace-pre-line text-sm text-slate-600">{content.platformDescription}</p>
            <Link
              href="/platform"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-brand-blue shadow-sm hover:bg-blue-50"
            >
              {content.exploreLink}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex min-w-0 items-center">
            <div className="flex min-w-140 items-center justify-center gap-2 lg:min-w-0">
              <PlatformNode item={first} />
              <span aria-hidden="true" className={CONNECTOR_CLASS} />
              <PlatformNode item={second} />
              <span aria-hidden="true" className={CONNECTOR_CLASS} />

              <div className="flex flex-col items-center gap-2">
                <span className="flex shrink-0 items-center justify-center shadow-lg">
                  <Image src={thunderOneMark} alt="ThunderOne" className="h-14 w-14 rounded-2xl" />
                </span>
                <span className="whitespace-nowrap text-xs font-bold text-brand-navy">{content.centerLabel}</span>
              </div>

              <span aria-hidden="true" className={CONNECTOR_CLASS} />
              <PlatformNode item={third} />
              <span aria-hidden="true" className={CONNECTOR_CLASS} />
              <PlatformNode item={fourth} />
            </div>
          </div>

          <div className="min-w-0 lg:border-l lg:border-slate-200 lg:pl-8">
            <h3 className="text-xl font-bold leading-snug text-brand-navy sm:text-2xl">{content.ctaTitle}</h3>
            <p className="mt-3 text-sm text-slate-600">{content.ctaDescription}</p>
            <button
              type="button"
              onClick={() => openTalkToUs("thunder-care")}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-blue"
            >
              {content.ctaPrimary}
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                <MessageCircle className="h-3 w-3" />
              </span>
            </button>
            <p className="mt-3 text-xs text-slate-400">{content.ctaNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
