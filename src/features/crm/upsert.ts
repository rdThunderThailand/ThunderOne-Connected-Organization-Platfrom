// === Lead upsert orchestration ===
//
// CRM-agnostic. Given a validated canonical lead: find the contact by
// email, then update it or create it (docs §8 steps 2 & 5). The dedup key
// is email (Identity Resolution §7 — "Primary: Email").
//
// TEMPORARY (D-03): strategy is "search then write". The connector-level
// 409-catch fallback and Search-API indexing-lag handling are exercised
// in Phase 1 against the real HubSpot API.

import type { CanonicalLeadPayload } from "./canonical";
import type { CrmConnector, CrmContactRef } from "./connector";

export type UpsertOutcome = CrmContactRef & {
  action: "created" | "updated";
};

export async function upsertLead(
  connector: CrmConnector,
  lead: CanonicalLeadPayload,
): Promise<UpsertOutcome> {
  const existing = await connector.findContactByEmail(lead.email);

  if (existing) {
    const ref = await connector.updateContact(existing, lead);
    return { ...ref, action: "updated" };
  }

  const ref = await connector.createContact(lead);
  return { ...ref, action: "created" };
}
