import type { CategorySummaryDefinition, FilterGroupDefinition } from "../types";

export const ROLE_GROUP: FilterGroupDefinition = {
  key: "role",
  visibleCount: 4,
  options: [
    { id: "executive-leadership" },
    { id: "manager" },
    { id: "operator-staff" },
    { id: "it-admin" },
    { id: "sales-marketing" },
    { id: "hr-people" },
  ],
};

export const NEED_GROUP: FilterGroupDefinition = {
  key: "need",
  visibleCount: 6,
  options: [
    { id: "communicate-engage" },
    { id: "operate-efficiently" },
    { id: "manage-assets" },
    { id: "provide-services" },
    { id: "ensure-compliance" },
    { id: "analyze-decide" },
    { id: "automate-workflows" },
    { id: "collaborate-teams" },
    { id: "monitor-performance" },
    { id: "secure-information" },
  ],
};

export const INDUSTRY_GROUP: FilterGroupDefinition = {
  key: "industry",
  visibleCount: 6,
  options: [
    { id: "government-public-sector" },
    { id: "healthcare" },
    { id: "education" },
    { id: "manufacturing" },
    { id: "retail-services" },
    { id: "real-estate-facilities" },
    { id: "hospitality-tourism" },
    { id: "transportation-logistics" },
  ],
};

export const FILTER_GROUPS: FilterGroupDefinition[] = [ROLE_GROUP, NEED_GROUP, INDUSTRY_GROUP];

export const CATEGORY_SUMMARIES: CategorySummaryDefinition[] = [
  {
    key: "role",
    icon: "briefcase",
    color: "blue",
    avatarIcons: ["user-round", "hard-hat", "user-cog", "headset", "users"],
    href: "/use-cases#by-role",
  },
  {
    key: "need",
    icon: "target",
    color: "green",
    avatarIcons: ["megaphone", "clipboard-check", "trending-up", "shield-check", "headset"],
    href: "/use-cases#by-need",
  },
  {
    key: "industry",
    icon: "building-2",
    color: "purple",
    avatarIcons: ["landmark", "hospital", "graduation-cap", "bar-chart-3", "shopping-bag"],
    href: "/use-cases#by-industry",
  },
];
