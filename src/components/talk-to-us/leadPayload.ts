// === Talk to us wizard → canonical CRM lead payload ===
//
// The wizard collects Thunder's own business data; this module turns it
// into the CANONICAL payload that POST /api/crm/lead validates (zod) and
// upserts. It never references HubSpot field names — that mapping stays in
// src/features/crm/hubspot/mapper.ts.
//
// The step-2 discovery answers plus industry / org-size / preferred-time
// have no dedicated canonical field (grill decision B — no schema change),
// so they are serialized into `inquiry_message` as an English block
// (decision Q10). Everything human-readable comes from ./config/crmLabels,
// not the display i18n, so the CRM value is stable across copy edits.

import type { CanonicalLeadPayload } from "@/features/crm/canonical";
import { QUESTIONS_BY_TOPIC } from "./config/questions";
import {
  CRM_INDUSTRY_LABELS,
  CRM_META_LABELS,
  CRM_OPTION_LABELS,
  CRM_ORG_SIZE_LABELS,
  CRM_POSITION_LABELS,
  CRM_PREFERRED_TIME_LABELS,
  CRM_QUESTION_LABELS,
  CRM_SOLUTION_LABELS,
} from "./config/crmLabels";
import type { TopicKey } from "./types";

export type LeadDraft = {
  selectedTopic: TopicKey;
  answers: Record<string, string[]>;
  position: string;
  industry: string;
  orgSize: string;
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  mobile: string;
  consent: boolean;
  preferredTime: string;
};

function optionLabel(questionId: string, value: string): string {
  return CRM_OPTION_LABELS[questionId]?.[value] ?? value;
}

/**
 * The English text block stored in `inquiry_message`. One `Label: value`
 * line per field; multi-select values are joined with ", ".
 */
export function buildInquiryMessage(draft: LeadDraft): string {
  const lines: string[] = [
    `${CRM_META_LABELS.solution}: ${CRM_SOLUTION_LABELS[draft.selectedTopic]}`,
  ];

  for (const question of QUESTIONS_BY_TOPIC[draft.selectedTopic]) {
    const values = draft.answers[question.id] ?? [];
    if (values.length === 0) continue;
    const label = CRM_QUESTION_LABELS[question.id] ?? question.id;
    lines.push(`${label}: ${values.map((v) => optionLabel(question.id, v)).join(", ")}`);
  }

  if (draft.industry) {
    lines.push(
      `${CRM_META_LABELS.industry}: ${CRM_INDUSTRY_LABELS[draft.industry] ?? draft.industry}`,
    );
  }
  if (draft.orgSize) {
    lines.push(
      `${CRM_META_LABELS.orgSize}: ${CRM_ORG_SIZE_LABELS[draft.orgSize] ?? draft.orgSize}`,
    );
  }
  if (draft.preferredTime) {
    lines.push(
      `${CRM_META_LABELS.preferredTime}: ${
        CRM_PREFERRED_TIME_LABELS[draft.preferredTime] ?? draft.preferredTime
      }`,
    );
  }

  return lines.join("\n");
}

function readAcquisition(): CanonicalLeadPayload["acquisition"] {
  const empty: CanonicalLeadPayload["acquisition"] = {
    source: "website",
    medium: null,
    campaign: null,
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    landing_page: null,
  };
  if (typeof window === "undefined") return empty;

  const params = new URLSearchParams(window.location.search);
  const get = (key: string) => params.get(key) || null;
  return {
    ...empty,
    campaign: get("campaign"),
    utm_source: get("utm_source"),
    utm_medium: get("utm_medium"),
    utm_campaign: get("utm_campaign"),
    landing_page: window.location.pathname,
  };
}

export function buildLeadPayload(draft: LeadDraft): CanonicalLeadPayload {
  return {
    first_name: draft.firstName.trim(),
    last_name: draft.lastName.trim(),
    company_name: draft.companyName.trim(),
    // Stored in HubSpot `jobtitle` as an English label (grill Q8/Q10).
    position: CRM_POSITION_LABELS[draft.position] ?? draft.position,
    mobile: draft.mobile.trim(),
    email: draft.email.trim(),
    // Screener is single-select; canonical still takes an array (D-01).
    interested_solutions: [draft.selectedTopic],
    inquiry_message: buildInquiryMessage(draft),
    consent: {
      status: draft.consent ? "granted" : "denied",
      purpose: "sales_contact",
      source: "website",
      timestamp: new Date().toISOString(),
    },
    acquisition: readAcquisition(),
  };
}
