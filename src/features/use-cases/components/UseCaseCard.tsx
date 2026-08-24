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
      className={`relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md ${
        isList ? "flex gap-5 sm:items-start" : "flex flex-col"
      }`}
    >
      {item.featured && (
        <span className="absolute right-4 top-4 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
          {cardCopy.featured}
        </span>
      )}

      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${ICON_BADGE_CLASSES[item.color]}`}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>

      <div className={isList ? "min-w-0 flex-1" : "mt-4 flex flex-1 flex-col"}>
        <h3 className="pr-16 text-base font-bold text-brand-navy">{item.title}</h3>
        <p className="mt-2 text-sm text-slate-500">{item.description}</p>

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
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-blue hover:underline"
        >
          {cardCopy.seeDetails}
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
