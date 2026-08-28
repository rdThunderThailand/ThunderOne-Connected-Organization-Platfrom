// === HubSpot CRM connector (PoC #1) ===
//
// Talks to the HubSpot CRM v3 API. Server-only. Auth is a Private App
// access token from HUBSPOT_PRIVATE_APP_TOKEN (D-08).
//
// TEMPORARY: not exercised against the real API until Phase 1 — PM has not
// created the HubSpot test account yet, so the factory in ../index.ts
// selects the StubConnector by default.
//
// TEMPORARY (D-12): no retry / backoff / rate-limit handling yet. Add in
// Phase 1 against the live API (retry only 429 / 5xx, honor Retry-After).

import type { CanonicalLeadPayload } from "../canonical";
import type { CrmConnector, CrmContactRef, FoundContact } from "../connector";
import { mapLeadToHubSpotProperties, mergeHubSpotProperties } from "./mapper";

const HUBSPOT_API_BASE = "https://api.hubapi.com";
const PROVIDER = "hubspot";

// Read these back on lookup so the merge policy (D-01 / D-04) has the
// current CRM values to work from.
const READ_PROPERTIES = [
  "email",
  "interested_solution",
  "thunder_lead_source",
  "thunder_medium",
  "thunder_campaign",
  "thunder_utm_source",
  "thunder_utm_medium",
  "thunder_utm_campaign",
  "thunder_landing_page",
];

type ContactResult = {
  id: string;
  properties: Record<string, string | null>;
};

export class HubSpotConnector implements CrmConnector {
  readonly provider = PROVIDER;

  constructor(private readonly token: string) {
    if (!token) {
      throw new Error("HubSpotConnector: missing HUBSPOT_PRIVATE_APP_TOKEN");
    }
  }

  private async request<T>(
    path: string,
    init?: RequestInit,
  ): Promise<{ status: number; body: T }> {
    const res = await fetch(`${HUBSPOT_API_BASE}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
        ...init?.headers,
      },
      // CRM writes must never be cached.
      cache: "no-store",
    });

    const text = await res.text();
    const body = (text ? JSON.parse(text) : undefined) as T;
    return { status: res.status, body };
  }

  async healthCheck(): Promise<{ ok: boolean; detail?: string }> {
    const { status } = await this.request("/crm/v3/objects/contacts?limit=1");
    return status === 200 ? { ok: true } : { ok: false, detail: `HTTP ${status}` };
  }

  async findContactByEmail(email: string): Promise<FoundContact | null> {
    const { body } = await this.request<{ results?: ContactResult[] }>(
      "/crm/v3/objects/contacts/search",
      {
        method: "POST",
        body: JSON.stringify({
          filterGroups: [
            { filters: [{ propertyName: "email", operator: "EQ", value: email }] },
          ],
          properties: READ_PROPERTIES,
          limit: 1,
        }),
      },
    );

    const hit = body?.results?.[0];
    if (!hit) return null;
    return { id: hit.id, provider: PROVIDER, properties: hit.properties };
  }

  async createContact(lead: CanonicalLeadPayload): Promise<CrmContactRef> {
    const properties = mapLeadToHubSpotProperties(lead);
    const { status, body } = await this.request<{ id?: string }>(
      "/crm/v3/objects/contacts",
      { method: "POST", body: JSON.stringify({ properties }) },
    );

    if (status === 201 && body?.id) {
      return { id: body.id, provider: PROVIDER };
    }

    // TEMPORARY (D-03 / TC-02): treat a 409 as "already exists" and fall
    // back to update. Verify the exact 409 body shape in Phase 1.
    if (status === 409) {
      const existing = await this.findContactByEmail(lead.email);
      if (existing) return this.updateContact(existing, lead);
    }

    throw new Error(
      `HubSpot createContact failed: HTTP ${status} ${JSON.stringify(body)}`,
    );
  }

  async updateContact(
    existing: FoundContact,
    lead: CanonicalLeadPayload,
  ): Promise<CrmContactRef> {
    const properties = mergeHubSpotProperties(
      existing.properties,
      mapLeadToHubSpotProperties(lead),
    );
    const { status, body } = await this.request<{ id?: string }>(
      `/crm/v3/objects/contacts/${existing.id}`,
      { method: "PATCH", body: JSON.stringify({ properties }) },
    );

    if (status === 200) return { id: existing.id, provider: PROVIDER };
    throw new Error(
      `HubSpot updateContact failed: HTTP ${status} ${JSON.stringify(body)}`,
    );
  }
}
