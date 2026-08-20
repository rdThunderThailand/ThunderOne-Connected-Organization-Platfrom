import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | ThunderOne",
  description: "ThunderOne empowers people and connects organizations.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <p className="text-sm font-semibold uppercase tracking-wider text-brand-blue">About</p>
      <h1 className="mt-3 max-w-2xl text-4xl font-bold text-brand-navy sm:text-5xl">
        Empowered People. Connected Organization.
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-600">
        ThunderOne builds the platform that keeps organizations informed, connected, and running
        smoothly, from the frontline to the front office.
      </p>

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-brand-navy">Our mission</h2>
          <p className="mt-2 text-sm text-slate-600">
            To give every organization the tools to keep its people informed, connected, and
            empowered, wherever they work.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-brand-navy">Get in touch</h2>
          <p className="mt-2 text-sm text-slate-600">
            Want to learn more about ThunderOne? Reach out and our team will be happy to help.
          </p>
        </div>
      </div>
    </div>
  );
}
