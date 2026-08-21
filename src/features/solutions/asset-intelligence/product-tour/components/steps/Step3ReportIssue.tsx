// === Step 3 content: "Report Issue" — the one step with a full design.
// Left: phone mockup showing the asset's detail screen. Right: the report
// form card, wired to local mock state from ProductTourClient (no backend
// call — submitting just flips to the green success state). ===

import { CheckCircle2, ImagePlus } from "lucide-react";
import { PhoneFrame } from "../PhoneFrame";
import type { TourAssetContent, TourStep3Content } from "../../types";

export type Step3FormState = {
  issueType: string;
  urgency: string;
  details: string;
  photoCount: number;
  submitted: boolean;
};

type Step3ReportIssueProps = {
  content: TourStep3Content;
  asset: TourAssetContent;
  formState: Step3FormState;
  onIssueTypeChange: (value: string) => void;
  onUrgencyChange: (value: string) => void;
  onDetailsChange: (value: string) => void;
  onAddPhoto: () => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export function Step3ReportIssue({
  content,
  asset,
  formState,
  onIssueTypeChange,
  onUrgencyChange,
  onDetailsChange,
  onAddPhoto,
  onSubmit,
  onCancel,
}: Step3ReportIssueProps) {
  const { phone, form } = content;
  const assetRows = [asset.location, asset.category, asset.assetId, asset.age, asset.value];

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      {/* Left: phone mockup of the asset detail screen this scenario starts from */}
      <div className="mx-auto lg:mx-0">
        <PhoneFrame>
          <p className="text-center text-[11px] font-semibold text-slate-500">{phone.headerTitle}</p>

          <div className="mt-3 rounded-xl border border-slate-100 p-3">
            <div className="flex items-center gap-2">
              {/* TODO: replace with real asset photo */}
              <div
                role="img"
                aria-label="Air conditioner unit photo placeholder"
                className="h-9 w-9 shrink-0 rounded-lg bg-gradient-to-br from-blue-200 to-slate-400"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-bold text-brand-navy">{asset.id}</p>
                <p className="truncate text-[10px] text-slate-400">{asset.name}</p>
              </div>
              <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-semibold text-emerald-600">
                {asset.statusActive}
              </span>
            </div>

            <dl className="mt-3 space-y-2 border-t border-slate-100 pt-3">
              {assetRows.map((row) => (
                <div key={row.label} className="flex items-center justify-between text-[10px]">
                  <dt className="text-slate-400">{row.label}</dt>
                  <dd className="font-semibold text-slate-700">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <span className="mt-3 block rounded-full bg-brand-blue py-2 text-center text-[11px] font-semibold text-white">
            {phone.reportButton}
          </span>
        </PhoneFrame>
      </div>

      {/* Right: the report-issue form card */}
      <div className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-brand-navy">{form.title}</h3>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600" htmlFor="tour-issue-type">
              {form.issueTypeLabel}
            </label>
            <select
              id="tour-issue-type"
              value={formState.issueType}
              onChange={(event) => onIssueTypeChange(event.target.value)}
              disabled={formState.submitted}
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 disabled:opacity-60"
            >
              <option value={form.issueTypePlaceholder}>{form.issueTypePlaceholder}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600" htmlFor="tour-urgency">
              {form.urgencyLabel}
            </label>
            <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
              <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" aria-hidden="true" />
              <select
                id="tour-urgency"
                value={formState.urgency}
                onChange={(event) => onUrgencyChange(event.target.value)}
                disabled={formState.submitted}
                className="w-full text-sm text-slate-700 outline-none disabled:opacity-60"
              >
                <option value={form.urgencyHigh}>{form.urgencyHigh}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600" htmlFor="tour-details">
              {form.detailsLabel}
            </label>
            <textarea
              id="tour-details"
              rows={3}
              value={formState.details}
              onChange={(event) => onDetailsChange(event.target.value)}
              disabled={formState.submitted}
              className="mt-1.5 w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 disabled:opacity-60"
            />
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-600">{form.photosLabel}</p>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {Array.from({ length: formState.photoCount }).map((_, index) => (
                // TODO: replace with real attached-photo thumbnails
                <div
                  key={index}
                  role="img"
                  aria-label="Attached photo placeholder"
                  className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-100 text-slate-400"
                >
                  <ImagePlus className="h-5 w-5" />
                </div>
              ))}
              <button
                type="button"
                onClick={onAddPhoto}
                disabled={formState.submitted}
                className="flex h-14 w-14 items-center justify-center rounded-lg border border-dashed border-slate-300 text-[10px] font-semibold text-slate-500 hover:border-brand-blue hover:text-brand-blue disabled:opacity-60"
              >
                {form.addPhotoButton}
              </button>
            </div>
          </div>

          {!formState.submitted && (
            <p className="rounded-lg bg-blue-50 px-3 py-2.5 text-xs text-brand-blue">{form.infoNote}</p>
          )}

          {formState.submitted ? (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-emerald-700">{form.successTitle}</p>
                  <p className="mt-1 text-xs text-emerald-600">{form.successDescription}</p>
                  <a href="#" className="mt-2 inline-block text-xs font-semibold text-emerald-700 hover:underline">
                    {form.successLink}
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 rounded-full border border-brand-navy px-4 py-2.5 text-sm font-semibold text-brand-navy hover:bg-slate-50"
              >
                {form.cancelButton}
              </button>
              <button
                type="button"
                onClick={onSubmit}
                className="flex-1 rounded-full bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                {form.submitButton}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
