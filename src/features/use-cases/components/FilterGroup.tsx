"use client";

import { useState } from "react";
import type { FilterGroupContent } from "../types";

type FilterGroupProps = {
  group: FilterGroupContent;
  selectedIds: string[];
  onToggle: (optionId: string) => void;
  moreLabel: string;
  lessLabel: string;
};

export function FilterGroup({ group, selectedIds, onToggle, moreLabel, lessLabel }: FilterGroupProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleOptions = isExpanded ? group.options : group.options.slice(0, group.visibleCount);
  const hasMore = group.options.length > group.visibleCount;

  return (
    <div id={`by-${group.key}`} className="scroll-mt-24">
      <h3 className="text-sm font-bold text-brand-navy">{group.title}</h3>
      <div className="mt-3 space-y-2.5">
        {visibleOptions.map((option) => (
          <label key={option.id} className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={selectedIds.includes(option.id)}
              onChange={() => onToggle(option.id)}
              className="h-4 w-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
            />
            {option.label}
          </label>
        ))}
      </div>
      {hasMore && (
        <button
          type="button"
          onClick={() => setIsExpanded((expanded) => !expanded)}
          className="mt-2.5 text-sm font-semibold text-brand-blue hover:underline"
        >
          {isExpanded ? lessLabel : moreLabel}
        </button>
      )}
    </div>
  );
}
