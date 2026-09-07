# ThunderOne CRM Integration PoC — Step 3.2: HubSpot Backend API DEV Brief

*Service Key Setup + Create/Update Contact + Canonical Mapping*

เป้าหมายของ Step 3.2 คือพิสูจน์ว่า ThunderOne Backend สามารถรับ Canonical Payload จาก Talk to us แล้วสร้างหรืออัปเดต Contact ใน HubSpot ผ่าน HubSpot API ได้จริง โดยใช้ Service Key ฝั่ง Backend เท่านั้น

## 1. Current Status

| Item | Status |
|---|---|
| HubSpot account / CRM objects | READY |
| Contact / Company / Deal explored manually | DONE |
| Custom properties created up to Thunder UTM Source | DONE |
| Additional custom properties | PAUSED - Free plan limit |
| HubSpot Service Key | CREATED |
| Service Key scopes | Contacts/Companies/Deals read-write + Owners read |
| Backend HubSpot API integration | NEXT - Step 3.2 |

## 2. Service Key - Backend ENV Requirement

PM จะส่ง HubSpot Service Key ให้ Dev ผ่านช่องทางที่ปลอดภัย Dev ต้องเก็บ key ไว้ฝั่ง Backend/Server environment เท่านั้น

Recommended ENV variable:

```
HUBSPOT_SERVICE_KEY=<service-key-from-HubSpot>
```

- ห้ามใส่ Service Key ใน frontend code
- ห้ามใช้ `NEXT_PUBLIC_` หรือ expose ผ่าน browser
- ห้าม commit key ลง Git / repository
- ห้าม log Service Key แบบเต็ม
- ถ้าใช้ Vercel ให้เพิ่มเป็น Server-side Environment Variable ของ environment ที่ใช้ทดสอบ PoC

## 3. Target Flow ของ Step 3.2

```
Talk to us Form
  ↓
Canonical Payload
  ↓
ThunderOne Backend
  ↓
Validate / Map fields
  ↓
HubSpot Contacts API
  ↓
Search existing Contact by email
  ↓
If found → Update Contact
If not found → Create Contact
  ↓
Return HubSpot Contact ID
  ↓
Store crm_contact_id on Thunder lead
  ↓
PoC Success
```

## 4. Canonical Payload Input

```json
{
  "first_name": "Somchai",
  "last_name": "Prasert",
  "company_name": "ABC Company",
  "position": "IT Manager",
  "mobile": "+66811111111",
  "email": "somchai@abc.com",
  "interested_solution": "Digital Signage & Media",
  "inquiry_message": "I would like a demo",
  "qualification": {
    "screen_count": "21_50",
    "usage_type": "multi_branch"
  },
  "contact_preference": {
    "channel": "line"
  },
  "consent": {
    "status": "granted",
    "purpose": "sales_contact",
    "source": "website",
    "timestamp": "2026-09-04T10:00:00+07:00"
  },
  "acquisition": {
    "source": "website",
    "medium": "organic",
    "campaign": null,
    "utm_source": "facebook",
    "utm_medium": "cpc",
    "utm_campaign": "thunderone_poc",
    "landing_page": "/talk-to-us"
  }
}
```

## 5. HubSpot Contact Mapping - PoC

ให้ map เฉพาะ field ที่มีอยู่จริงใน HubSpot account ตอนนี้ก่อน Field ที่ยังสร้างไม่ได้เพราะ Free plan limit ไม่ต้อง block Step 3.2 และยังคงเก็บอยู่ใน Canonical Payload ฝั่ง ThunderOne

| Canonical | HubSpot Property | Note |
|---|---|---|
| first_name | firstname | Default HubSpot |
| last_name | lastname | Default HubSpot |
| email | email | Default HubSpot / identity key for PoC |
| mobile | mobilephone | Default HubSpot |
| position | jobtitle | Default HubSpot |
| company_name | company | PoC text field; association ทำใน step ถัดไป |
| interested_solution | interested_solution | Custom property |
| inquiry_message | inquiry_message | Custom property |
| qualification.screen_count | screen_count | Custom property |
| qualification.usage_type | usage_type | Custom property |
| contact_preference.channel | preferred_contact_channel | Custom property |
| acquisition.source | thunder_lead_source | Custom property |
| acquisition.medium | thunder_acquisition_medium | Custom property |
| acquisition.campaign | thunder_campaign | Custom property |
| acquisition.utm_source | thunder_utm_source | Last property created before Free limit |

## 6. Fields ยังไม่ต้องส่ง HubSpot ตอนนี้

- acquisition.utm_medium
- acquisition.utm_campaign
- acquisition.landing_page
- consent.status
- consent.purpose
- consent.source
- consent.timestamp

ข้อมูลเหล่านี้ยังต้องเก็บใน Canonical Payload ของ ThunderOne ตามเดิม หลังจาก upgrade plan หรือเปลี่ยน CRM connector ค่อยเพิ่ม mapping ภายหลังได้ โดยไม่ต้องแก้ frontend payload

## 7. Create / Update Logic

สำหรับ PoC ให้ใช้ email เป็น primary lookup key ของ HubSpot Contact ก่อน เพื่อหลีกเลี่ยง duplicate contact

- ถ้า email ยังไม่มีใน HubSpot → Create Contact
- ถ้า email มี Contact อยู่แล้ว → Update Contact เดิม
- ห้ามสร้าง Contact ใหม่ทุก submission โดยไม่เช็ก email
- ผลลัพธ์ต้องได้ HubSpot Contact ID กลับมา

## 8. Suggested Backend Function

Concept only:

```js
async function upsertHubSpotContact(canonicalPayload) {
  // 1) validate email
  // 2) search HubSpot contact by email
  // 3) map canonical -> HubSpot properties
  // 4) create or update contact
  // 5) return HubSpot contact id
}
```

## 9. Save HubSpot Contact ID back to Thunder Lead

หลัง HubSpot create/update สำเร็จ ให้เก็บ external CRM identity กลับมาใน lead record ปัจจุบัน

Example:

```js
leads.crm_contact_id = "<REAL_HUBSPOT_CONTACT_ID>"
```

ถ้าปัจจุบันมีค่า STUB เช่น STUB-1000 / STUB-1001 ให้แทนด้วย HubSpot Contact ID จริงเมื่อ API integration สำเร็จ

## 10. Error Handling ขั้นต่ำ

- Missing email → return validation error / ไม่ call HubSpot
- HubSpot 401/403 → ตรวจ Service Key / scopes
- HubSpot API error → log status + safe error message โดยไม่ log Service Key
- Custom property invalid/missing → อย่าให้ field ที่ไม่จำเป็น block payload ทั้งก้อน; log field mapping issue
- HubSpot timeout/network error → return controlled error และยังคง Canonical Payload ใน ThunderOne

## 11. Test Cases - Step 3.2

| TC | Action | Expected |
|---|---|---|
| TC-3.2-01 | Backend ใช้ Service Key จาก ENV | API authentication ผ่าน |
| TC-3.2-02 | ส่ง email ใหม่ | Create Contact สำเร็จ |
| TC-3.2-03 | ตรวจ HubSpot | ข้อมูล Default + available custom properties ตรงกับ Canonical |
| TC-3.2-04 | ส่ง email เดิมอีกครั้ง | Update Contact เดิม ไม่สร้าง duplicate |
| TC-3.2-05 | ตรวจ response | ได้ HubSpot Contact ID |
| TC-3.2-06 | ตรวจ Supabase leads | crm_contact_id เป็น HubSpot Contact ID จริง |
| TC-3.2-07 | ส่ง field ที่ HubSpot ยังไม่มี | Canonical ยังเก็บครบ และ flow ไม่พัง |

## 12. Definition of Done - Step 3.2

- Service Key ถูกเก็บใน Backend ENV (`HUBSPOT_SERVICE_KEY`)
- Frontend ไม่เห็น Service Key
- Backend สามารถ authenticate HubSpot API ได้
- Canonical Payload ถูก map ไป Contact properties ที่มีอยู่จริง
- Create Contact สำหรับ email ใหม่สำเร็จ
- Update Contact สำหรับ email เดิมสำเร็จโดยไม่ duplicate
- ได้ HubSpot Contact ID กลับมา
- `leads.crm_contact_id` ถูก update ด้วย HubSpot Contact ID จริง
- Field ที่สร้างไม่ได้เพราะ Free plan limit ยังอยู่ใน Canonical Payload และไม่ block PoC

## 13. Out of Scope ของ Step 3.2

- Company create/association
- Deal create/association
- Owner assignment
- CRM lifecycle reverse sync / webhook
- HubSpot properties ที่เกิน Free plan limit

## 14. ข้อความสั้นสำหรับ Assign Dev

Implement HubSpot Step 3.2: store the HubSpot Service Key in backend ENV as `HUBSPOT_SERVICE_KEY` (never expose it to frontend or commit it). Add backend upsert logic for HubSpot Contacts using email as the PoC lookup key. Map the current ThunderOne Canonical Payload only to HubSpot properties that exist in this portal, create a new Contact if email does not exist, otherwise update the existing Contact. Return the real HubSpot Contact ID and persist it to `leads.crm_contact_id`. Fields that cannot be created due to the HubSpot Free plan limit must remain in ThunderOne Canonical Payload and must not block the PoC flow.

---

## 15. Implementation (Dev)

**สถานะ: DONE (2026-09-07)** — TC-3.2-01..07 รัน live กับ HubSpot portal `247231159` **ผ่านหมด**
`./docs/CRM/step_3_2_smoke.sh` และ `./docs/CRM/step_3_2_update_test.sh` เขียว 100%
DoD §12 ครบทั้ง 9 ข้อ (§15.6)

**อัปเดต (2026-09-07, รอบ 2):** wire ครบ 15 field ตาม brief §5 แล้ว — เพิ่ม `screen_count` / `usage_type` (structured, จาก wizard digital-signage) และ `preferred_contact_channel` (ผ่าน **second write** `PATCH /api/crm/lead` หลังสเต็ป channel — ดู §15.7)

### 15.0 สิ่งที่แก้ในโค้ด

| ไฟล์ | เปลี่ยนอะไร |
|---|---|
| `src/features/crm/index.ts` | อ่าน `process.env.HUBSPOT_SERVICE_KEY` (เดิม `HUBSPOT_PRIVATE_APP_TOKEN`) |
| `src/features/crm/solutions.ts` *(ใหม่)* | `SOLUTION_LABELS` (slug → English label, ใช้ใน `inquiry_message`) + `SOLUTION_HUBSPOT_OPTIONS` (slug → `interested_solution` dropdown option code, §15.4) |
| `src/features/crm/hubspot/properties.ts` *(ใหม่)* | `getPortalContactProperties()` — `GET /crm/v3/properties/contacts` ครั้งเดียว cache ทั้ง process; fail → คืน `null` |
| `src/features/crm/hubspot/mapper.ts` | `toSolutionOption` → dropdown option code; `interested_solution` ส่งค่าเดียว (single-select); merge = last-write-wins (ไม่ union); `thunder_medium` → `thunder_acquisition_medium`; เพิ่ม `SCREEN_COUNT_OPTIONS` / `USAGE_TYPE_OPTIONS` + emit `screen_count` / `usage_type`; `STATIC_PORTAL_PROPERTIES` (allowlist §5, 9 custom) + `filterToPortalProperties()` (drop property ที่ portal ไม่มี + log) |
| `src/features/crm/hubspot/connector.ts` | `createContact` / `updateContact` เรียก `filterToPortalProperties` ก่อน write; **`updateContactChannel()`** — PATCH `preferred_contact_channel` (second write, §15.7); `request()` throw ข้อความชัดเมื่อ 401/403; error/log ใช้ `HUBSPOT_SERVICE_KEY` |
| `src/features/crm/{connector,stub/connector}.ts` | เพิ่ม `updateContactChannel()` ใน interface + stub |
| `src/features/crm/{canonical,validate}.ts` | เพิ่ม `qualification: { screen_count, usage_type }` (optional, default null) |
| `src/components/talk-to-us/leadPayload.ts` | `buildLeadPayload` เติม `qualification` จาก `answers.screenCount/usageType` (เฉพาะ topic digital-signage) |
| `src/app/api/crm/lead/route.ts` | เพิ่ม **`PATCH`** handler — `{ lead_id, channel }` → `getLeadCrmContactId` → `updateContactChannel` (best-effort) |
| `src/features/db/leads.ts` | เพิ่ม `getLeadCrmContactId()` |
| `src/store/talkToUsStore.ts` | `postChannel()` — fire-and-forget `PATCH /api/crm/lead` จาก `chooseLine` / `chooseCallback` |
| `src/components/talk-to-us/config/crmLabels.ts` | `CRM_SOLUTION_LABELS` re-export จาก `@/features/crm/solutions` |
| `src/i18n/messages.ts`, `src/app/[locale]/request-demo/`, `src/features/request-demo/`, `messages/{th,en}/request-demo.json` | ลบหน้า `/request-demo` (PoC เดี่ยว ถูกแทนด้วย Talk to us wizard) |

**ไม่แตะ:** `route.ts` POST error handling (§10 ครบอยู่แล้ว); `setLeadCrmContactId` (§9); consent + `utm_medium`/`utm_campaign`/`landing_page` ใน `validate.ts` (ยังครบ, drop ตอน write)

### 15.0.1 กลไก property filter (brief §5 + §6 + §10)

- Canonical เก็บทุก field ของ brief — mapper สร้าง payload เต็ม — `filterToPortalProperties` ตัดเฉพาะตอนจะ write:
  - อ่าน schema จริงจาก portal ได้ → ส่งเฉพาะ property ที่มีจริง, log ตัวที่ drop
  - อ่าน schema ไม่ได้ (403 / network) → fallback ใช้ static allowlist §5, log ว่า fallback
- ตัวที่ถูก drop (consent×4, `thunder_utm_medium`, `thunder_utm_campaign`, `thunder_landing_page`) **ไม่หาย** — อยู่ใน payload + `leads.canonical` (jsonb) เพิ่ม mapping ทีหลังได้โดยไม่แตะ frontend

### 15.0.2 เลื่อน (ยังไม่ทำใน Step 3.2)

| รายการ | เหตุผล / ข้อมูลไปอยู่ไหน |
|---|---|
| Company / Deal / Owner association | brief §13 out of scope — `company_name` เก็บเป็น text property `company` |
| Reverse sync / webhook | brief §13 out of scope (PoC #4) |
| `libphonenumber` | `normalizeMobile` ยัง naive TH-only (D-11) — เบอร์ไทยปกติ OK |
| property เกิน Free plan (consent, utm_medium/campaign, landing_page) | brief §6 — อยู่ใน `leads.canonical` |

> `screen_count` / `usage_type` / `preferred_contact_channel` — **ทำแล้ว** (รอบ 2, 2026-09-07) ดู §15.7

---

### 15.1 PM / Portal Setup

**1. Service Key** (Development → Keys → Service Keys → "ThunderOne CRM POC")
- [x] ค่าแรกที่ส่งให้ dev **ตายแล้ว** (revoke/rotate หลังส่ง) — direct `curl` → `401 EXPIRED_AUTHENTICATION`, expire time epoch 0
- [x] PM revoke + ส่งค่าใหม่ → direct `curl GET /crm/v3/objects/contacts` → **200** ✅
- ใช้เป็น `Authorization: Bearer <HUBSPOT_SERVICE_KEY>` ตรงๆ (กลไกเดียวกับ Private App token)

**2. Scopes** — พอสำหรับ Step 3.2 แล้ว ไม่ต้องแตะ
- มี: `crm.objects.contacts` read+write, companies r/w, deals r/w, owners read
- `crm.schemas.contacts.read` **ไม่จำเป็น** — โค้ดอ่าน `GET /crm/v3/properties/contacts` ได้ด้วย `crm.objects.contacts.read` (ยืนยันจาก live run: drop-log ทำงาน ไม่มี 403)

**3. Custom Properties** — ยืนยันแล้วจาก live run (§15.4) ทั้ง 9 ตัวมีจริงใน portal ชื่อตรง เป็น single-select dropdown ทุกตัว
- `interested_solution`: `digital_signage_media` / `thunder_care` / `communication` / `asset_intelligence` / `other`
- `screen_count`: `1–5` / `6–20` / `21–50` (en-dash) / `50_plus`
- `usage_type`: `office_organization` / `multi_branch` / `public_government` / `advertising_network`
- `preferred_contact_channel`: `line` / `callback`
- code map wizard slug → option code เหล่านี้ (`SOLUTION_HUBSPOT_OPTIONS`, `SCREEN_COUNT_OPTIONS`, `USAGE_TYPE_OPTIONS`, `CHANNEL_OPTIONS`)

**4. ถ้าเทสบน Vercel**
- [ ] เพิ่ม env `HUBSPOT_SERVICE_KEY` เป็น **server-side** variable (ห้าม `NEXT_PUBLIC_`) + redeploy

---

### 15.2 Dev pre-flight

- [x] `.env` — `HUBSPOT_SERVICE_KEY=<service key ใหม่>` (ไม่มี quote/space ; `.env` อยู่ใน `.gitignore`)
- [x] `.env` — `CRM_CONNECTOR=hubspot`
- [x] **restart `pnpm dev`** (Next โหลด `.env` ตอน start เท่านั้น)
- [x] เทสด้วย `./docs/CRM/step_3_2_smoke.sh` + `./docs/CRM/step_3_2_update_test.sh`

---

### 15.3 Test Run — TC-3.2-01..07 ✅ ผ่านหมด

| TC | Action | Expected | ผล |
|---|---|---|---|
| TC-3.2-01 | Service Key จาก ENV | auth ผ่าน ไม่มี 401/403 | ✅ direct curl `GET /crm/v3/objects/contacts` → 200 ; app ไม่มี auth error |
| TC-3.2-02 | ส่ง email ใหม่ | Create Contact | ✅ `action:"created"`, `provider:"hubspot"`, `crmContactId` = เลข HubSpot, `crm_status:"ok"` ; `interested_solution` ส่ง `digital_signage_media` |
| TC-3.2-03 | ตรวจ HubSpot record | default + custom props ตรง Canonical | ✅ read-back: firstname/lastname/email/mobilephone/jobtitle/company + `interested_solution` `inquiry_message` `thunder_lead_source` `thunder_acquisition_medium` `thunder_campaign` `thunder_utm_source` ครบ ตรงค่า |
| TC-3.2-04 | email เดิมซ้ำ (~35s) | Update เดิม ไม่ duplicate | ✅ `action:"updated"`, `crmContactId` เลขเดิม, search by email → 1 result ; `interested_solution`+`inquiry_message` = last write, `thunder_utm_source` = first-touch (`facebook` ไม่ใช่ `google`) |
| TC-3.2-05 | ตรวจ response | มี HubSpot Contact ID | ✅ `crmContactId` เป็น numeric id ทั้ง create และ update |
| TC-3.2-06 | Supabase `leads` | `crm_contact_id` = id จริง | ✅ ทุก submission ได้ row ใหม่ (`lead_id` คนละตัว) และ `crm_contact_id` = HubSpot id เดียวกัน (ไม่ใช่ `STUB-xxxx`) |
| TC-3.2-07 | ส่ง field ที่ portal ไม่มี | drop + log, Canonical ครบ, flow ไม่พัง | ✅ ทุก submission log: `dropped 7 properties not in portal schema (kept in canonical): thunder_consent_status/purpose/source/timestamp, thunder_utm_medium, thunder_utm_campaign, thunder_landing_page` — ตรง brief §6 เป๊ะ ; request คืน `ok:true` |

---

### 15.4 Portal property reconciliation (จาก live run)

drop-log: `dropped 7 properties not in portal schema` = **เฉพาะ** consent×4 + utm_medium + utm_campaign + landing_page → แปลว่าอีก 6 custom + 6 default **HubSpot รับหมด** (ไม่ถูก drop = มีใน portal schema)

| ชื่อที่ code ส่ง | สถานะ portal | หมายเหตุ |
|---|---|---|
| `firstname` `lastname` `email` `mobilephone` `jobtitle` `company` | ✅ default | — |
| `interested_solution` | ✅ มี | single-select — `digital_signage_media` / `thunder_care` / `communication` / `asset_intelligence` / `other` |
| `inquiry_message` | ✅ มี | multi-line text |
| `screen_count` | ✅ มี | single-select — `1–5` / `6–20` / `21–50` (**en-dash**) / `50_plus` |
| `usage_type` | ✅ มี | single-select — `office_organization` / `multi_branch` / `public_government` / `advertising_network` |
| `preferred_contact_channel` | ✅ มี | single-select — `line` / `callback` ; เขียนผ่าน second write (§15.7) |
| `thunder_lead_source` | ✅ มี | ชื่อตรง brief §5 |
| `thunder_acquisition_medium` | ✅ มี | ชื่อตรง brief §5 (ไม่ใช่ `thunder_medium`) |
| `thunder_campaign` | ✅ มี | — |
| `thunder_utm_source` | ✅ มี | — |

→ ชื่อ property brief §5 ถูกต้องทั้งหมด ; enum ทุกตัวเป็น single-select — code เก็บ slug→option-code map ไว้ (mapper.ts / connector.ts)

---

### 15.5 Findings

- **`interested_solution` property type:** single-select **dropdown/enumeration**. Option values (internal): `digital_signage_media`, `thunder_care`, `communication`, `asset_intelligence`, `other` (ไม่ใช่ English label) — ส่ง label → `400 INVALID_OPTION` แก้: `SOLUTION_HUBSPOT_OPTIONS` map + merge เป็น last-write-wins
- **dynamic property filter:** ทำงานถูก — schema อ่านได้ด้วย `crm.objects.contacts.read`, drop เฉพาะ 7 ตัวของ brief §6, request เดินต่อ (evidence TC-3.2-07)
- **Service Key lifecycle:** ค่าที่ revoke แล้ว → `401 EXPIRED_AUTHENTICATION` + expire time epoch 0 (ไม่ใช่ 403) ; key ใหม่ต้อง restart process ถึงจะมีผล
- **Duplicate behavior** (email เดิม): HubSpot **ไม่ block** การสร้าง contact อีเมลซ้ำเอง — กันโดยฝั่งเรา (`upsertLead` search-by-email → `updateContact`) ผลจริง: submission ที่ 2 → `action:"updated"`, contact id เดิม, `POST /crm/v3/objects/contacts/search` by email → `total: 1` ; ถ้า Search API ยัง index ไม่ทันจะเข้า 409-on-create fallback (ยังได้ contact เดิม ไม่ duplicate)
- **Merge policy** ยืนยัน: `interested_solution` / `inquiry_message` = last-write-wins ; `thunder_*` acquisition/utm keys = first-touch (submission แรกชนะ, D-04)
- **Required fields:** HubSpot create ผ่านด้วย `email` อย่างเดียวก็ได้ — ไม่มี property ตัวไหนถูกบังคับใน portal นี้ ; ฝั่งเรา `validate.ts` บังคับ first_name/last_name/company_name/position/mobile/email + `interested_solutions` ≥1 ก่อนถึง HubSpot
- **`interested_solution` value:** ต้องเป็น option code เท่านั้น (`digital_signage_media` ฯลฯ) — ส่ง label หรือค่านอก list → `400 INVALID_OPTION` ทั้ง request

---

### 15.6 Coverage & caveats

**DoD §12 — ครบทั้ง 9 ข้อ ✅** (ยืนยันด้วย live run §15.3)

| # | ข้อกำหนด | สถานะ | evidence |
|---|---|---|---|
| 1 | Service Key อยู่ใน backend ENV (`HUBSPOT_SERVICE_KEY`) | ✅ | `.env` + `index.ts` อ่าน env นี้ |
| 2 | Frontend ไม่เห็น Service Key | ✅ | เรียกเฉพาะใน `route.ts` (`runtime = "nodejs"`), ไม่มี `NEXT_PUBLIC_` |
| 3 | Backend authenticate HubSpot API ได้ | ✅ | TC-3.2-01 — direct curl 200 + app ไม่มี auth error |
| 4 | Canonical map ไป property ที่มีจริง | ✅ | `filterToPortalProperties` + §15.4 (12 field เข้า, 7 field drop) |
| 5 | Create Contact สำหรับ email ใหม่ | ✅ | TC-3.2-02 — `action:"created"` + numeric id |
| 6 | Update Contact สำหรับ email เดิม ไม่ duplicate | ✅ | TC-3.2-04 — `action:"updated"`, id เดิม, search by email → 1 |
| 7 | ได้ HubSpot Contact ID กลับมา | ✅ | TC-3.2-05 — `crmContactId` ใน response |
| 8 | `leads.crm_contact_id` = HubSpot Contact ID จริง | ✅ | TC-3.2-06 — Supabase row, ไม่ใช่ `STUB-xxxx` |
| 9 | Field ที่ Free plan สร้างไม่ได้ ยังอยู่ใน Canonical + ไม่ block | ✅ | TC-3.2-07 — drop-log 7 ตัว, `leads.canonical` ครบ, `ok:true` |

**TC §11 — ครบ 7 ข้อ ✅**

**Caveat / งานที่เหลือ**

| # | เรื่อง | รายละเอียด | จัดการ |
|---|---|---|---|
| 1 | Vercel env | เทสนี้รัน local (`pnpm dev`) เท่านั้น | ตั้ง `HUBSPOT_SERVICE_KEY` เป็น server-env ของ Vercel environment + redeploy (§15.1 ข้อ 4) |
| 2 | Search API indexing lag | repeat submission เร็วเกิน ~วินาที → เข้า 409-on-create fallback | ผลยังถูก (ไม่ duplicate) แต่ `action` อาจรายงาน `created` ; เว้นจังหวะ ≥30s |
| 3 | `preferred_contact_channel` = second write | ยิง HubSpot 2 รอบ (create/update แล้ว PATCH channel) เพราะ flow persist lead ก่อนสเต็ป channel — ดู §15.7 | best-effort ; ในอนาคตถ้า restructure wizard flow ให้เลือก channel ก่อน POST จะรวมเป็น write เดียวได้ |
| 4 | consent + `utm_medium` / `utm_campaign` / `landing_page` | อยู่ใน `leads.canonical` เท่านั้น (Free-plan slots, brief §6) | เพิ่ม mapping เมื่อ upgrade plan — ไม่ต้องแตะ frontend |
| 5 | `normalizeMobile` naive TH-only | เบอร์ไทยปกติ OK, เบอร์แปลก/ต่างชาติอาจเพี้ยน (D-11) | ใช้ `libphonenumber-js` ก่อน production |

---

### 15.7 `screen_count` / `usage_type` / `preferred_contact_channel` (รอบ 2, 2026-09-07)

**`screen_count` / `usage_type` — structured, อยู่ใน POST หลัก**

- `canonical.ts` เพิ่ม `qualification: { screen_count, usage_type }` (optional, default `null` — topic อื่น + payload เก่าไม่พัง)
- `buildLeadPayload` เติมจาก `answers.screenCount` / `answers.usageType` เฉพาะ topic **digital-signage** (topic อื่น = null ; คำตอบยังอยู่ใน `inquiry_message` ด้วย)
- ค่าใน canonical เป็น **wizard slug** (`21-50`, `multi-branch`) ; mapper แปลงเป็น portal option code (`21–50` en-dash, `multi_branch`) — รับ underscore แบบ brief §4 (`21_50`) ด้วย
- topic อื่นส่ง `""` → HubSpot enum ไม่ error (เคลียร์/ไม่เขียนทับค่าเดิม)

**`preferred_contact_channel` — second write (PATCH)**

```
POST /api/crm/lead      → create/update Contact (ยังไม่รู้ channel)
   ↓ (สเต็ป channel: ผู้ใช้กด LINE / callback)
PATCH /api/crm/lead {lead_id, channel}
   → getLeadCrmContactId(lead_id) → connector.updateContactChannel(id, channel)
   → PATCH /crm/v3/objects/contacts/{id} { preferred_contact_channel }
```

- ยิง 2 รอบ เพราะ wizard flow: `details → [POST] → channel → confirmation` — lead ถูก persist **ก่อน**สเต็ป channel (flow LINE-link Step 0.12 ต้องมี `leadId` ตอนกด LINE) → ย้าย POST ไปหลัง channel จะทำให้ลำดับนั้นพัง
- `chooseLine` / `chooseCallback` เรียก `postChannel()` แบบ fire-and-forget — fail ไม่ block wizard
- route PATCH best-effort: lookup ล้มเหลว → 502 ; ไม่มี `crm_contact_id` (CRM upsert แรกพัง) → `{ ok:true, crm_status:"skipped" }` ; PATCH ล้มเหลว → `{ ok:true, crm_status:"failed" }`
- **อนาคต:** ถ้า restructure wizard ให้เลือก channel ก่อน POST ได้ (แก้ dependency กับ LINE-link) → ยุบเหลือ write เดียว

