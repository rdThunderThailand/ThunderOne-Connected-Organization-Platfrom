// === Interested-solution slug → English label ===
//
// The CRM stores this as an English label for every site locale (same
// policy as `position` / `inquiry_message`): the Thai sales team scans
// every record the same way, and editing marketing copy on the site must
// never shift a value already written to HubSpot.
//
// This lives in the CRM feature (not src/components/talk-to-us) because
// the HubSpot mapper is the consumer — the wizard's display i18n is a
// separate concern. `src/components/talk-to-us/config/crmLabels.ts`
// re-exports this as `CRM_SOLUTION_LABELS`.
//
// TEMPORARY (D-06): keep these labels in sync with the `interested_solution`
// property options in the HubSpot portal (if that property is a
// dropdown/enumeration rather than free text).

import type { InterestedSolution } from "./canonical";

/**
 * Human-readable label. Used in the `inquiry_message` text block
 * (re-exported by the wizard's `crmLabels.ts`), NOT for the HubSpot
 * `interested_solution` property — that one needs an option code, see below.
 */
export const SOLUTION_LABELS: Record<InterestedSolution, string> = {
  "digital-signage": "Digital Signage & Media",
  communication: "Communication",
  "thunder-care": "Thunder Care",
  "asset-intelligence": "Asset Intelligence",
  "not-sure": "Not sure yet — wants to talk it through",
};

/**
 * slug → the `interested_solution` dropdown option VALUE in the HubSpot
 * portal. It is a single-select enumeration; these codes were confirmed
 * against the live portal (Step 3.2 §15.4). HubSpot renders its own label
 * in the UI — we store the code.
 */
export const SOLUTION_HUBSPOT_OPTIONS: Record<InterestedSolution, string> = {
  "digital-signage": "digital_signage_media",
  communication: "communication",
  "thunder-care": "thunder_care",
  "asset-intelligence": "asset_intelligence",
  "not-sure": "other",
};
