"use client";

// === In Context: a card in the 3-column detail row. SectionHeader + tab
// switcher (Communication Team View / Employee View, useState) + ProductMockup
// panel for the active tab + a small engagement-over-time line chart (recharts
// — already a project dependency) with an hour axis underneath. id="in-context"
// is the scroll target for the hero's "See it in action" button. ===

import { useState } from "react";
import { Line, LineChart, ResponsiveContainer, XAxis } from "recharts";
import { ProductMockup } from "./ProductMockup";
import { SectionHeader } from "./SectionHeader";
import type { InContextContent } from "../types";

type InContextSectionProps = {
  content: InContextContent;
};

const ENGAGEMENT_TREND = [
  { time: "00:00", v: 6 },
  { time: "04:00", v: 14 },
  { time: "08:00", v: 20 },
  { time: "12:00", v: 38 },
  { time: "16:00", v: 52 },
  { time: "20:00", v: 45 },
  { time: "24:00", v: 60 },
];

export function InContextSection({ content }: InContextSectionProps) {
  const [activeTab, setActiveTab] = useState<"team" | "employee">("team");
  const activeView = activeTab === "team" ? content.teamView : content.employeeView;

  return (
    <div
      id="in-context"
      className="scroll-mt-24 rounded-2xl border border-slate-200 p-5 sm:p-6"
    >
      <SectionHeader number={content.number} title={content.title} size="compact" />

      <div className="mt-2 flex gap-5 border-b border-slate-200">
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

      <div className="mt-3">
        <ProductMockup
          panelTitle={content.panelTitle}
          statusLabel={content.statusLabel}
          statusColor={activeView.statusColor}
          timestamp=""
          stats={activeView.stats}
        />

        <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3">
          <p className="text-xs font-semibold text-slate-500">{content.chartLabel}</p>
          <div className="mt-2 h-16">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ENGAGEMENT_TREND} margin={{ top: 6, right: 8, bottom: 0, left: 8 }}>
                <Line type="monotone" dataKey="v" stroke="#2F5FE0" strokeWidth={2} dot={false} />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={4}
                  height={16}
                  interval="preserveStartEnd"
                  minTickGap={20}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
