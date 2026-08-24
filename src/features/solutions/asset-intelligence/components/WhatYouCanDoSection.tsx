"use client";

// === What You Can Do Section: ฝั่งซ้ายหัวข้อ + checklist 7 ข้อ, ฝั่งขวา
// การ์ดรายละเอียดสินทรัพย์แบบมี tab (Overview เป็น tab ที่แสดงข้อมูลจริง
// ส่วน tab อื่นเป็น label เฉยๆ ตามมาตรฐานหน้า solution อื่นที่ไม่มี client
// state) พร้อมมือถือ mockup แสดงหน้าเดียวกัน ===

// TODO: confirm copy — EN screenshot heading is "Manage assets smarter, all
// in one platform.", but the TH screenshot shows the page title "Asset
// Intelligence" repeated here instead. Using a TH translation of the EN
// meaning for now (2026-08-20); content team to confirm before publish.

import { Check, QrCode } from "lucide-react";
import type { WhatYouCanDoContent } from "../types";

type WhatYouCanDoSectionProps = {
  content: WhatYouCanDoContent;
};

function QrPlaceholder({ label, size = "h-16 w-16" }: { label: string; size?: string }) {
  return (
    <div className="flex shrink-0 flex-col items-center gap-1">
      {/* TODO: replace with a real generated QR code */}
      <div
        role="img"
        aria-label="QR code placeholder"
        className={`flex ${size} items-center justify-center rounded-lg border border-slate-200 bg-white`}
      >
        <QrCode className="h-2/3 w-2/3 text-slate-400" />
      </div>
      <span className="text-center text-[9px] text-slate-400">{label}</span>
    </div>
  );
}

export function WhatYouCanDoSection({ content }: WhatYouCanDoSectionProps) {
  const { assetCard, mobileCard } = content;
  const overviewRows = [
    { label: assetCard.overview.assetIdLabel, value: assetCard.overview.assetIdValue },
    { label: assetCard.overview.categoryLabel, value: assetCard.overview.categoryValue },
    { label: assetCard.overview.brandModelLabel, value: assetCard.overview.brandModelValue },
    { label: assetCard.overview.serialNumberLabel, value: assetCard.overview.serialNumberValue },
    { label: assetCard.overview.locationLabel, value: assetCard.overview.locationValue },
  ];

  return (
    <section id="what-you-can-do" className="bg-white px-4 py-16 sm:px-6 lg:py-10">
      <div className="mx-auto flex justify-between max-w-7xl gap-12 lg:grid-cols-[minmax(0,380px)_1fr] lg:items-center">
        <div>
          <p className="text-sm bg font-semibold uppercase tracking-wide text-brand-blue">{content.label}</p>
          <h2 className="mt-3 text-3xl font-bold leading-snug text-brand-blue sm:text-4xl">{content.title}</h2>

          <ul className="mt-6 space-y-3">
            {content.checklist.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-fit"> 
        <div className="min-w-0">
          <div className="flex items-start gap-4 lg:min-w-0">
            <div className="w-96 shrink-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg">
              <div className="flex gap-3">
                {/* TODO: replace with real asset photo */}
                <div
                  role="img"
                  aria-label="Air conditioner unit photo placeholder"
                  className="h-12 w-12 shrink-0 rounded-lg bg-gradient-to-br from-blue-200 to-slate-400"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-xs font-bold text-brand-navy">{assetCard.name}</p>
                    <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-semibold text-emerald-600">
                      {assetCard.statusLabel}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-[10px] text-slate-400">{assetCard.subtitle}</p>
                </div>
                <QrPlaceholder label={assetCard.scanLabel} />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 sm:grid-cols-4">
                <div>
                  <p className="text-[10px] font-medium text-slate-400">{assetCard.purchaseDateLabel}</p>
                  <p className="text-xs font-semibold text-slate-700">{assetCard.purchaseDateValue}</p>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-slate-400">{assetCard.assetValueLabel}</p>
                  <p className="text-xs font-semibold text-slate-700">{assetCard.assetValueValue}</p>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-slate-400">{assetCard.expectedLifeLabel}</p>
                  <p className="text-xs font-semibold text-slate-700">{assetCard.expectedLifeValue}</p>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-slate-400">{assetCard.warrantyUntilLabel}</p>
                  <p className="text-xs font-semibold text-slate-700">{assetCard.warrantyUntilValue}</p>
                </div>
              </div>

              <div className="mt-4 flex gap-4 border-b border-slate-100 text-[11px] font-semibold">
                {assetCard.tabs.map((tab, index) => (
                  <span
                    key={tab}
                    className={`-mb-px border-b-2 pb-2 ${
                      index === 0 ? "border-brand-blue text-brand-blue" : "border-transparent text-slate-400"
                    }`}
                  >
                    {tab}
                  </span>
                ))}
              </div>

              <dl className="mt-3 space-y-2">
                {overviewRows.map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-4 text-xs">
                    <dt className="text-slate-400">{row.label}</dt>
                    <dd className="truncate font-medium text-slate-700">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* TODO: replace with real asset — smartphone mockup screenshot */}
            <div className="w-52 shrink-0 rounded-[2rem] border-[6px] border-brand-navy bg-white p-3 shadow-xl">
              <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-slate-200" />
              <div className="flex items-center gap-2">
                <div
                  role="img"
                  aria-label="Air conditioner unit photo placeholder"
                  className="h-9 w-9 shrink-0 rounded-lg bg-gradient-to-br from-blue-200 to-slate-400"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-bold text-brand-navy">{mobileCard.name}</p>
                  <span className="mt-0.5 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-semibold text-emerald-600">
                    {mobileCard.statusLabel}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex justify-center">
                <QrPlaceholder label="" size="h-24 w-24" />
              </div>

              <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">{mobileCard.purchaseDateLabel}</span>
                  <span className="font-semibold text-slate-700">{mobileCard.purchaseDateValue}</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">{mobileCard.assetValueLabel}</span>
                  <span className="font-semibold text-slate-700">{mobileCard.assetValueValue}</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">{mobileCard.nextMaintenanceLabel}</span>
                  <span className="font-semibold text-slate-700">{mobileCard.nextMaintenanceValue}</span>
                </div>
              </div>

              <span className="mt-3 block rounded-full bg-brand-blue py-2 text-center text-[11px] font-semibold text-white">
                {mobileCard.createWorkOrderButton}
              </span>
            </div>
          </div>
        </div>
        </div>






      </div>
    </section>
  );
}
