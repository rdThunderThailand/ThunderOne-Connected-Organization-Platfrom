import type { QuestionConfig, TopicKey } from "../types";

// Structural config only — question/option labels for display live in
// messages/{th,en}/talk-to-us.json under `questions.sets.<topic>.<id>`.
// The English strings serialized into the CRM payload live separately in
// ./crmLabels.ts (kept apart so marketing copy edits never move CRM data).
//
// Question set + option values are taken verbatim from
// docs/CRM/question.md ขั้นที่ 2 (2026-08-31). `multi: true` marks the
// options the doc labels "เลือกได้หลายข้อ".
export const QUESTIONS_BY_TOPIC: Record<TopicKey, QuestionConfig[]> = {
  "digital-signage": [
    { id: "screenCount", options: ["none", "1-5", "6-20", "21-50", "50-plus"] },
    { id: "contentManagement", options: ["central", "per-branch", "hybrid", "unsure"] },
    {
      id: "contentTypes",
      multi: true,
      options: ["promotion", "announcement", "safety", "schedule", "entertainment", "other"],
    },
  ],
  communication: [
    {
      id: "audience",
      multi: true,
      options: ["employees", "customers", "partners", "public"],
    },
    {
      id: "mainProblem",
      options: ["not-reaching", "too-slow", "no-measurement", "high-cost", "other"],
    },
    { id: "recipientVolume", options: ["lt-100", "100-500", "501-2000", "gt-2000"] },
  ],
  "thunder-care": [
    { id: "deviceCount", options: ["lt-50", "50-200", "201-500", "gt-500"] },
    {
      id: "helpdeskSystem",
      options: ["none", "hard-to-use", "want-to-switch", "unsure"],
    },
    { id: "serviceModel", options: ["reactive", "preventive", "both"] },
  ],
  "asset-intelligence": [
    { id: "assetCount", options: ["lt-100", "100-500", "501-2000", "gt-2000"] },
    { id: "trackingMethod", options: ["spreadsheet", "dedicated-system", "none"] },
    {
      id: "mainProblem",
      options: [
        "cant-find",
        "outdated-data",
        "poor-decisions",
        "slow-audit",
        "missed-maintenance",
      ],
    },
  ],
  "not-sure": [
    {
      id: "currentProblems",
      multi: true,
      options: [
        "signage",
        "communication",
        "it-support",
        "asset-tracking",
        "not-analyzed",
        "other",
      ],
    },
    {
      id: "affectedDepartments",
      multi: true,
      options: ["it", "marketing", "operations", "finance", "hr", "executive"],
    },
    {
      id: "firstConversationHelp",
      options: ["analyze", "demo", "budget", "compare"],
    },
  ],
};
