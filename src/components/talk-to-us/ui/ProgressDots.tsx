type ProgressDotsProps = {
  total: number;
  current: number;
};

export function ProgressDots({ total, current }: ProgressDotsProps) {
  return (
    <div className="flex items-center gap-1.5" role="presentation">
      {Array.from({ length: total }).map((_, index) => (
        <span
          key={index}
          className={`h-1.5 rounded-full transition-all ${
            index === current ? "w-6 bg-brand-blue" : "w-1.5 bg-slate-200"
          }`}
        />
      ))}
    </div>
  );
}
