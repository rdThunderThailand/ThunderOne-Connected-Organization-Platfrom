# `src/features/crm` — Thunder CRM connector layer (PoC #1)

Backend-only boundary between the website and an external CRM.
Round 1 scope: **Website _Talk to us / Request Demo_ → create/update a CRM Contact.**

- Spec: [`docs/CRM/Thunder CRM PoC #1 — Website → HubSpot.md`](../../../docs/CRM/Thunder%20CRM%20PoC%20%231%20%E2%80%94%20Website%20%E2%86%92%20HubSpot.md)
- Decisions: [`docs/CRM/Thunder CRM PoC #1 — Design Decisions.md`](../../../docs/CRM/Thunder%20CRM%20PoC%20%231%20%E2%80%94%20Design%20Decisions.md)
- Background: [`docs/CRM/Thunder CRM PoC #1 — Learning Roadmap.md`](../../../docs/CRM/Thunder%20CRM%20PoC%20%231%20%E2%80%94%20Learning%20Roadmap.md)

## Flow

```
RequestDemoClient (form)
  └─ POST /api/crm/lead        canonical JSON payload
       └─ parseCanonicalLead   validate + normalize (zod)
            └─ upsertLead       find-by-email → create | update   (CRM-agnostic)
                 └─ getCrmConnector()  →  StubConnector | HubSpotConnector
                        └─ mapLeadToHubSpotProperties / mergeHubSpotProperties
```

## Files

| File | Role |
|---|---|
| `canonical.ts` | Thunder's own lead data model (the contract the form produces). Not CRM-shaped. |
| `validate.ts` | Backend validation + normalization (email lowercase, mobile → E.164). |
| `connector.ts` | `CrmConnector` interface. Business logic depends only on this. |
| `upsert.ts` | CRM-agnostic find-then-write orchestration. |
| `hubspot/mapper.ts` | The **only** place that knows HubSpot property names. Canonical → properties + repeat-submission merge policy. |
| `hubspot/connector.ts` | HubSpot CRM v3 API calls. |
| `stub/connector.ts` | In-memory connector for local dev without a HubSpot account. |
| `index.ts` | `getCrmConnector()` factory + public exports. |

## Env

See [`.env.example`](../../../.env.example). `CRM_CONNECTOR` (`stub` | `hubspot`) and `HUBSPOT_PRIVATE_APP_TOKEN`.

## Try it locally (Phase 0, stub connector)

```bash
pnpm dev
# open /th/request-demo and submit, or:
curl -sS localhost:3000/api/crm/lead \
  -H 'content-type: application/json' \
  -d '{"first_name":"Somchai","last_name":"Prasert","company_name":"ABC Company",
       "position":"IT Manager","mobile":"0811111111","email":"somchai@abc.com",
       "interested_solutions":["asset-intelligence"],"inquiry_message":"demo please",
       "consent":{"status":"granted","purpose":"sales_contact","source":"website",
                  "timestamp":"2026-08-27T14:20:00+07:00"},
       "acquisition":{"source":"website","medium":"organic","campaign":null,
         "utm_source":"facebook","utm_medium":"cpc","utm_campaign":"thunderone_poc",
         "landing_page":"/th/request-demo"}}'
# → { "ok": true, "provider": "stub", "action": "created", "crmContactId": "STUB-1000" }
# server log prints the mapped HubSpot properties.
```

---

## ⚠️ TEMPORARY — must revisit (see Design Decisions doc)

| Where | What's temporary | Resolve in |
|---|---|---|
| `index.ts` | `CRM_CONNECTOR` defaults to `stub` | Phase 1 — set token, switch to `hubspot` (D-08) |
| `hubspot/mapper.ts` | All **13** custom properties emitted verbatim; HubSpot Free caps at ~10 | PM decides which to consolidate (D-02 / D-05); edit the two marked groups |
| `hubspot/mapper.ts` | Every HubSpot property key is **assumed** from the doc | Phase 1 — verify via `GET /crm/v3/properties/contacts` |
| `hubspot/mapper.ts` | Repeat-submission merge policy lives in the connector layer | Level 2 — lift a shared CRM-agnostic policy |
| `canonical.ts` | `interested_solutions` is an array (doc says single) | Confirm multi-select with PM (D-01) |
| `canonical.ts` | Solution slugs reuse the Talk-to-us `TopicKey` values | Confirm final internal values with PM/Product (D-06) |
| `validate.ts` | Required-field set is tentative | PM/Product confirms form requirements (D-11) |
| `validate.ts` | `normalizeMobile` is naive TH-only | Use `libphonenumber-js` before production (D-11) |
| `hubspot/mapper.ts` | `consent.timestamp` stored as raw ISO string | Verify HubSpot `datetime` format if PM wants it typed (D-10) |
| `upsert.ts` / `hubspot/connector.ts` | Strategy = search-then-write; 409 fallback unverified | Phase 1 against live API (D-03, TC-02) |
| `hubspot/connector.ts` | No retry / backoff / rate-limit handling | Phase 1 — retry 429 / 5xx only (D-12) |
| `stub/connector.ts` | In-memory store, wiped on restart — **not persistence** | Real store (Supabase / DB) for PoC #4 (D-07) |
| `app/api/crm/lead/route.ts` | No auth / rate-limit / bot protection; `console` audit log | Before any public exposure (§15) |
| `src/app/[locale]/request-demo` | Standalone PoC page | Fold into the Talk-to-us wizard once the flow is proven (Decision A) |
