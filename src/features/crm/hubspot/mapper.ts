// === Canonical → HubSpot Contact properties mapper ===
//
// The ONLY place that knows HubSpot property names. Mapping table source:
// "ThunderOne HubSpot Step 3.2 Dev Brief" §5.
//
// This emits the full property set the canonical payload can fill. The
// portal only has ~10 custom-property slots on the Free plan, so
// `filterToPortalProperties` (below) drops any property the portal has no
// field for right before the write — those values stay in the canonical
// payload / the `leads.canonical` row and start flowing once the property
// is created (brief §5, §6, §10).
//
// TEMPORARY: every custom-property key below is ASSUMED from brief §5.
// `getPortalContactProperties` (./properties.ts) confirms them at runtime;
// a live run's drop-log is the source of truth for the real names.

import type { CanonicalLeadPayload, InterestedSolution } from "../canonical";
import { SOLUTION_HUBSPOT_OPTIONS } from "../solutions";

export type HubSpotProperties = Record<string, string>;

/** Acquisition/UTM keys — kept as first-touch on repeat submissions (D-04). */
const FIRST_TOUCH_KEYS = [
  "thunder_lead_source",
  "thunder_acquisition_medium",
  "thunder_campaign",
  "thunder_utm_source",
  "thunder_utm_medium",
  "thunder_utm_campaign",
  "thunder_landing_page",
] as const;

/** slug → the portal's `interested_solution` dropdown option value. */
function toSolutionOption(slug: InterestedSolution): string {
  return SOLUTION_HUBSPOT_OPTIONS[slug];
}

// Portal dropdown option codes for the digital-signage screener (confirmed
// against the live portal, Step 3.2 §15.4). Note the en-dash (–) in the
// first three screen_count values — it must match the portal exactly.
const SCREEN_COUNT_OPTIONS: Record<string, string> = {
  "1-5": "1–5",
  "6-20": "6–20",
  "21-50": "21–50",
  "50-plus": "50_plus",
};

const USAGE_TYPE_OPTIONS: Record<string, string> = {
  "office-organization": "office_organization",
  "multi-branch": "multi_branch",
  "public-government": "public_government",
  "advertising-network": "advertising_network",
};

/**
 * wizard slug → portal dropdown option value; "" when null / unknown.
 * Also accepts the brief §4 underscore spelling ("21_50", "multi_branch").
 */
function toEnumOption(map: Record<string, string>, slug: string | null): string {
  if (!slug) return "";
  return map[slug] ?? map[slug.replace(/_/g, "-")] ?? "";
}

export function mapLeadToHubSpotProperties(
  lead: CanonicalLeadPayload,
): HubSpotProperties {
  // `interested_solution` is a single-select dropdown in the portal, so map
  // the screener answer (canonical keeps an array for D-01, but the wizard
  // only ever sends one).
  const [primarySolution] = lead.interested_solutions;

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
    interested_solution: primarySolution ? toSolutionOption(primarySolution) : "",
    inquiry_message: lead.inquiry_message,

    // --- Custom: digital-signage screener (brief §5; "" for other topics) ---
    screen_count: toEnumOption(SCREEN_COUNT_OPTIONS, lead.qualification.screen_count),
    usage_type: toEnumOption(USAGE_TYPE_OPTIONS, lead.qualification.usage_type),

    // --- Consent (brief §6 "not yet" — dropped until the portal has fields) ---
    thunder_consent_status: lead.consent.status,
    thunder_consent_purpose: lead.consent.purpose,
    thunder_consent_source: lead.consent.source,
    // TEMPORARY (D-10): raw ISO-8601 string. If PM makes this a HubSpot
    // `datetime` property, normalize to UTC epoch millis here.
    thunder_consent_timestamp: lead.consent.timestamp,

    // --- Acquisition + UTM ---
    // brief §5 maps source / medium / campaign / utm_source; utm_medium,
    // utm_campaign and landing_page are brief §6 "not yet" and get dropped
    // by filterToPortalProperties until the portal has a field for them.
    thunder_lead_source: lead.acquisition.source ?? "",
    thunder_acquisition_medium: lead.acquisition.medium ?? "",
    thunder_campaign: lead.acquisition.campaign ?? "",
    thunder_utm_source: lead.acquisition.utm_source ?? "",
    thunder_utm_medium: lead.acquisition.utm_medium ?? "",
    thunder_utm_campaign: lead.acquisition.utm_campaign ?? "",
    thunder_landing_page: lead.acquisition.landing_page ?? "",
  };
}

/**
 * brief §5 allowlist — the contact properties this PoC maps to. Used only
 * when the portal schema can't be read (missing scope / network). Every
 * custom name here is ASSUMED from brief §5 until a live run's drop-log
 * confirms it.
 */
export const STATIC_PORTAL_PROPERTIES: readonly string[] = [
  "firstname",
  "lastname",
  "email",
  "mobilephone",
  "jobtitle",
  "company",
  "interested_solution",
  "inquiry_message",
  "screen_count",
  "usage_type",
  "preferred_contact_channel",
  "thunder_lead_source",
  "thunder_acquisition_medium",
  "thunder_campaign",
  "thunder_utm_source",
];

/**
 * Drop every property the portal has no field for (brief §10 — one missing
 * field must not block the whole write). `portalNames` is the live schema
 * from GET /crm/v3/properties/contacts, or `null` when that read failed —
 * in which case the static brief §5 allowlist is used. Dropped values are
 * NOT lost: they remain in the canonical payload / the `leads.canonical`
 * row and flow through once the property exists.
 */
export function filterToPortalProperties(
  properties: HubSpotProperties,
  portalNames: Set<string> | null,
): HubSpotProperties {
  const allowed = portalNames ?? new Set(STATIC_PORTAL_PROPERTIES);
  const source = portalNames ? "portal schema" : "brief §5 allowlist";
  const out: HubSpotProperties = {};
  const dropped: string[] = [];

  for (const [key, value] of Object.entries(properties)) {
    if (allowed.has(key)) out[key] = value;
    else dropped.push(key);
  }

  if (dropped.length > 0) {
    console.warn(
      `[crm:hubspot:mapper] dropped ${dropped.length} ` +
        `propert${dropped.length === 1 ? "y" : "ies"} not in ${source} ` +
        `(kept in canonical): ${dropped.join(", ")}`,
    );
  }

  return out;
}

/**
 * Merge policy for repeat submissions (D-01).
 *
 * TEMPORARY: implemented here for the HubSpot PoC. Level 2 should lift a
 * shared, CRM-agnostic merge policy above the connector layer.
 *
 *  - `interested_solution`  → last write wins (portal property is a
 *                             single-select dropdown, Step 3.2 §15.4)
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

  for (const key of FIRST_TOUCH_KEYS) {
    if (existing[key]) out[key] = existing[key] as string;
  }

  for (const [key, value] of Object.entries(out)) {
    if (!value && existing[key]) out[key] = existing[key] as string;
  }

  return out;
}
