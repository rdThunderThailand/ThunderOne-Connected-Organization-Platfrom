// === CRM connector factory + public surface ===
//
// Selects the active connector from the CRM_CONNECTOR env var.
//
// TEMPORARY (Phase 0): defaults to "stub" because PM has not created the
// HubSpot test account yet. Switch to CRM_CONNECTOR=hubspot in Phase 1
// once HUBSPOT_PRIVATE_APP_TOKEN is set (D-08).

import type { CrmConnector } from "./connector";
import { HubSpotConnector } from "./hubspot/connector";
import { StubConnector } from "./stub/connector";

export type { CanonicalLeadPayload } from "./canonical";
export { INTERESTED_SOLUTIONS, type InterestedSolution } from "./canonical";
export type { CrmConnector, CrmContactRef, FoundContact } from "./connector";
export { parseCanonicalLead, type ParseResult } from "./validate";
export { upsertLead, type UpsertOutcome } from "./upsert";

export type CrmConnectorName = "stub" | "hubspot";

export function getCrmConnector(): CrmConnector {
  const which = (process.env.CRM_CONNECTOR ?? "stub") as CrmConnectorName;

  switch (which) {
    case "hubspot":
      return new HubSpotConnector(process.env.HUBSPOT_PRIVATE_APP_TOKEN ?? "");
    case "stub":
      return new StubConnector();
    default:
      throw new Error(`Unknown CRM_CONNECTOR: "${which}" (expected "stub" | "hubspot")`);
  }
}
