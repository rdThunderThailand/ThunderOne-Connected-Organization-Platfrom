"use client";

// === In Context Section: SectionHeader + tab switcher (Communication Team
// View / Employee View, useState) + ProductMockup panel for the active tab
// + a small engagement-over-time line chart (recharts — already a project
// dependency, unused elsewhere) underneath. id="in-context" is the scroll
// target for the hero's "See it in action" button. ===

import { useState } from "react";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import { ProductMockup } from "./ProductMockup";
import { SectionHeader } from "./SectionHeader";
import type { InContextContent } from "../types";

type InContextSectionProps = {
  content: InContextContent;
};

const ENGAGEMENT_TREND = [
  { t: 0, v: 10 },
  { t: 1, v: 22 },
  { t: 2, v: 18 },
  { t: 3, v: 35 },
  { t: 4, v: 48 },
  { t: 5, v: 42 },
  { t: 6, v: 60 },
];

export function InContextSection({ content }: InContextSectionProps) {
  const [activeTab, setActiveTab] = useState<"team" | "employee">("team");
  const activeView = activeTab === "team" ? content.teamView : content.employeeView;

  return (
    <section id="in-context" className="scroll-mt-20 bg-white px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-4xl">
        <SectionHeader number={content.number} title={content.title} />

        <div className="mt-8 flex gap-6 border-b border-slate-200">
          {(
            [
              ["team", content.teamViewLabel],
              ["employee", content.employeeViewLabel],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`-mb-px border-b-2 px-1 pb-3 text-sm font-semibold transition ${
                activeTab === key
                  ? "border-brand-blue text-brand-blue"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          <ProductMockup
            panelTitle={content.panelTitle}
            statusLabel={content.statusLabel}
            statusColor={activeView.statusColor}
            timestamp=""
            stats={activeView.stats}
          />

          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold text-slate-500">{content.chartLabel}</p>
            <div className="mt-2 h-20">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ENGAGEMENT_TREND}>
                  <Line type="monotone" dataKey="v" stroke="#2F5FE0" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
