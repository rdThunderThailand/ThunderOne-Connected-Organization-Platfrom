"use client";

type Pillar = { title: string; description: string };

type PlatformClientProps = {
  eyebrow: string;
  heading: string;
  intro: string;
  pillars: Pillar[];
};

export function PlatformClient({ eyebrow, heading, intro, pillars }: PlatformClientProps) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <p className="text-sm font-semibold uppercase tracking-wider text-brand-blue">{eyebrow}</p>
      <h1 className="mt-3 max-w-2xl text-4xl font-bold text-brand-navy sm:text-5xl">{heading}</h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-600">{intro}</p>

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {pillars.map((item) => (
          <div key={item.title} className="rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-brand-navy">{item.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
