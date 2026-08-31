"use client";

import { Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTalkToUsStore } from "@/store/talkToUsStore";
import { QUESTIONS_BY_TOPIC } from "../config/questions";
import { OptionPill } from "../ui/OptionPill";

export function QuestionsStep() {
  const t = useTranslations("TalkToUsPanel.questions");
  const selectedTopic = useTalkToUsStore((s) => s.selectedTopic);
  const answers = useTalkToUsStore((s) => s.answers);
  const toggleAnswer = useTalkToUsStore((s) => s.toggleAnswer);
  const goToStep = useTalkToUsStore((s) => s.goToStep);

  if (!selectedTopic) return null;

  const questions = QUESTIONS_BY_TOPIC[selectedTopic];
  const allAnswered = questions.every((question) => (answers[question.id]?.length ?? 0) > 0);

  return (
    <div className="flex flex-col gap-8">
      {questions.map((question) => {
        const picked = answers[question.id] ?? [];
        return (
          <div key={question.id}>
            <p className="text-sm font-semibold text-brand-navy">
              {t(`sets.${selectedTopic}.${question.id}.label`)}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              {question.multi ? t("multiHint") : t("singleHint")}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {question.options.map((value) => (
                <OptionPill
                  key={value}
                  variant="pill"
                  label={t(`sets.${selectedTopic}.${question.id}.options.${value}`)}
                  selected={picked.includes(value)}
                  onClick={() => toggleAnswer(question.id, value, Boolean(question.multi))}
                />
              ))}
            </div>
          </div>
        );
      })}

      <div className="mt-2 flex flex-col gap-3">
        <p className="flex items-center gap-1.5 text-xs text-slate-500">
          <Lock className="h-3.5 w-3.5 shrink-0" />
          {t("confidentialNote")}
        </p>
        <button
          type="button"
          disabled={!allAnswered}
          onClick={() => goToStep("details")}
          className="w-full rounded-full bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
        >
          {t("next")}
        </button>
      </div>
    </div>
  );
}
