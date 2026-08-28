"use client";

// === Request ThunderOne Demo — form (CRM PoC #1, Website → CRM) ===
//
// TEMPORARY (Decision A): this is a standalone PoC surface. The real
// target is to fold these fields into the existing "Talk to us" wizard
// (src/components/talk-to-us/*) once the backend flow is proven. Built as
// a separate page so the polished wizard isn't destabilized mid-PoC.
//
// The form posts Thunder's CANONICAL payload (see
// @/features/crm/canonical) as JSON to POST /api/crm/lead. It never talks
// to a CRM directly and never sees CRM field names.

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Lock } from "lucide-react";
import {
  type CanonicalLeadPayload,
  INTERESTED_SOLUTIONS,
  type InterestedSolution,
} from "@/features/crm/canonical";

export type RequestDemoCopy = {
  eyebrow: string;
  heading: string;
  intro: string;
  pocNote: string;
  fields: {
    firstName: string;
    lastName: string;
    company: string;
    position: string;
    mobile: string;
    email: string;
    interest: string;
    message: string;
  };
  messagePlaceholder: string;
  solutions: Record<InterestedSolution, string>;
  consentLabel: string;
  confidentialNote: string;
  submit: string;
  submitting: string;
  errors: { required: string; email: string; interest: string; consent: string };
  successTitle: string;
  successBody: string;
  successRef: string;
  errorTitle: string;
  errorBody: string;
};

type FormState = {
  first_name: string;
  last_name: string;
  company_name: string;
  position: string;
  mobile: string;
  email: string;
  // TEMPORARY (D-01): single-select for now. The canonical payload and
  // the HubSpot mapper already handle an array + merge; switching to
  // multi-select here means turning this into a Set and dropping the
  // "one at a time" click handler.
  interested_solution: InterestedSolution | null;
  inquiry_message: string;
  consent: boolean;
};

const EMPTY_FORM: FormState = {
  first_name: "",
  last_name: "",
  company_name: "",
  position: "",
  mobile: "",
  email: "",
  interested_solution: null,
  inquiry_message: "",
  consent: false,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "submitting" | "success" | "error";
type FieldErrors = Partial<Record<keyof FormState, string>>;

export function RequestDemoClient({ copy }: { copy: RequestDemoCopy }) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<{ crmContactId: string; action: string } | null>(null);

  // TEMPORARY (D-14): captures UTM from the URL at mount, not first-touch
  // on landing. `source` is hard-coded "website" for this PoC surface.
  const acquisitionRef = useRef<CanonicalLeadPayload["acquisition"]>({
    source: "website",
    medium: null,
    campaign: null,
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    landing_page: null,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const get = (key: string) => params.get(key) || null;
    acquisitionRef.current = {
      source: "website",
      medium: null,
      campaign: get("campaign"),
      utm_source: get("utm_source"),
      utm_medium: get("utm_medium"),
      utm_campaign: get("utm_campaign"),
      landing_page: window.location.pathname,
    };
  }, []);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (!form.first_name.trim()) next.first_name = copy.errors.required;
    if (!form.last_name.trim()) next.last_name = copy.errors.required;
    if (!form.company_name.trim()) next.company_name = copy.errors.required;
    if (!form.position.trim()) next.position = copy.errors.required;
    if (!form.mobile.trim()) next.mobile = copy.errors.required;
    if (!form.email.trim()) next.email = copy.errors.required;
    else if (!EMAIL_RE.test(form.email.trim())) next.email = copy.errors.email;
    if (!form.interested_solution) next.interested_solution = copy.errors.interest;
    if (!form.consent) next.consent = copy.errors.consent;
    return next;
  }

  function buildPayload(): CanonicalLeadPayload {
    return {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      company_name: form.company_name.trim(),
      position: form.position.trim(),
      mobile: form.mobile.trim(),
      email: form.email.trim(),
      interested_solutions: form.interested_solution ? [form.interested_solution] : [],
      inquiry_message: form.inquiry_message.trim(),
      consent: {
        status: form.consent ? "granted" : "denied",
        purpose: "sales_contact",
        source: "website",
        timestamp: new Date().toISOString(),
      },
      acquisition: acquisitionRef.current,
    };
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.values(found).some(Boolean)) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/crm/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        setResult({ crmContactId: json.crmContactId, action: json.action });
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success" && result) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-brand-blue" />
        <h1 className="mt-4 text-2xl font-bold text-brand-navy">{copy.successTitle}</h1>
        <p className="mt-2 text-slate-600">{copy.successBody}</p>
        <p className="mt-6 inline-block rounded-lg bg-slate-100 px-3 py-1.5 font-mono text-xs text-slate-500">
          {copy.successRef}: {result.crmContactId} ({result.action})
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-wider text-brand-blue">
        {copy.eyebrow}
      </p>
      <h1 className="mt-3 text-3xl font-bold text-brand-navy sm:text-4xl">{copy.heading}</h1>
      <p className="mt-3 text-slate-600">{copy.intro}</p>
      <p className="mt-2 text-xs text-slate-400">{copy.pocNote}</p>

      <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-6" noValidate>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            label={copy.fields.firstName}
            value={form.first_name}
            error={errors.first_name}
            onChange={(value) => update("first_name", value)}
            autoComplete="given-name"
          />
          <Field
            label={copy.fields.lastName}
            value={form.last_name}
            error={errors.last_name}
            onChange={(value) => update("last_name", value)}
            autoComplete="family-name"
          />
          <Field
            label={copy.fields.company}
            value={form.company_name}
            error={errors.company_name}
            onChange={(value) => update("company_name", value)}
            autoComplete="organization"
          />
          <Field
            label={copy.fields.position}
            value={form.position}
            error={errors.position}
            onChange={(value) => update("position", value)}
            autoComplete="organization-title"
          />
          <Field
            label={copy.fields.mobile}
            value={form.mobile}
            error={errors.mobile}
            onChange={(value) => update("mobile", value)}
            type="tel"
            autoComplete="tel"
          />
          <Field
            label={copy.fields.email}
            value={form.email}
            error={errors.email}
            onChange={(value) => update("email", value)}
            type="email"
            autoComplete="email"
          />
        </div>

        <fieldset>
          <legend className="text-sm font-semibold text-brand-navy">{copy.fields.interest}</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {INTERESTED_SOLUTIONS.map((slug) => {
              const selected = form.interested_solution === slug;
              return (
                <button
                  key={slug}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => update("interested_solution", slug)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    selected
                      ? "border-brand-blue bg-brand-blue text-white"
                      : "border-slate-200 text-slate-600 hover:border-brand-blue/50 hover:text-brand-blue"
                  }`}
                >
                  {copy.solutions[slug]}
                </button>
              );
            })}
          </div>
          {errors.interested_solution && (
            <p className="mt-2 text-xs text-red-600">{errors.interested_solution}</p>
          )}
        </fieldset>

        <div>
          <label htmlFor="inquiry_message" className="text-sm font-semibold text-brand-navy">
            {copy.fields.message}
          </label>
          <textarea
            id="inquiry_message"
            value={form.inquiry_message}
            onChange={(event) => update("inquiry_message", event.target.value)}
            placeholder={copy.messagePlaceholder}
            rows={4}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-brand-blue"
          />
        </div>

        <div>
          <label className="flex items-start gap-2.5 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={form.consent}
              onChange={(event) => update("consent", event.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
            />
            <span>{copy.consentLabel}</span>
          </label>
          {errors.consent && <p className="mt-2 text-xs text-red-600">{errors.consent}</p>}
        </div>

        {status === "error" && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <p className="font-semibold">{copy.errorTitle}</p>
            <p className="mt-0.5">{copy.errorBody}</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <p className="flex items-center gap-1.5 text-xs text-slate-500">
            <Lock className="h-3.5 w-3.5 shrink-0" />
            {copy.confidentialNote}
          </p>
          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full rounded-full bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-blue/90 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 sm:w-auto sm:self-start sm:px-8"
          >
            {status === "submitting" ? copy.submitting : copy.submit}
          </button>
        </div>
      </form>
    </div>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
};

function Field({ label, value, onChange, error, type = "text", autoComplete }: FieldProps) {
  return (
    <div>
      <label className="text-sm font-semibold text-brand-navy">
        {label}
        <input
          type={type}
          value={value}
          autoComplete={autoComplete}
          onChange={(event) => onChange(event.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-normal text-slate-800 outline-none focus:border-brand-blue"
        />
      </label>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}
