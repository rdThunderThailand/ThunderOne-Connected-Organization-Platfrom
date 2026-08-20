import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solutions | ThunderOne",
  description: "Solutions built around your people, from signage to asset intelligence.",
};

const solutions = [
  {
    title: "Digital Signage & Media",
    description:
      "Publish announcements, media, and campaigns to every screen across your sites from one place.",
  },
  {
    title: "Communication",
    description:
      "Reach every employee with targeted updates across channels, from desk to frontline.",
  },
  {
    title: "Thunder Care",
    description:
      "Keep facilities and workplace services running smoothly with proactive care workflows.",
  },
  {
    title: "Asset Intelligence",
    description: "Track, monitor, and optimize the assets that keep your organization running.",
  },
];

export default function SolutionsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <p className="text-sm font-semibold uppercase tracking-wider text-brand-blue">Solutions</p>
      <h1 className="mt-3 max-w-2xl text-4xl font-bold text-brand-navy sm:text-5xl">
        Solutions built around your people
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-600">
        Everything your organization needs to inform, connect, and empower its people, in one
        connected platform.
      </p>

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {solutions.map((item) => (
          <div key={item.title} className="rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-brand-navy">{item.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
