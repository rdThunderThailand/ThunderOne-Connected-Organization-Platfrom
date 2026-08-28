"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { CategorySummaryCards } from "./CategorySummaryCards";
import type { CategorySummaryContent, HeroContent } from "../types";

type HeroHeaderProps = {
  content: HeroContent;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onToggleMobileFilters: () => void;
  categorySummaries: CategorySummaryContent[];
};

export function HeroHeader({
  content,
  searchValue,
  onSearchChange,
  onToggleMobileFilters,
  categorySummaries,
}: HeroHeaderProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="lg:max-w-xs lg:shrink-0">
          <h1 className="text-4xl font-bold leading-tight text-brand-navy sm:text-4xl">
            {content.titleLine1}
            <br />
            <span className="text-brand-blue">{content.titleHighlight}</span>
          </h1>
          <p className="mt-4 max-w-md text-base text-slate-500">{content.description}</p>
        </div>

        <div className="w-full lg:flex-1">
          <div className="ml-auto flex w-full max-w-md items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <Search className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
            <input
              type="text"
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={content.searchPlaceholder}
              className="w-full min-w-0 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={onToggleMobileFilters}
              aria-label={content.filterButtonLabel}
              className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-brand-blue lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-6">
            <CategorySummaryCards items={categorySummaries} />
          </div>
        </div>
      </div>
    </div>
  );
}
