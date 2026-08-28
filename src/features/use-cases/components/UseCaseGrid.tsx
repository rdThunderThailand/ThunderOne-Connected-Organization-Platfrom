"use client";

import { UseCaseCard } from "./UseCaseCard";
import type { CardCopy, NoResultsCopy, UseCaseContent } from "../types";

type UseCaseGridProps = {
  items: UseCaseContent[];
  viewMode: "grid" | "list";
  cardCopy: CardCopy;
  noResults: NoResultsCopy;
};

export function UseCaseGrid({ items, viewMode, cardCopy, noResults }: UseCaseGridProps) {
  if (items.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-slate-200 py-16 text-center">
        <p className="text-base font-semibold text-brand-navy">{noResults.title}</p>
        <p className="mt-1 text-sm text-slate-500">{noResults.description}</p>
      </div>
    );
  }

  return (
    <div
      className={
        viewMode === "grid"
          ? "mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
          : "mt-6 flex flex-col gap-4"
      }
    >
      {items.map((item) => (
        <UseCaseCard key={item.id} item={item} cardCopy={cardCopy} viewMode={viewMode} />
      ))}
    </div>
  );
}
