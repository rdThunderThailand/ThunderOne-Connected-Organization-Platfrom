// === Message Builder: Talk-to-us lead → LINE summary text ===
//
// Step 0.11 (docs/CRM/LineOA/lineOA 1sep.md §5, §6). Pure function: takes
// the few fields the summary needs, returns the customer-facing text. It
// does NOT call LINE and does NOT gate on solution — the caller decides
// when to build (the wizard only fires this for Digital Signage).
//
// The input is a LINE-local DTO shaped after the §6 example, deliberately
// NOT the canonical CRM payload (src/features/crm/canonical.ts): the
// website does not emit `qualification` / `contact_preference` into the
// canonical schema, and keeping this decoupled means 0.12 (real Lead ↔
// LINE identity linking) can add an adapter without touching CRM.
//
// §8: email / mobile / UTM / consent metadata / internal ids are
// intentionally absent here — they stay in the canonical payload / CRM.

import { z } from "zod";
import {
  CHANNEL_LABELS_TH,
  labelFor,
  renderSummaryTemplate,
  SCREEN_COUNT_LABELS_TH,
  USAGE_TYPE_LABELS_TH,
} from "./summaryLabels";

// Lenient on the exact slug set (unknown values fall back to the raw slug,
// like crmLabels.ts) — this schema only guards shape + non-empty strings.
export const lineLeadSummaryInputSchema = z.object({
  first_name: z.string().trim().min(1).max(100),
  interested_solution: z.string().trim().min(1).max(200),
  qualification: z.object({
    screen_count: z.string().trim().min(1).max(50),
    usage_type: z.string().trim().min(1).max(50),
  }),
  contact_preference: z.object({
    channel: z.string().trim().min(1).max(50),
  }),
});

export type LineLeadSummaryInput = z.infer<typeof lineLeadSummaryInputSchema>;

/**
 * Build the summary text from a validated input. §5 output, with the four
 * value lines resolved through the TH label maps.
 */
export function buildLineLeadSummary(input: LineLeadSummaryInput): string {
  return renderSummaryTemplate({
    firstName: input.first_name,
    solution: input.interested_solution,
    screenCount: labelFor(SCREEN_COUNT_LABELS_TH, input.qualification.screen_count),
    usageType: labelFor(USAGE_TYPE_LABELS_TH, input.qualification.usage_type),
    channel: labelFor(CHANNEL_LABELS_TH, input.contact_preference.channel),
  });
}
