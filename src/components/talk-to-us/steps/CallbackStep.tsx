"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTalkToUsStore } from "@/store/talkToUsStore";

// TODO: confirm with design — the source design only shows the LINE/
// callback choice screen (Step 3), not a phone-entry screen. This minimal
// phone + optional preferred-time sub-step is a placeholder so the
// "ฝากเบอร์ติดต่อ" choice has somewhere to go before Step 4 (Confirmation).
export function CallbackStep() {
  const t = useTranslations("TalkToUsPanel.callbackForm");
  const submitCallback = useTalkToUsStore((s) => s.submitCallback);
  const [phone, setPhone] = useState("");
  const [preferredTime, setPreferredTime] = useState("");

  const isValid = /^0\d{8,9}$/.test(phone.trim());

  return (
    <div className="flex flex-col gap-5">
      <div>
        <label htmlFor="talk-to-us-phone" className="text-sm font-semibold text-brand-navy">
          {t("phoneLabel")}
        </label>
        <input
          id="talk-to-us-phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder={t("phonePlaceholder")}
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-brand-blue"
        />
      </div>

      <div>
        <label
          htmlFor="talk-to-us-preferred-time"
          className="text-sm font-semibold text-brand-navy"
        >
          {t("preferredTimeLabel")}
        </label>
        <select
          id="talk-to-us-preferred-time"
          value={preferredTime}
          onChange={(event) => setPreferredTime(event.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-brand-blue"
        >
          <option value="">{t("preferredTimeOptions.any")}</option>
          <option value="morning">{t("preferredTimeOptions.morning")}</option>
          <option value="afternoon">{t("preferredTimeOptions.afternoon")}</option>
          <option value="evening">{t("preferredTimeOptions.evening")}</option>
        </select>
      </div>

      <div className="mt-2 flex flex-col gap-3">
        <p className="flex items-center gap-1.5 text-xs text-slate-500">
          <Lock className="h-3.5 w-3.5 shrink-0" />
          {t("confidentialNote")}
        </p>
        <button
          type="button"
          disabled={!isValid}
          onClick={() => submitCallback(phone.trim(), preferredTime || null)}
          className="w-full rounded-full bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
        >
          {t("submit")}
        </button>
      </div>
    </div>
  );
}
