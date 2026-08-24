"use client";

import { CategorySummaryCard } from "./CategorySummaryCard";
import type { CategorySummaryContent } from "../types";

type CategorySummaryCardsProps = {
  items: CategorySummaryContent[];
};

export function CategorySummaryCards({ items }: CategorySummaryCardsProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <CategorySummaryCard key={item.key} content={item} />
      ))}
    </div>
  );
}
