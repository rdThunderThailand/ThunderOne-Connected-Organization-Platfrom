// === Shared numbered section header: small circular "01"-style badge next
// to a title, used by every full-width section (01-09) on a use case detail
// page. Scoped to src/features/use-cases/detail/ for now — promote to
// src/components/ui/ only if a page outside use-cases ever needs it. ===

type SectionHeaderProps = {
  number: string;
  title: string;
  subtitle?: string;
  className?: string;
};

export function SectionHeader({ number, title, subtitle, className = "" }: SectionHeaderProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-blue text-sm font-bold text-white">
        {number}
      </span>
      <h2 className="text-2xl font-bold text-brand-navy sm:text-3xl">
        {title}
        {subtitle && <span className="ml-2 text-base font-medium text-slate-400">{subtitle}</span>}
      </h2>
    </div>
  );
}
