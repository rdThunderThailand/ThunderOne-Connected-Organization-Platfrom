# Thunder CRM PoC #1 — Evidence Log (TC-01…TC-05)

**Document Status:** Evidence template — fill during Phase 2 (against the real HubSpot test account)
**Version:** 0.1
**Related:**
- Test cases: `Thunder CRM PoC #1 — Website → HubSpot.md` §7
- Decisions: `Thunder CRM PoC #1 — Design Decisions.md`

> Rule (doc §7, TC-02): **record observed behavior with evidence — do not conclude without a real request/response.**
> Attach: request body, response status + body, HubSpot record id, and a screenshot of the Contact in the HubSpot UI where relevant.

---

## Environment

| Item | Value |
|---|---|
| HubSpot account / hub id | _(fill)_ |
| Private App name | _(fill)_ |
| `CRM_CONNECTOR` | `hubspot` |
| Custom properties created | _(link to the "Custom Properties" table below)_ |
| Date / tester | _(fill)_ |

---

## Custom properties created in HubSpot

_(Phase 1, step 14 — after PM confirms D-02/D-05 consolidation)_

| Canonical field(s) | HubSpot internal name | Type | Notes |
|---|---|---|---|
| interested_solutions | `interested_solution` | enumeration / multiple checkboxes | options must match D-06 slugs |
| inquiry_message | `inquiry_message` | _(fill)_ | |
| consent.* | _(fill)_ | _(fill)_ | consolidated? (D-05) |
| acquisition.* / utm.* | _(fill)_ | _(fill)_ | consolidated? (D-02) |
| … | | | |

---

## TC-01 — New Contact

**Action:** submit the form with a brand-new email.
**Expected:** HubSpot creates a Contact; every mapped field is present.

| | |
|---|---|
| Request body | _(paste)_ |
| Response status / body | _(paste — expect 201 + `{id}`)_ |
| HubSpot contact id | _(fill)_ |
| Fields verified in UI | _(screenshot / list)_ |
| Result | ☐ pass ☐ fail |

---

## TC-02 — Same Email (repeat submission)

**Action:** submit again with the **same email**.
**Expected:** _observe and record_ — create / update / reject? What does the backend do next?

| | |
|---|---|
| Path taken by code | ☐ search found existing → PATCH ☐ POST → 409 → PATCH ☐ other |
| `findContactByEmail` response | _(paste)_ |
| Write response status / body | _(paste)_ |
| 409 body shape (if any) | _(paste exact JSON — confirms D-03 assumption)_ |
| Contact id stable? | _(same id as TC-01?)_ |
| Result | ☐ pass ☐ fail |

### TC-02b — Same email, different product (D-01)

**Action:** submit with the same email but a different `interested_solutions` value, and a different `inquiry_message`.
**Expected:** the Contact ends up with **both** products; earlier message not lost.

| | |
|---|---|
| `interested_solution` before | _(fill)_ |
| `interested_solution` after | _(expect union, e.g. `a;b`)_ |
| inquiry / interest log after | _(fill — did the earlier text survive?)_ |
| acquisition/UTM after | _(first-touch kept? D-04)_ |
| Result | ☐ pass ☐ fail |

---

## TC-03 — Custom Fields

**Action:** submit with `interested_solutions` + UTM + consent populated.
**Expected:** custom properties stored and readable back.

| | |
|---|---|
| Request body | _(paste)_ |
| Read-back (`GET /crm/v3/objects/contacts/{id}?properties=…`) | _(paste)_ |
| `thunder_consent_timestamp` accepted format | _(string? datetime? — D-10)_ |
| Result | ☐ pass ☐ fail |

---

## TC-04 — Validation

**Action:** submit invalid email / missing required field.
**Expected:** backend rejects; **no** HubSpot call is made.

| | |
|---|---|
| Request body | _(paste)_ |
| Response status / body | _(expect 422 + issues)_ |
| Evidence no CRM call happened | _(server log / network)_ |
| Result | ☐ pass ☐ fail |

---

## TC-05 — Contact ID returned / stored

**Action:** successful create or update.
**Expected:** backend returns the HubSpot contact id to the caller.

| | |
|---|---|
| API response | _(paste — `{ ok, crmContactId, action }`)_ |
| Stored where | _(D-07 — currently only logged)_ |
| Result | ☐ pass ☐ fail |

---

## Findings / HubSpot limitations observed

_(feeds Deliverable §8 — "สรุปข้อจำกัด")_

- Duplicate behavior: _(fill)_
- Required fields: _(fill)_
- Property limits hit: _(fill — 10 custom cap?)_
- Error cases / surprises: _(fill)_
- Rate limiting seen: _(fill)_
