"use client";

// === Integration Section: badge + heading + description + "learn more"
// link on the left, a row of partner logos on the right whose dashed
// spokes converge onto a shared dashed line carrying the ThunderOne
// "shared context + AI" pill — same connector pattern as
// ProblemStatementSection's context-icon row ===

// Partner names/wordmarks are third-party trademarks, rendered here as
// simple text/color approximations (not official logo assets) purely to
// signal "integrates with" — same treatment Footer.tsx gives its social
// network labels. TODO: swap for each brand's official logo asset once
// cleared with their brand guidelines.

import type { ReactNode } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";
import thunderOneLogo from "@/components/logo/Horizontal TextBlack.svg";
import type { IntegrationContent } from "../types";

type IntegrationSectionProps = {
  content: IntegrationContent;
};

function SapMark() {
  return (
    <span className="inline-flex h-9 w-14 items-center justify-center rounded bg-[#0854A0] text-sm font-bold italic text-white">
      SAP
    </span>
  );
}

function OracleMark() {
  return (
    <span className="whitespace-nowrap text-base font-bold tracking-wide text-[#C74634]">
      ORACLE
    </span>
  );
}

function SalesforceMark() {
  return <span className="whitespace-nowrap text-base font-semibold text-[#00A1E0]">salesforce</span>;
}

function WorkdayMark() {
  return (
    <span className="relative inline-block whitespace-nowrap">
      <span className="absolute -top-2 left-1/2 h-2 w-6 -translate-x-1/2 rounded-t-full border-2 border-b-0 border-[#F7941D]" />
      <span className="text-base font-medium text-slate-800">workday.</span>
    </span>
  );
}

function Microsoft365Mark() {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="grid grid-cols-2 gap-0.5">
        <span className="h-2 w-2 bg-[#F25022]" />
        <span className="h-2 w-2 bg-[#7FBA00]" />
        <span className="h-2 w-2 bg-[#00A4EF]" />
        <span className="h-2 w-2 bg-[#FFB900]" />
      </span>
      <span className="whitespace-nowrap text-sm font-medium text-slate-700">Microsoft 365</span>
    </span>
  );
}

function GoogleWorkspaceMark() {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-medium">
      <span className="text-base font-semibold">
        <span className="text-[#4285F4]">G</span>
        <span className="text-[#EA4335]">o</span>
        <span className="text-[#FBBC05]">o</span>
        <span className="text-[#4285F4]">g</span>
        <span className="text-[#34A853]">l</span>
        <span className="text-[#EA4335]">e</span>
      </span>
      <span className="text-slate-600">Workspace</span>
    </span>
  );
}

const PARTNERS: { key: string; mark: ReactNode }[] = [
  { key: "sap", mark: <SapMark /> },
  { key: "oracle", mark: <OracleMark /> },
  { key: "salesforce", mark: <SalesforceMark /> },
  { key: "workday", mark: <WorkdayMark /> },
  { key: "microsoft365", mark: <Microsoft365Mark /> },
  { key: "googleWorkspace", mark: <GoogleWorkspaceMark /> },
];

export function IntegrationSection({ content }: IntegrationSectionProps) {
  return (
    <section className="bg-slate-50 py-16 sm:px-4 lg:py-20">
      <div className="mx-auto max-w-7xl rounded-3xl border border-slate-100 bg-white px-4 py-12 shadow-lg sm:px-6 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,300px)_1fr] lg:items-center">
          <div className="min-w-0">
            <span className="text-sm font-semibold uppercase tracking-wide text-brand-blue">
              {content.badge}
            </span>
            <h2 className="mt-4 text-3xl font-bold leading-snug text-brand-navy sm:text-4xl">
              {content.title}
            </h2>
            <p className="mt-4 wrap-break-word text-slate-600">{content.description}</p>
            <Link
              href="/platform"
              className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand-blue hover:underline"
            >
              {content.cta}
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <div className="min-w-0">
            <div className="overflow-x-auto">
              <div className="w-fit min-w-full">
                <div className="flex justify-between gap-2">
                  {PARTNERS.map((partner) => (
                    <div key={partner.key} className="flex shrink-0 flex-col items-center gap-3">
                      <span className="flex h-14 items-center justify-center rounded-2xl border border-slate-200 bg-white px-3.5 shadow-sm">
                        {partner.mark}
                      </span>
                      <span className="h-8 w-px border-l border-dashed border-slate-300" />
                    </div>
                  ))}

                  <div className="flex shrink-0 flex-col items-center gap-3">
                    <span className="flex h-14 items-center justify-center whitespace-nowrap px-3.5 text-sm font-semibold text-brand-navy">
                      {content.otherSystemsLabel}
                    </span>
                    <span className="h-8 w-px border-l border-dashed border-slate-300" />
                  </div>
                </div>

                <div className="relative border-t border-dashed border-slate-300 pb-8">
                  <span className="absolute left-1/2 top-0 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-brand-navy shadow-md">
                    <Image src={thunderOneLogo} alt="ThunderOne" className="h-4 w-auto" />
                    <span className="text-slate-300">&bull;</span>
                    <Sparkles className="h-4 w-4 text-brand-blue" />
                    {content.pillLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
