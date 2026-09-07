// === CRM connector factory + public surface ===
//
// Selects the active connector from the CRM_CONNECTOR env var.
//
// TEMPORARY (Phase 0): defaults to "stub". Switch to CRM_CONNECTOR=hubspot
// once HUBSPOT_SERVICE_KEY is set and the portal setup in the Step 3.2 Dev
// Brief §15 is done (D-08).

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
      return new HubSpotConnector(process.env.HUBSPOT_SERVICE_KEY ?? "");
    case "stub":
      return new StubConnector();
    default:
      throw new Error(`Unknown CRM_CONNECTOR: "${which}" (expected "stub" | "hubspot")`);
  }
}
