import type { LucideIcon } from "lucide-react";
import { Boxes, Headset, HelpCircle, Megaphone, Monitor } from "lucide-react";
import type { TopicKey } from "../types";

export type TopicConfig = {
  key: TopicKey;
  icon: LucideIcon;
  // Only enabled topics are selectable. The rest are shown greyed-out with
  // a "coming soon" badge until their real questions are finalised — flip
  // this to true once the topic has proper questions in questions.ts and
  // messages/{th,en}/talk-to-us.json under `questions.sets.<topic>`.
  enabled: boolean;
};

// Icons reuse the same mapping as the homepage solutions grid
// (SolutionsGridSection) so the pillar iconography stays consistent
// site-wide. Labels/descriptions live in messages/{th,en}/talk-to-us.json
// under `topic.items.<key>`.
export const TOPICS: TopicConfig[] = [
  { key: "digital-signage", icon: Monitor, enabled: true },
  { key: "thunder-care", icon: Headset, enabled: true },
  { key: "communication", icon: Megaphone, enabled: true },
  { key: "asset-intelligence", icon: Boxes, enabled: true },
  { key: "not-sure", icon: HelpCircle, enabled: true },
];
