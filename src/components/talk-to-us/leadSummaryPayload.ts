// === Talk to us wizard → LINE lead-summary DTO ===
//
// Step 0.11 (docs/CRM/LineOA/lineOA 1sep.md §6). Turns the wizard state
// into the LINE-local input for POST /api/line/lead-summary. This is a
// DIFFERENT shape from the canonical CRM payload (./leadPayload.ts): the
// canonical schema has no qualification / contact_preference, and the LINE
// summary only needs the handful of fields in §6.
//
// Digital Signage only — the store guards the call on selectedTopic, so
// screenCount / usageType are the DS question ids and are always answered
// by the time the channel step is reached (QuestionsStep gates "Next").

import type { LineLeadSummaryInput } from "@/features/line/buildLeadSummary";
import { CRM_SOLUTION_LABELS } from "./config/crmLabels";

export type LeadSummaryDraft = {
  firstName: string;
  answers: Record<string, string[]>;
};

export function buildLeadSummaryPayload(draft: LeadSummaryDraft): LineLeadSummaryInput {
  return {
    first_name: draft.firstName.trim(),
    interested_solution: CRM_SOLUTION_LABELS["digital-signage"],
    qualification: {
      screen_count: draft.answers.screenCount?.[0] ?? "",
      usage_type: draft.answers.usageType?.[0] ?? "",
    },
    contact_preference: { channel: "line" },
  };
}
