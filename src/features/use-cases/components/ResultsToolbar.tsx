"use client";

import { LayoutGrid, List } from "lucide-react";
import type { SortOption, ToolbarContent } from "../types";

type ResultsToolbarProps = {
  showingText: string;
  toolbar: ToolbarContent;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
};

const SORT_ORDER: SortOption[] = ["relevant", "featured", "az"];

export function ResultsToolbar({
  showingText,
  toolbar,
  sortOption,
  onSortChange,
  viewMode,
  onViewModeChange,
}: ResultsToolbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-500">{showingText}</p>

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-slate-500">
          <span className="hidden sm:inline">{toolbar.sortByLabel}:</span>
          <select
            value={sortOption}
            onChange={(event) => onSortChange(event.target.value as SortOption)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 focus:border-brand-blue focus:outline-none"
          >
            {SORT_ORDER.map((option) => (
              <option key={option} value={option}>
                {toolbar.sortOptions[option]}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-center gap-1 rounded-lg border border-slate-200 p-1">
          <button
            type="button"
            aria-label={toolbar.viewGridLabel}
            aria-pressed={viewMode === "grid"}
            onClick={() => onViewModeChange("grid")}
            className={`rounded-md p-1.5 ${
              viewMode === "grid" ? "bg-brand-blue/10 text-brand-blue" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <LayoutGrid className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label={toolbar.viewListLabel}
            aria-pressed={viewMode === "list"}
            onClick={() => onViewModeChange("list")}
            className={`rounded-md p-1.5 ${
              viewMode === "list" ? "bg-brand-blue/10 text-brand-blue" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <List className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
