// === Canonical lead payload — Thunder CRM PoC #1 ===
//
// This is Thunder's OWN business data model for a captured lead. It is
// deliberately NOT shaped like any CRM's API. The website form produces
// this payload; a per-CRM mapper (see ./hubspot/mapper.ts) translates it
// into that CRM's fields. Keeping this contract stable is what lets us add
// a Zoho mapper later without touching the form.
//
// Field names are kept snake_case to match the canonical payload defined
// in `docs/CRM/Thunder CRM PoC #1 — Website → HubSpot.md` §3 verbatim, so
// request bodies can be diffed against the doc when collecting PoC
// evidence.
//
// Source of truth : docs/CRM/Thunder CRM PoC #1 — Website → HubSpot.md
// Decision log     : docs/CRM/Thunder CRM PoC #1 — Design Decisions.md

/**
 * Fixed set of solutions a lead can express interest in.
 *
 * TEMPORARY (D-06): these slugs mirror the existing "Talk to us" wizard
 * `TopicKey` values (src/components/talk-to-us/types.ts). The final
 * internal values must be confirmed with PM/Product and kept in sync with
 * the HubSpot `interested_solution` property options.
 */
export const INTERESTED_SOLUTIONS = [
  "digital-signage",
  "thunder-care",
  "communication",
  "asset-intelligence",
  "not-sure",
] as const;

export type InterestedSolution = (typeof INTERESTED_SOLUTIONS)[number];

export type ConsentStatus = "granted" | "denied";

export type CanonicalConsent = {
  status: ConsentStatus;
  /** e.g. "sales_contact" */
  purpose: string;
  /** e.g. "website" */
  source: string;
  /** ISO 8601, e.g. "2026-08-27T14:20:00+07:00" or "...Z". */
  timestamp: string;
};

export type CanonicalAcquisition = {
  /** e.g. "website" */
  source: string | null;
  /** e.g. "organic" */
  medium: string | null;
  campaign: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  landing_page: string | null;
};

export type CanonicalLeadPayload = {
  first_name: string;
  last_name: string;
  company_name: string;
  position: string;
  mobile: string;
  email: string;
  /**
   * TEMPORARY (D-01): the source doc models a single `interested_solution`
   * string. We accept an array so "interested in multiple products" and
   * repeat submissions can be merged without data loss. If PM confirms
   * single-select only, collapse this to a 1-element array at the edge —
   * nothing downstream changes.
   */
  interested_solutions: InterestedSolution[];
  inquiry_message: string;
  consent: CanonicalConsent;
  acquisition: CanonicalAcquisition;
};
