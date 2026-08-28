// === In-memory stub CRM connector ===
//
// Lets the whole Website → Backend → "CRM" flow run locally with NO
// HubSpot account. It runs the real HubSpot mapper + merge policy so the
// mapped payload can be inspected, stores contacts in a process-local
// Map, and logs every call.
//
// TEMPORARY (Phase 0 only): this is NOT persistence — the store is wiped
// on every server restart / hot reload. A real store (Supabase / DB) is
// D-07 and is needed for PoC #4 (reverse sync).

import type { CanonicalLeadPayload } from "../canonical";
import type { CrmConnector, CrmContactRef, FoundContact } from "../connector";
import { mapLeadToHubSpotProperties, mergeHubSpotProperties } from "../hubspot/mapper";

const PROVIDER = "stub";

type StoredContact = { id: string; properties: Record<string, string> };

// Module scope so it survives within a single dev-server process.
const store = new Map<string, StoredContact>(); // key: normalized email
let sequence = 1000;

function log(event: string, detail: unknown) {
  console.info(`[crm:stub] ${event}\n${JSON.stringify(detail, null, 2)}`);
}

export class StubConnector implements CrmConnector {
  readonly provider = PROVIDER;

  async healthCheck() {
    return { ok: true, detail: `stub store holds ${store.size} contact(s)` };
  }

  async findContactByEmail(email: string): Promise<FoundContact | null> {
    const hit = store.get(email);
    log("findContactByEmail", { email, found: Boolean(hit) });
    if (!hit) return null;
    return { id: hit.id, provider: PROVIDER, properties: hit.properties };
  }

  async createContact(lead: CanonicalLeadPayload): Promise<CrmContactRef> {
    const properties = mapLeadToHubSpotProperties(lead);
    const id = `STUB-${sequence++}`;
    store.set(lead.email, { id, properties });
    log("createContact", { id, canonical: lead, mappedProperties: properties });
    return { id, provider: PROVIDER };
  }

  async updateContact(
    existing: FoundContact,
    lead: CanonicalLeadPayload,
  ): Promise<CrmContactRef> {
    const merged = mergeHubSpotProperties(
      existing.properties,
      mapLeadToHubSpotProperties(lead),
    );
    store.set(lead.email, { id: existing.id, properties: merged });
    log("updateContact", { id: existing.id, canonical: lead, mergedProperties: merged });
    return { id: existing.id, provider: PROVIDER };
  }
}
