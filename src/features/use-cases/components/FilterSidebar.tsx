"use client";

import { RefreshCw, X } from "lucide-react";
import { FilterGroup } from "./FilterGroup";
import type { FilterCopy, FilterGroupContent, FilterGroupKey } from "../types";

type FilterSidebarProps = {
  groups: FilterGroupContent[];
  selected: Record<FilterGroupKey, string[]>;
  onToggleOption: (group: FilterGroupKey, optionId: string) => void;
  onClearAll: () => void;
  onReset: () => void;
  copy: FilterCopy;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
};

export function FilterSidebar({
  groups,
  selected,
  onToggleOption,
  onClearAll,
  onReset,
  copy,
  isMobileOpen,
  onCloseMobile,
}: FilterSidebarProps) {
  return (
    <>
      {isMobileOpen && (
        <button
          type="button"
          aria-label={copy.title}
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
        />
      )}

      <aside
        className={`z-50 h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-6 lg:block ${
          isMobileOpen ? "fixed inset-x-4 top-6 block" : "hidden"
        }`}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-brand-navy">{copy.title}</h2>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClearAll}
              className="text-sm font-semibold text-brand-blue hover:underline"
            >
              {copy.clearAll}
            </button>
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Close"
              className="text-slate-400 hover:text-slate-600 lg:hidden"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="mt-5 space-y-6">
          {groups.map((group) => (
            <FilterGroup
              key={group.key}
              group={group}
              selectedIds={selected[group.key]}
              onToggle={(optionId) => onToggleOption(group.key, optionId)}
              moreLabel={copy.more}
              lessLabel={copy.less}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={onReset}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          {copy.reset}
        </button>
      </aside>
    </>
  );
}
