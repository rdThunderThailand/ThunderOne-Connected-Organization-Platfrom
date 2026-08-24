import type { LucideIcon } from "lucide-react";
import { Boxes, Headset, HelpCircle, Megaphone, Monitor } from "lucide-react";
import type { TopicKey } from "../types";

export type TopicConfig = {
  key: TopicKey;
  icon: LucideIcon;
};

// Icons reuse the same mapping as the homepage solutions grid
// (SolutionsGridSection) so the pillar iconography stays consistent
// site-wide. Labels/descriptions live in messages/{th,en}/talk-to-us.json
// under `topic.items.<key>`.
export const TOPICS: TopicConfig[] = [
  { key: "digital-signage", icon: Monitor },
  { key: "thunder-care", icon: Headset },
  { key: "communication", icon: Megaphone },
  { key: "asset-intelligence", icon: Boxes },
  { key: "not-sure", icon: HelpCircle },
];
