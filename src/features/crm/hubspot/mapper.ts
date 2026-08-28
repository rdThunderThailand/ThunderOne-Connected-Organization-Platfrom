// === Canonical → HubSpot Contact properties mapper ===
//
// The ONLY place that knows HubSpot property names. Mapping table source:
// "Thunder CRM PoC #1 — Website → HubSpot" §4.
//
// TEMPORARY (D-02 / PM): this emits all 13 custom properties from the doc
// verbatim. HubSpot Free caps custom properties at ~10, so PM will decide
// which to consolidate. The two groups PM is most likely to collapse are
// marked "D-02 consolidation candidate" below — to consolidate, replace
// that group with a single joined property here; nothing outside this
// file changes.
//
// TEMPORARY (Phase 1, step 13): every property key below is ASSUMED from
// the doc. Verify against `GET /crm/v3/properties/contacts` before the
// first real payload and fix any mismatch here.

import type { CanonicalLeadPayload, InterestedSolution } from "../canonical";

export type HubSpotProperties = Record<string, string>;

/** HubSpot enumeration / multi-checkbox internal separator. */
const MULTI_VALUE_SEPARATOR = ";";

/** Acquisition/UTM keys — kept as first-touch on repeat submissions (D-04). */
const FIRST_TOUCH_KEYS = [
  "thunder_lead_source",
  "thunder_medium",
  "thunder_campaign",
  "thunder_utm_source",
  "thunder_utm_medium",
  "thunder_utm_campaign",
  "thunder_landing_page",
] as const;

/**
 * TEMPORARY (D-06): slug → HubSpot option value (identity for now). Keep
 * in sync with the `interested_solution` property options created in the
 * HubSpot test account.
 */
function toSolutionOption(slug: InterestedSolution): string {
  return slug;
}

export function mapLeadToHubSpotProperties(
  lead: CanonicalLeadPayload,
): HubSpotProperties {
  return {
    // --- Default HubSpot Contact properties ---
    firstname: lead.first_name,
    lastname: lead.last_name,
    email: lead.email,
    mobilephone: lead.mobile,
    jobtitle: lead.position,
    // `company` is a plain text property for now; Company object +
    // association is the next round (D-09).
    company: lead.company_name,

    // --- Custom: interest ---
    interested_solution: lead.interested_solutions
      .map(toSolutionOption)
      .join(MULTI_VALUE_SEPARATOR),
    inquiry_message: lead.inquiry_message,

    // --- D-02 consolidation candidate: consent (4 props) ---
    thunder_consent_status: lead.consent.status,
    thunder_consent_purpose: lead.consent.purpose,
    thunder_consent_source: lead.consent.source,
    // TEMPORARY (D-10): raw ISO-8601 string. If PM makes this a HubSpot
    // `datetime` property, normalize to UTC epoch millis here.
    thunder_consent_timestamp: lead.consent.timestamp,

    // --- D-02 consolidation candidate: acquisition + UTM (7 props) ---
    thunder_lead_source: lead.acquisition.source ?? "",
    thunder_medium: lead.acquisition.medium ?? "",
    thunder_campaign: lead.acquisition.campaign ?? "",
    thunder_utm_source: lead.acquisition.utm_source ?? "",
    thunder_utm_medium: lead.acquisition.utm_medium ?? "",
    thunder_utm_campaign: lead.acquisition.utm_campaign ?? "",
    thunder_landing_page: lead.acquisition.landing_page ?? "",
  };
}

/**
 * Merge policy for repeat submissions (D-01).
 *
 * TEMPORARY: implemented here for the HubSpot PoC. Level 2 should lift a
 * shared, CRM-agnostic merge policy above the connector layer.
 *
 *  - `interested_solution`  → UNION of old + new (never lose a product)
 *  - acquisition / UTM      → keep FIRST-touch: don't overwrite a
 *                             non-empty existing value (D-04)
 *  - everything else        → last write wins, but never overwrite a
 *                             non-empty value with an empty one
 */
export function mergeHubSpotProperties(
  existing: Record<string, string | null>,
  incoming: HubSpotProperties,
): HubSpotProperties {
  const out: HubSpotProperties = { ...incoming };

  const split = (value: string | null | undefined) =>
    (value ?? "")
      .split(MULTI_VALUE_SEPARATOR)
      .map((part) => part.trim())
      .filter(Boolean);

  out.interested_solution = Array.from(
    new Set([
      ...split(existing.interested_solution),
      ...split(incoming.interested_solution),
    ]),
  ).join(MULTI_VALUE_SEPARATOR);

  for (const key of FIRST_TOUCH_KEYS) {
    if (existing[key]) out[key] = existing[key] as string;
  }

  for (const [key, value] of Object.entries(out)) {
    if (!value && existing[key]) out[key] = existing[key] as string;
  }

  return out;
}
