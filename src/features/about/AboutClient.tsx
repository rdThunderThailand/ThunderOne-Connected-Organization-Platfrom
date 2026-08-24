"use client";

type AboutClientProps = {
  eyebrow: string;
  heading: string;
  intro: string;
  missionTitle: string;
  missionBody: string;
  contactTitle: string;
  contactBody: string;
};

export function AboutClient({
  eyebrow,
  heading,
  intro,
  missionTitle,
  missionBody,
  contactTitle,
  contactBody,
}: AboutClientProps) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <p className="text-sm font-semibold uppercase tracking-wider text-brand-blue">{eyebrow}</p>
      <h1 className="mt-3 max-w-2xl text-4xl font-bold text-brand-navy sm:text-5xl">{heading}</h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-600">{intro}</p>

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-brand-navy">{missionTitle}</h2>
          <p className="mt-2 text-sm text-slate-600">{missionBody}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-brand-navy">{contactTitle}</h2>
          <p className="mt-2 text-sm text-slate-600">{contactBody}</p>
        </div>
      </div>
    </div>
  );
}
