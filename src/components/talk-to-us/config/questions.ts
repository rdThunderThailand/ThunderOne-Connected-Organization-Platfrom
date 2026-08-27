import type { QuestionConfig, TopicKey } from "../types";

// Structural config only — question/option labels live in
// messages/{th,en}/talk-to-us.json under `questions.sets.<topic>.<id>`.
//
// Only `digital-signage` matches the source design mockup. The other
// topics reuse a generic org-size + primary-goal pair as a placeholder.
// TODO: confirm real per-topic questions with design/content team.
export const QUESTIONS_BY_TOPIC: Record<TopicKey, QuestionConfig[]> = {
  "digital-signage": [
    { id: "branchCount", options: ["1-5", "6-20", "21-50", "50-plus"] },
    { id: "usageType", options: ["office", "multi-branch", "public", "advertising"] },
  ],
  "thunder-care": [
    { id: "orgSize", options: ["1-5", "6-20", "21-50", "50-plus"] },
    { id: "primaryGoal", options: ["assessment", "quote", "demo", "other"] },
  ],
  communication: [
    { id: "orgSize", options: ["1-5", "6-20", "21-50", "50-plus"] },
    { id: "primaryGoal", options: ["assessment", "quote", "demo", "other"] },
  ],
  "asset-intelligence": [
    { id: "orgSize", options: ["1-5", "6-20", "21-50", "50-plus"] },
    { id: "primaryGoal", options: ["assessment", "quote", "demo", "other"] },
  ],
  "not-sure": [
    { id: "orgSize", options: ["1-5", "6-20", "21-50", "50-plus"] },
    { id: "primaryGoal", options: ["assessment", "quote", "demo", "other"] },
  ],
};
