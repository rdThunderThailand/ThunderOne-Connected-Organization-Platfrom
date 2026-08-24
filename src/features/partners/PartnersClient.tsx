"use client";

type PartnersClientProps = {
  eyebrow: string;
  heading: string;
  intro: string;
  integratorsTitle: string;
  integratorsBody: string;
  resellersTitle: string;
  resellersBody: string;
  technologyTitle: string;
  technologyBody: string;
};

export function PartnersClient({
  eyebrow,
  heading,
  intro,
  integratorsTitle,
  integratorsBody,
  resellersTitle,
  resellersBody,
  technologyTitle,
  technologyBody,
}: PartnersClientProps) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <p className="text-sm font-semibold uppercase tracking-wider text-brand-blue">{eyebrow}</p>
      <h1 className="mt-3 max-w-2xl text-4xl font-bold text-brand-navy sm:text-5xl">{heading}</h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-600">{intro}</p>

      <div className="mt-14 grid gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-brand-navy">{integratorsTitle}</h2>
          <p className="mt-2 text-sm text-slate-600">{integratorsBody}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-brand-navy">{resellersTitle}</h2>
          <p className="mt-2 text-sm text-slate-600">{resellersBody}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-brand-navy">{technologyTitle}</h2>
          <p className="mt-2 text-sm text-slate-600">{technologyBody}</p>
        </div>
      </div>
    </div>
  );
}
