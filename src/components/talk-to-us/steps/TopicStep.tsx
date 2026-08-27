"use client";

import { useTranslations } from "next-intl";
import { useTalkToUsStore } from "@/store/talkToUsStore";
import { TOPICS } from "../config/topics";
import { OptionPill } from "../ui/OptionPill";

export function TopicStep() {
  const t = useTranslations("TalkToUsPanel.topic");
  const selectedTopic = useTalkToUsStore((s) => s.selectedTopic);
  const selectTopic = useTalkToUsStore((s) => s.selectTopic);

  return (
    <div className="flex flex-col gap-3">
      {TOPICS.map((topic) => (
        <OptionPill
          key={topic.key}
          variant="row"
          icon={topic.icon}
          label={t(`items.${topic.key}.label`)}
          description={t(`items.${topic.key}.description`)}
          selected={selectedTopic === topic.key}
          disabled={!topic.enabled}
          onClick={() => selectTopic(topic.key)}
        />
      ))}
    </div>
  );
}
