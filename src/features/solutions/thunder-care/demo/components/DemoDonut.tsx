// === DemoDonut: progress ring with a percentage in the middle, used by the
// demo step screens (onboarding progress, per-row readiness, etc.). ===

type DemoDonutProps = {
  percent: number;
  size?: number;
  label?: string;
  /** conic fill colour for the completed arc */
  color?: string;
};

export function DemoDonut({ percent, size = 88, label, color = "#22c55e" }: DemoDonutProps) {
  const compact = size < 60;

  return (
    <span
      className="relative flex shrink-0 items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        background: `conic-gradient(${color} ${percent}%, #e2e8f0 ${percent}% 100%)`,
      }}
      role="img"
      aria-label={`${percent}%${label ? ` ${label}` : ""}`}
    >
      <span className="flex h-[76%] w-[76%] flex-col items-center justify-center rounded-full bg-white text-center">
        <span
          className={`font-bold leading-none text-brand-navy ${compact ? "text-[10px]" : "text-base"}`}
        >
          {percent}%
        </span>
        {label && !compact && (
          <span className="mt-0.5 text-[8px] font-medium text-slate-400">{label}</span>
        )}
      </span>
    </span>
  );
}
