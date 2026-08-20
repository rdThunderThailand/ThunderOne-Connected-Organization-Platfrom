import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Platform | ThunderOne",
  description: "One connected platform for experience, intelligence, integrations, and security.",
};

const pillars = [
  {
    title: "Experience",
    description: "A unified, intuitive experience for every employee, on any device.",
  },
  {
    title: "Intelligence & Automation",
    description: "Automate routine work and surface insights from across your organization.",
  },
  {
    title: "Integrations",
    description: "Connect ThunderOne to the tools your organization already relies on.",
  },
  {
    title: "Security",
    description: "Enterprise-grade security and access controls, built in from the ground up.",
  },
];

export default function PlatformPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <p className="text-sm font-semibold uppercase tracking-wider text-brand-blue">Platform</p>
      <h1 className="mt-3 max-w-2xl text-4xl font-bold text-brand-navy sm:text-5xl">
        One platform, every connection point
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-600">
        ThunderOne brings the experience, intelligence, integrations, and security your
        organization needs into a single platform.
      </p>

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
