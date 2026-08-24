"use client";

import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTalkToUsStore } from "@/store/talkToUsStore";
import { QUESTIONS_BY_TOPIC } from "../config/questions";
import type { TopicKey } from "../types";

export function ConfirmationStep() {
  const t = useTranslations("TalkToUsPanel");
  const selectedTopic = useTalkToUsStore((s) => s.selectedTopic) as TopicKey | null;
  const answers = useTalkToUsStore((s) => s.answers);
  const selectedChannel = useTalkToUsStore((s) => s.selectedChannel);
  const contactPhone = useTalkToUsStore((s) => s.contactPhone);
  const close = useTalkToUsStore((s) => s.close);

  const summaryRows: { label: string; value: string }[] = [];

  if (selectedTopic) {
    summaryRows.push({
      label: t("confirmation.topicLabel"),
      value: t(`topic.items.${selectedTopic}.label`),
    });

    for (const question of QUESTIONS_BY_TOPIC[selectedTopic]) {
      const value = answers[question.id];
      if (!value) continue;
      summaryRows.push({
        label: t(`questions.sets.${selectedTopic}.${question.id}.label`),
        value: t(`questions.sets.${selectedTopic}.${question.id}.options.${value}`),
      });
    }
  }

  if (selectedChannel) {
    summaryRows.push({
      label: t("confirmation.channelLabel"),
      value: t(`confirmation.channelValues.${selectedChannel}`),
    });
  }

  if (selectedChannel === "callback" && contactPhone) {
    summaryRows.push({ label: t("confirmation.phoneLabel"), value: contactPhone });
  }

  return (
    <div className="flex flex-col items-center px-1 py-6 text-center">
      {/* Simple checkmark for now — swap in a confetti/celebration
          animation later if an animation library is added to the project. */}
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 animate-[pop-in_0.4s_ease-out]">
        <CheckCircle2 className="h-9 w-9" />
      </span>

      <h2 className="mt-5 text-xl font-bold text-brand-navy">{t("confirmation.title")}</h2>
      <p className="mt-2 text-sm text-slate-500">{t("confirmation.description")}</p>

      <div className="mt-6 w-full rounded-2xl border border-slate-200 p-4 text-left">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {t("confirmation.summaryTitle")}
        </p>
        <dl className="mt-3 flex flex-col gap-2.5">
          {summaryRows.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-4 text-sm">
              <dt className="text-slate-500">{row.label}</dt>
              <dd className="text-right font-semibold text-brand-navy">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <button
        type="button"
        onClick={close}
        className="mt-8 w-full rounded-full border border-brand-navy px-5 py-2.5 text-sm font-semibold text-brand-navy hover:bg-slate-50"
      >
        {t("confirmation.backHome")}
      </button>
    </div>
  );
}
