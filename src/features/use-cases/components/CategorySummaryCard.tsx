"use client";

import { Link } from "@/i18n/navigation";
import { ICON_BADGE_CLASSES } from "../colorStyles";
import { ICONS } from "../iconRegistry";
import type { CategorySummaryContent } from "../types";

type CategorySummaryCardProps = {
  content: CategorySummaryContent;
};

export function CategorySummaryCard({ content }: CategorySummaryCardProps) {
  const Icon = ICONS[content.icon];

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${ICON_BADGE_CLASSES[content.color]}`}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-brand-navy">{content.title}</p>
          <p className="truncate text-sm text-slate-500">{content.subtitle}</p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-1.5">
        {content.avatarIcons.map((iconKey, index) => {
          const AvatarIcon = ICONS[iconKey];
          return (
            <span
              key={iconKey}
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white ${ICON_BADGE_CLASSES[content.color]}`}
              style={{ marginLeft: index === 0 ? 0 : -10 }}
            >
              <AvatarIcon className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          );
        })}
        <span className="ml-2 text-xs font-medium text-slate-500">{content.countLabel}</span>
      </div>

      <Link
        href={content.href}
        className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-blue hover:underline"
      >
        {content.viewAllLabel}
        <span aria-hidden="true">&rarr;</span>
      </Link>
    </div>
  );
}
