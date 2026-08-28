"use client";

import { Link } from "@/i18n/navigation";
import { ICON_BADGE_CLASSES, TAG_CLASSES } from "../colorStyles";
import { ICONS } from "../iconRegistry";
import type { CardCopy, UseCaseContent } from "../types";

type UseCaseCardProps = {
  item: UseCaseContent;
  cardCopy: CardCopy;
  viewMode: "grid" | "list";
};

export function UseCaseCard({ item, cardCopy, viewMode }: UseCaseCardProps) {
  const Icon = ICONS[item.icon];
  const isList = viewMode === "list";

  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md ${
        isList ? "flex gap-5 sm:items-start" : "flex flex-col"
      }`}
    >
      <div className={isList ? "min-w-0 flex-1" : "flex flex-1 flex-col"}>
        {item.featured && (
          <div className="mb-2 flex justify-end">
            <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
              {cardCopy.featured}
            </span>
          </div>
        )}
        <div className="flex items-center gap-3">
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${ICON_BADGE_CLASSES[item.color]}`}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <h3 className="text-base font-bold text-brand-navy">{item.title}</h3>
        </div>
        <p className="mt-3 text-sm text-slate-500">{item.description}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag.id}
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${TAG_CLASSES[tag.color]}`}
            >
              {tag.label}
            </span>
          ))}
        </div>

        <Link
          href={item.href}
          className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-semibold text-brand-blue hover:underline"
        >
          {cardCopy.seeDetails}
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
