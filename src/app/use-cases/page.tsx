import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Use Cases | ThunderOne",
  description: "How organizations across industries use ThunderOne to connect their people.",
};

const useCases = [
  {
    title: "Corporate & Enterprise",
    description: "Align distributed teams and streamline internal communication across the enterprise.",
  },
  {
    title: "Retail & Hospitality",
    description: "Keep every location on-brand with synced signage, promotions, and staff updates.",
  },
  {
    title: "Manufacturing & Industrial",
    description: "Deliver safety alerts and operational updates directly to the shop floor.",
  },
  {
    title: "Healthcare",
    description: "Coordinate staff, facilities, and patient-facing information across every ward.",
  },
];

export default function UseCasesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <p className="text-sm font-semibold uppercase tracking-wider text-brand-blue">Use Cases</p>
      <h1 className="mt-3 max-w-2xl text-4xl font-bold text-brand-navy sm:text-5xl">
        Built for how your industry works
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-600">
        From the corporate office to the shop floor, ThunderOne adapts to how your people actually
        work.
      </p>

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {useCases.map((item) => (
          <div key={item.title} className="rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-brand-navy">{item.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
