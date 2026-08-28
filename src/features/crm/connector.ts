// === CRM connector interface (Thunder CRM PoC) ===
//
// Every CRM integration (HubSpot now; Zoho, LINE later) implements this
// same interface. Business logic (see ./upsert.ts) depends ONLY on this
// interface — never on a CRM SDK or CRM-specific field names. That
// boundary is what keeps the platform portable across CRMs.
//
// Conceptual interface source: "Thunder CRM Integration Exploration &
// Demo Paper" §13. Only the methods needed for PoC #1 round 1 are here;
// createCompany / associateCompany / createDeal / assignOwner /
// receiveEvent come in later rounds.

import type { CanonicalLeadPayload } from "./canonical";

export type CrmContactRef = {
  /** The CRM's own record id for this contact. */
  id: string;
  /** Which connector produced it, e.g. "hubspot" | "stub". */
  provider: string;
};

export type FoundContact = CrmContactRef & {
  /** Current properties as returned by the CRM (provider-shaped, raw). */
  properties: Record<string, string | null>;
};

export interface CrmConnector {
  readonly provider: string;

  /** Verify credentials / connectivity. Cheap; safe to call on boot. */
  healthCheck(): Promise<{ ok: boolean; detail?: string }>;

  /** Look up one contact by (already normalized) email. Null if none. */
  findContactByEmail(email: string): Promise<FoundContact | null>;

  /** Create a new contact from a canonical lead. Returns the new id. */
  createContact(lead: CanonicalLeadPayload): Promise<CrmContactRef>;

  /**
   * Patch an existing contact. `existing` is exactly what
   * findContactByEmail returned, so the connector can merge against the
   * current CRM values (repeat-submission policy, D-01 / D-04).
   */
  updateContact(
    existing: FoundContact,
    lead: CanonicalLeadPayload,
  ): Promise<CrmContactRef>;
}
