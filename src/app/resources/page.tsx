import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources | ThunderOne",
  description: "Knowledge, customer stories, documentation, and support from ThunderOne.",
};

const resources = [
  {
    title: "Knowledge",
    description: "Guides and best practices for getting the most out of ThunderOne.",
  },
  {
    title: "Customer Stories",
    description: "See how other organizations connect and empower their people with ThunderOne.",
  },
  {
    title: "Documentation",
    description: "Technical references and setup guides for building on ThunderOne.",
  },
  {
    title: "Support",
    description: "Get help from the ThunderOne team whenever you need it.",
  },
];

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <p className="text-sm font-semibold uppercase tracking-wider text-brand-blue">Resources</p>
      <h1 className="mt-3 max-w-2xl text-4xl font-bold text-brand-navy sm:text-5xl">
        Everything you need to succeed
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-600">
        Guides, stories, and documentation to help your team get the most out of ThunderOne.
      </p>

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {resources.map((item) => (
          <div key={item.title} className="rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-brand-navy">{item.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
