"use client";

import { Lock, MessageCircle, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTalkToUsStore } from "@/store/talkToUsStore";
import { ChannelCard } from "../ui/ChannelCard";

export function ChannelStep() {
  const t = useTranslations("TalkToUsPanel.channel");
  const chooseLine = useTalkToUsStore((s) => s.chooseLine);
  const chooseCallback = useTalkToUsStore((s) => s.chooseCallback);

  return (
    <div className="flex flex-col gap-4">
      <ChannelCard
        icon={MessageCircle}
        title={t("line.title")}
        badge={t("line.badge")}
        checklist={[t("line.checklist1"), t("line.checklist2"), t("line.checklist3")]}
        ctaLabel={t("line.cta")}
        onCtaClick={chooseLine}
        tone="line"
      />

      <div className="flex items-center gap-3 text-xs font-medium text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        {t("or")}
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <ChannelCard
        icon={Phone}
        title={t("callback.title")}
        checklist={[t("callback.checklist1"), t("callback.checklist2")]}
        ctaLabel={t("callback.cta")}
        onCtaClick={chooseCallback}
        tone="default"
      />

      <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
        <Lock className="h-3.5 w-3.5 shrink-0" />
        {t("confidentialNote")}
      </p>
    </div>
  );
}
