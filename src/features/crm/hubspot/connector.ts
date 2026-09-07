// === HubSpot CRM connector (PoC #1) ===
//
// Talks to the HubSpot CRM v3 API. Server-only. Auth is a Private App
// access token from HUBSPOT_SERVICE_KEY (brief §2 / D-08).
//
// TEMPORARY (D-12): no retry / backoff / rate-limit handling yet. Add in
// Phase 1 against the live API (retry only 429 / 5xx, honor Retry-After).

import type { CanonicalLeadPayload } from "../canonical";
import type { CrmConnector, CrmContactRef, FoundContact } from "../connector";
import {
  filterToPortalProperties,
  mapLeadToHubSpotProperties,
  mergeHubSpotProperties,
} from "./mapper";
import { getPortalContactProperties } from "./properties";

const HUBSPOT_API_BASE = "https://api.hubapi.com";
const PROVIDER = "hubspot";

/** canonical channel value → `preferred_contact_channel` dropdown option (§15.4). */
const CHANNEL_OPTIONS: Record<string, string> = {
  line: "line",
  callback: "callback",
};

// Read these back on lookup so the merge policy (D-01 / D-04) has the
// current CRM values to work from.
const READ_PROPERTIES = [
  "email",
  "interested_solution",
  "thunder_lead_source",
  "thunder_acquisition_medium",
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
      throw new Error("HubSpotConnector: missing HUBSPOT_SERVICE_KEY");
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

    if (res.status === 401 || res.status === 403) {
      throw new Error(
        `HubSpot auth failed (HTTP ${res.status}) — check HUBSPOT_SERVICE_KEY ` +
          `and the Private App scopes (needs crm.objects.contacts read + write)`,
      );
    }

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
    const properties = filterToPortalProperties(
      mapLeadToHubSpotProperties(lead),
      await getPortalContactProperties(this.token),
    );
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
    const properties = filterToPortalProperties(
      mergeHubSpotProperties(
        existing.properties,
        mapLeadToHubSpotProperties(lead),
      ),
      await getPortalContactProperties(this.token),
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

  async updateContactChannel(contactId: string, channel: string): Promise<void> {
    const value = CHANNEL_OPTIONS[channel];
    if (!value) return; // unknown channel — nothing the CRM can store

    const properties = filterToPortalProperties(
      { preferred_contact_channel: value },
      await getPortalContactProperties(this.token),
    );
    if (Object.keys(properties).length === 0) return; // portal has no such field

    const { status, body } = await this.request<{ id?: string }>(
      `/crm/v3/objects/contacts/${contactId}`,
      { method: "PATCH", body: JSON.stringify({ properties }) },
    );
    if (status !== 200) {
      throw new Error(
        `HubSpot updateContactChannel failed: HTTP ${status} ${JSON.stringify(body)}`,
      );
    }
  }
}
