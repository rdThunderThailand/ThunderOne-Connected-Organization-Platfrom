"use client";

// === Trust & CTA Section: ฝั่งบน หัวข้อ "องค์กรที่ไว้วางใจ" + แถวโลโก้ลูกค้า,
// ฝั่งล่าง แบนเนอร์ CTA แนวนอน "ยังไม่แน่ใจว่าจะเริ่มจากตรงไหน?" — ไอคอนแชท +
// ข้อความ + ปุ่มพูดคุยกับเรา + จุดเด่นสั้น ๆ (ใช้เวลา ~1 นาที / ไม่ต้องกรอกฟอร์มยาว) ===

import type { LucideIcon } from "lucide-react";
import { CheckCircle2, Clock, MessageCircle, MessagesSquare } from "lucide-react";
import { useTalkToUsStore } from "@/store/talkToUsStore";
import type { TrustAndCtaContent } from "../types";

// cardNote รวมจุดเด่นหลายข้อไว้ในสตริงเดียว คั่นด้วย "•" — แยกออกมาเป็นชิปพร้อมไอคอน
const NOTE_ICONS: LucideIcon[] = [Clock, CheckCircle2];

type TrustAndCtaSectionProps = {
  content: TrustAndCtaContent;
};

export function TrustAndCtaSection({ content }: TrustAndCtaSectionProps) {
  const openTalkToUs = useTalkToUsStore((s) => s.open);

  const notes = content.cardNote
    .split("•")
    .map((note) => note.trim())
    .filter(Boolean);

  return (
    <section className="px-4 py-16 sm:px-6 ">
      <div className="mx-auto max-w-5xl">
        <div className="mt-10 flex flex-col gap-6 rounded-3xl bg-indigo-50/70 px-6 py-6 sm:px-10 lg:flex-row lg:items-center lg:gap-10">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-brand-blue">
              <MessagesSquare className="h-6 w-6" />
            </span>
            <div className="max-w-xs">
              <h3 className="text-lg font-bold text-brand-navy">{content.cardTitle}</h3>
              <p className="mt-1 text-sm text-slate-500">{content.cardDescription}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 lg:ml-auto">
            <button
              type="button"
              onClick={openTalkToUs}
              className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-blue"
            >
              {content.cardCta}
              <MessageCircle className="h-4 w-4" />
            </button>

            {notes.length > 0 && (
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                {notes.map((note, index) => {
                  const Icon = NOTE_ICONS[index % NOTE_ICONS.length];
                  return (
                    <span key={note} className="flex items-center gap-2 text-sm text-slate-600">
                      <Icon className="h-4 w-4 shrink-0 text-brand-blue" />
                      {note}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
