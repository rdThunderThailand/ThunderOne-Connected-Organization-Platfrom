"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import type { HeroContent } from "../types";

type HeroHeaderProps = {
  content: HeroContent;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onToggleMobileFilters: () => void;
};

export function HeroHeader({
  content,
  searchValue,
  onSearchChange,
  onToggleMobileFilters,
}: HeroHeaderProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="max-w-xl text-4xl font-bold leading-tight text-brand-navy sm:text-5xl">
            {content.titleLine1}
            <br />
            <span className="text-brand-blue">{content.titleHighlight}</span>
          </h1>
          <p className="mt-4 max-w-md text-base text-slate-500">{content.description}</p>
        </div>

        <div className="w-full max-w-md lg:w-96">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
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
        </div>
      </div>
    </div>
  );
}
