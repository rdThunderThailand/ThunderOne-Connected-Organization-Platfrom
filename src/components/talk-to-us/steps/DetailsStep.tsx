"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTalkToUsStore } from "@/store/talkToUsStore";
import { FIRMOGRAPHIC_FIELDS, PREFERRED_TIME_OPTIONS } from "../config/details";
import { OptionPill } from "../ui/OptionPill";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactKey = "firstName" | "lastName" | "companyName" | "email" | "mobile";
type FieldErrors = Partial<Record<string, string>>;

export function DetailsStep() {
  const t = useTranslations("TalkToUsPanel.details");

  const state = useTalkToUsStore((s) => s);
  const setDetail = useTalkToUsStore((s) => s.setDetail);
  const setConsent = useTalkToUsStore((s) => s.setConsent);
  const submitLead = useTalkToUsStore((s) => s.submitLead);
  const submitStatus = useTalkToUsStore((s) => s.submitStatus);

  const [errors, setErrors] = useState<FieldErrors>({});

  const firmographicValues: Record<string, string> = {
    position: state.position,
    industry: state.industry,
    orgSize: state.orgSize,
  };

  const contactFields: { key: ContactKey; autoComplete: string; type?: string }[] = [
    { key: "firstName", autoComplete: "given-name" },
    { key: "lastName", autoComplete: "family-name" },
    { key: "companyName", autoComplete: "organization" },
    { key: "email", autoComplete: "email", type: "email" },
    { key: "mobile", autoComplete: "tel", type: "tel" },
  ];

  function clearError(key: string) {
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    for (const field of FIRMOGRAPHIC_FIELDS) {
      if (!firmographicValues[field.id]) next[field.id] = t("errors.required");
    }
    for (const { key } of contactFields) {
      if (!String(state[key]).trim()) next[key] = t("errors.required");
    }
    if (!next.email && !EMAIL_RE.test(state.email.trim())) next.email = t("errors.email");
    if (!state.consent) next.consent = t("errors.required");
    return next;
  }

  function handleSubmit() {
    const found = validate();
    setErrors(found);
    if (Object.values(found).some(Boolean)) return;
    void submitLead();
  }

  const submitting = submitStatus === "submitting";

  return (
    <div className="flex flex-col gap-7">
      {FIRMOGRAPHIC_FIELDS.map((field) => (
        <div key={field.id}>
          <p className="text-sm font-semibold text-brand-navy">
            {t(`firmographics.${field.id}.label`)}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {field.options.map((value) => (
              <OptionPill
                key={value}
                variant="pill"
                label={t(`firmographics.${field.id}.options.${value}`)}
                selected={firmographicValues[field.id] === value}
                onClick={() => {
                  setDetail(field.id as "position" | "industry" | "orgSize", value);
                  clearError(field.id);
                }}
              />
            ))}
          </div>
          {errors[field.id] && (
            <p className="mt-2 text-xs text-red-600">{errors[field.id]}</p>
          )}
        </div>
      ))}

      <div className="grid gap-5 sm:grid-cols-2">
        {contactFields.map(({ key, autoComplete, type }) => (
          <div key={key}>
            <label className="text-sm font-semibold text-brand-navy">
              {t(`contact.${key}`)}
              <input
                type={type ?? "text"}
                value={String(state[key])}
                autoComplete={autoComplete}
                onChange={(event) => {
                  setDetail(key, event.target.value);
                  clearError(key);
                }}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-normal text-slate-800 outline-none focus:border-brand-blue"
              />
            </label>
            {errors[key] && <p className="mt-1.5 text-xs text-red-600">{errors[key]}</p>}
          </div>
        ))}
      </div>

      <div>
        <p className="text-sm font-semibold text-brand-navy">{t("preferredTime.label")}</p>
        <p className="mt-0.5 text-xs text-slate-400">{t("preferredTime.optional")}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {PREFERRED_TIME_OPTIONS.map((value) => (
            <OptionPill
              key={value}
              variant="pill"
              label={t(`preferredTime.options.${value}`)}
              selected={state.preferredTime === value}
              onClick={() =>
                setDetail("preferredTime", state.preferredTime === value ? "" : value)
              }
            />
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-start gap-2.5 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={state.consent}
            onChange={(event) => {
              setConsent(event.target.checked);
              clearError("consent");
            }}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
          />
          <span>{t("consentLabel")}</span>
        </label>
        {errors.consent && <p className="mt-2 text-xs text-red-600">{errors.consent}</p>}
      </div>

      {submitStatus === "error" && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p className="font-semibold">{t("submitError.title")}</p>
          <p className="mt-0.5">{t("submitError.body")}</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <p className="flex items-center gap-1.5 text-xs text-slate-500">
          <Lock className="h-3.5 w-3.5 shrink-0" />
          {t("confidentialNote")}
        </p>
        <button
          type="button"
          disabled={submitting}
          onClick={handleSubmit}
          className="w-full rounded-full bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-blue/90 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
        >
          {submitting ? t("submitting") : t("submit")}
        </button>
      </div>
    </div>
  );
}
