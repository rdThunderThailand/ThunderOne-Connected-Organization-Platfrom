// === Shared breadcrumb trail: small gray "Home > Current" style navigation,
// reusable across any page. Last item renders as plain text (current page),
// earlier items render as links. ===

import { Link } from "@/i18n/navigation";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-brand-blue hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "text-slate-500" : undefined}>{item.label}</span>
              )}
              {!isLast && <span aria-hidden="true">&gt;</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
