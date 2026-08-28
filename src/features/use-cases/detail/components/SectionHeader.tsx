// === Shared numbered section header: small circular "01"-style badge next
// to a title, used by every full-width section (01-09) on a use case detail
// page. Scoped to src/features/use-cases/detail/ for now — promote to
// src/components/ui/ only if a page outside use-cases ever needs it. ===

type SectionHeaderProps = {
  number: string;
  title: string;
  subtitle?: string;
  className?: string;
  // "compact" shrinks the badge + title for use inside the narrow
  // 3-column card row (In Context / Who's Involved / Connects).
  size?: "default" | "compact";
};

export function SectionHeader({
  number,
  title,
  subtitle,
  className = "",
  size = "default",
}: SectionHeaderProps) {
  const isCompact = size === "compact";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span
        className={`flex shrink-0 items-center justify-center rounded-full bg-brand-blue font-bold text-white ${
          isCompact ? "h-8 w-8 text-xs" : "h-9 w-9 text-sm"
        }`}
      >
        {number}
      </span>
      <h2
        className={`font-bold text-brand-navy ${
          isCompact ? "text-lg sm:text-xl" : "text-xl sm:text-xl"
        }`}
      >
        {title}
        {subtitle && <span className="ml-2 text-base font-medium text-slate-400">{subtitle}</span>}
      </h2>
    </div>
  );
}
