import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partners | ThunderOne",
  description: "Partner with ThunderOne to bring connected workplace experiences to more organizations.",
};

export default function PartnersPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <p className="text-sm font-semibold uppercase tracking-wider text-brand-blue">Partners</p>
      <h1 className="mt-3 max-w-2xl text-4xl font-bold text-brand-navy sm:text-5xl">
        Partner with ThunderOne
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-600">
        We work with system integrators, resellers, and technology providers to bring connected,
        empowered workplace experiences to more organizations.
      </p>

      <div className="mt-14 grid gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-brand-navy">Integrators</h2>
          <p className="mt-2 text-sm text-slate-600">
            Deploy ThunderOne as part of your workplace and facility solutions.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-brand-navy">Resellers</h2>
          <p className="mt-2 text-sm text-slate-600">
            Bring ThunderOne to your customers with dedicated partner support.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-brand-navy">Technology Partners</h2>
          <p className="mt-2 text-sm text-slate-600">
            Build integrations that connect ThunderOne to the tools organizations already use.
          </p>
        </div>
      </div>
    </div>
  );
}
