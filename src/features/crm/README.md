# `src/features/crm` — Thunder CRM connector layer (PoC #1)

Backend-only boundary between the website and an external CRM.
Round 1 scope: **Website _Talk to us_ wizard → create/update a CRM Contact.**

- Step 3.2 brief: [`docs/CRM/ThunderOne_HubSpot_Step_3_2_Dev_Brief.md`](../../../docs/CRM/ThunderOne_HubSpot_Step_3_2_Dev_Brief.md)
- Spec: [`docs/CRM/Thunder CRM PoC #1 — Website → HubSpot.md`](../../../docs/CRM/Thunder%20CRM%20PoC%20%231%20%E2%80%94%20Website%20%E2%86%92%20HubSpot.md)
- Decisions: [`docs/CRM/Thunder CRM PoC #1 — Design Decisions.md`](../../../docs/CRM/Thunder%20CRM%20PoC%20%231%20%E2%80%94%20Design%20Decisions.md)
- Background: [`docs/CRM/Thunder CRM PoC #1 — Learning Roadmap.md`](../../../docs/CRM/Thunder%20CRM%20PoC%20%231%20%E2%80%94%20Learning%20Roadmap.md)

## Flow

```
Talk to us wizard (src/store/talkToUsStore.ts → buildLeadPayload)
  └─ POST /api/crm/lead        canonical JSON payload
       └─ parseCanonicalLead   validate + normalize (zod)
            └─ createLead       persist one leads row first (leads-first)
            └─ upsertLead       find-by-email → create | update   (CRM-agnostic)
                 └─ getCrmConnector()  →  StubConnector | HubSpotConnector
                        └─ mapLeadToHubSpotProperties / mergeHubSpotProperties
                        └─ filterToPortalProperties  (drop props the portal lacks)

  ── channel step ──
  └─ PATCH /api/crm/lead {lead_id, channel}     second write, best-effort
       └─ getLeadCrmContactId → connector.updateContactChannel
            (preferred_contact_channel; see Step 3.2 brief §15.7)
```

## Files

| File | Role |
|---|---|
| `canonical.ts` | Thunder's own lead data model (the contract the form produces). Not CRM-shaped. |
| `validate.ts` | Backend validation + normalization (email lowercase, mobile → E.164). |
| `connector.ts` | `CrmConnector` interface (`findContactByEmail` / `createContact` / `updateContact` / `updateContactChannel`). Business logic depends only on this. |
| `upsert.ts` | CRM-agnostic find-then-write orchestration. |
| `hubspot/mapper.ts` | The **only** place that knows HubSpot property names + dropdown option codes. Canonical → properties, merge policy, `filterToPortalProperties`. |
| `hubspot/properties.ts` | Reads the portal's real contact-property names once (`GET /crm/v3/properties/contacts`), cached; `null` on failure → static brief §5 allowlist. |
| `hubspot/connector.ts` | HubSpot CRM v3 API calls (incl. the `preferred_contact_channel` second write). |
| `solutions.ts` | `interested_solution` slug → English label (`inquiry_message`) + slug → dropdown option code. Re-exported by the wizard's `crmLabels.ts`. |
| `stub/connector.ts` | In-memory connector for local dev without a HubSpot account. |
| `index.ts` | `getCrmConnector()` factory + public exports. |

## Env

`CRM_CONNECTOR` (`stub` | `hubspot`, default `stub`) and `HUBSPOT_SERVICE_KEY` (HubSpot Private App access token, server-side only). Portal setup for the `hubspot` connector: see the Step 3.2 brief §15.

## Try it locally (stub connector)

```bash
pnpm dev
# open /th and start the Talk to us wizard, or hit the route directly:
curl -sS localhost:3000/api/crm/lead \
  -H 'content-type: application/json' \
  -d '{"first_name":"Somchai","last_name":"Prasert","company_name":"ABC Company",
       "position":"IT Manager","mobile":"0811111111","email":"somchai@abc.com",
       "interested_solutions":["digital-signage"],"inquiry_message":"demo please",
       "qualification":{"screen_count":"21-50","usage_type":"multi-branch"},
       "consent":{"status":"granted","purpose":"sales_contact","source":"website",
                  "timestamp":"2026-08-27T14:20:00+07:00"},
       "acquisition":{"source":"website","medium":"organic","campaign":null,
         "utm_source":"facebook","utm_medium":"cpc","utm_campaign":"thunderone_poc",
         "landing_page":"/th"}}'
# → { "ok": true, "lead_id": "…", "provider": "stub", "action": "created", "crmContactId": "STUB-1000", "crm_status": "ok" }
# server log prints the mapped HubSpot properties.

# then the channel step:
curl -sS -X PATCH localhost:3000/api/crm/lead \
  -H 'content-type: application/json' \
  -d '{"lead_id":"<from the POST response>","channel":"line"}'
# → { "ok": true, "crm_status": "ok" }
```

> Needs `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` — the route persists a `leads` row before the CRM call (leads-first).

---

## ⚠️ TEMPORARY — must revisit (see Design Decisions doc)

| Where | What's temporary | Resolve in |
|---|---|---|
| `index.ts` | `CRM_CONNECTOR` defaults to `stub` | Set `HUBSPOT_SERVICE_KEY` + do brief §15 portal setup, switch to `hubspot` (D-08) |
| `hubspot/mapper.ts` | Custom-property internal names are **assumed** from brief §5 (`thunder_acquisition_medium` etc.) | Confirm from a live run's `filterToPortalProperties` drop-log; fix any mismatch here |
| `hubspot/mapper.ts` | Consent (×4) + `utm_medium` / `utm_campaign` / `landing_page` emitted but dropped by the portal filter (Free-plan slots, brief §6) | Add the properties + mapping once the plan is upgraded (D-02 / D-05) |
| `hubspot/mapper.ts` | Repeat-submission merge policy lives in the connector layer | Level 2 — lift a shared CRM-agnostic policy |
| `hubspot/properties.ts` | Portal schema cached for the process lifetime; failure → static allowlist for that lifetime | Redeploy after a scope/property change (restarts the process, clears the cache) |
| `canonical.ts` | `interested_solutions` is an array (brief says single) | Confirm multi-select with PM (D-01) |
| `hubspot/connector.ts` | `updateContactChannel` is a second HubSpot write (the channel is chosen after the main POST) | Collapse into one write if the wizard is restructured to pick the channel before submit (brief §15.7) |
| `validate.ts` | Required-field set is tentative | PM/Product confirms form requirements (D-11) |
| `validate.ts` | `normalizeMobile` is naive TH-only | Use `libphonenumber-js` before production (D-11) |
| `hubspot/mapper.ts` | `consent.timestamp` stored as raw ISO string | Verify HubSpot `datetime` format if PM wants it typed (D-10) |
| `upsert.ts` / `hubspot/connector.ts` | Strategy = search-then-write; 409 fallback unverified against live API | Confirm on the Step 3.2 live run (D-03, TC-3.2-04) |
| `hubspot/connector.ts` | No retry / backoff / rate-limit handling | Retry 429 / 5xx only, honor `Retry-After` (D-12) |
| `stub/connector.ts` | In-memory store, wiped on restart — **not persistence** | Real store (Supabase / DB) for PoC #4 (D-07) |
| `app/api/crm/lead/route.ts` | No auth / rate-limit / bot protection; `console` audit log | Before any public exposure (§15) |
