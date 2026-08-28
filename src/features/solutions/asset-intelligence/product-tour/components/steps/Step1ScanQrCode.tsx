// === Step 1 content: "Scan QR Code" — placeholder, no real design supplied
// yet. Left: phone mockup showing a camera scan viewfinder. Right: card
// explaining the step with a couple of placeholder fields. ===

// TODO: replace with real design once available

import { ScanLine } from "lucide-react";
import { PhoneFrame } from "../PhoneFrame";
import type { TourPlaceholderStepContent } from "../../types";

type Step1ScanQrCodeProps = {
  content: TourPlaceholderStepContent;
};

export function Step1ScanQrCode({ content }: Step1ScanQrCodeProps) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <div className="mx-auto lg:mx-0">
        <PhoneFrame>
          <div className="flex flex-col items-center">
            <p className="text-center text-[11px] font-semibold text-slate-500">{content.phoneTitle}</p>
            <div className="relative mt-4 flex h-48 w-48 shrink-0 items-center justify-center rounded-2xl bg-slate-900">
              {/* TODO: replace with real camera viewfinder asset */}
              <div className="relative flex h-40 w-40 items-center justify-center">
                <span className="absolute left-0 top-0 h-6 w-6 rounded-tl-lg border-l-2 border-t-2 border-teal-400" />
                <span className="absolute right-0 top-0 h-6 w-6 rounded-tr-lg border-r-2 border-t-2 border-teal-400" />
                <span className="absolute bottom-0 left-0 h-6 w-6 rounded-bl-lg border-b-2 border-l-2 border-teal-400" />
                <span className="absolute bottom-0 right-0 h-6 w-6 rounded-br-lg border-b-2 border-r-2 border-teal-400" />
                <ScanLine className="h-10 w-10 text-teal-400" />
              </div>
            </div>
            <p className="mt-3 text-center text-[10px] text-slate-400">{content.phoneDescription}</p>
          </div>
        </PhoneFrame>
      </div>

      <div className="rounded-2xl border border-slate-200 p-6 shadow-sm bg-white ">
        <div> 
    <h3 className="text-base font-bold text-brand-navy">{content.cardTitle}</h3>
        <p className="mt-2 text-sm text-slate-600 ">{content.cardDescription}</p>

        <dl className="mt-5 space-y-3 border-t border-slate-100 pt-4">
          {content.fields.map((field) => (
            <div key={field.label} className="flex items-center justify-between gap-4 text-sm">
              <dt className="text-slate-500">{field.label}</dt>
              <dd className="font-medium text-slate-700">{field.value}</dd>
            </div>
          ))}
        </dl>

        <button
          type="button"
          disabled
          className="mt-6 w-full rounded-full bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white opacity-60"
        >
          {content.actionButton}
        </button>

        </div>
    

      </div>
    </div>
  );
}
