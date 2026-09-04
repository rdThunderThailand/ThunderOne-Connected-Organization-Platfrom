# ThunderOne LINE - Step 0.12.5 to 0.12.6 Dev Brief

เอกสารนี้รวมงาน Dev ตั้งแต่ Step 0.12.5 ที่ยังเหลือฝั่ง Integration จนถึง Step 0.12.6 เพื่อให้ Talk to us flow เปิด LINE ผ่าน LIFF, ระบุตัวตน LINE user ได้ และส่ง Summary ไปหาผู้ใช้ที่ถูกต้องโดยไม่ hardcode LINE userId.

---

## 1. สถานะปัจจุบัน

| รายการ | สถานะ |
|---|---|
| LINE Messaging API | DONE |
| LINE Webhook → Backend | DONE |
| Backend → LINE Push API | DONE |
| Step 0.11 Canonical Payload → Message Builder → LINE Push | DONE |
| LINE Login Channel | DONE |
| LIFF App created | DONE |
| LIFF ID / LIFF URL ส่งให้ Dev | DONE |
| Step 0.12.5 Dev LIFF Integration | DONE (verified on device 2026-09-02) |
| lead_id | DONE — `line_user.leads.id` (uuid), created by `POST /api/crm/lead` |
| lead_token | DONE — opaque one-time `tkn_<64hex>`, 15-min, state in Supabase |
| Step 0.12.6 Identity Linking | DONE — verified end-to-end by PM 2026-09-02 (see §12) |

## 2. เป้าหมายรวม

```
Talk to us Form
  ↓
Backend creates lead_id
  ↓
Backend creates short-lived lead_token
  ↓
User clicks "คุยผ่าน LINE"
  ↓
Open LIFF URL
  ↓
LIFF init + LINE Login
  ↓
Get LINE ID token
  ↓
Send id_token + lead_token to Backend
  ↓
Backend verifies LINE identity
  ↓
Map lead_id <-> line_user_id
  ↓
Reuse Step 0.11 Message Builder
  ↓
Push Summary to correct LINE user
  ↓
No hardcoded userId
```

## 3. Step 0.12.5 - Dev LIFF Integration

ฝั่ง PM สร้าง LINE Login Channel และ LIFF App แล้ว พร้อมส่ง LIFF ID / LIFF URL ให้ Dev. งานของ Dev ใน Step นี้คือทำให้ LIFF ถูกใช้งานจริงบน Website.

### 3.1 เชื่อมปุ่ม "คุยผ่าน LINE" กับ LIFF URL

- ปุ่ม "คุยผ่าน LINE" บน Talk to us ต้องเปิด LIFF URL ที่ PM ส่งให้
- ห้ามใช้ LINE Webhook URL เป็น URL ของปุ่ม
- ต้องเปิดได้ทั้งจาก mobile และ browser ตาม flow ที่ใช้ทดสอบ PoC

### 3.2 เตรียมหน้า LIFF Endpoint

Endpoint URL ปัจจุบันตั้งไว้ที่ `https://thunder-one-connected-organization.vercel.app/th/liff/talk-to-us` << แก้ตรงนี้ 
จึงต้องรองรับ LIFF flow บนหน้า/path ที่ใช้งานจริง หรือ Dev สามารถแยก path LIFF ภายหลังได้ถ้าเหมาะกับ codebase.

- Load LINE LIFF SDK
- ใช้ LIFF ID จาก LINE Developers
- เก็บ LIFF ID ใน config/environment ที่เหมาะสม
- หน้า LIFF ต้องเปิดได้ผ่าน HTTPS

### 3.3 Initialize LIFF

```js
await liff.init({
  liffId: process.env.NEXT_PUBLIC_LINE_LIFF_ID
});
```

Definition ของ Step 0.12.5: ปุ่มเปิด LIFF ได้จริง, หน้า LIFF initialize สำเร็จ และพร้อมเข้าสู่ login/identity flow.

### 3.4 Acceptance Test - Step 0.12.5

| TC | Action | Expected |
|---|---|---|
| TC-0.12.5-01 | กด "คุยผ่าน LINE" | เปิด LIFF URL |
| TC-0.12.5-02 | LIFF page โหลด | หน้าเปิดได้ผ่าน HTTPS |
| TC-0.12.5-03 | LIFF initialize | `liff.init()` สำเร็จ |

## 4. Step 0.12.6 - Lead / LINE Identity Linking

หลัง Step 0.12.5 ใช้งาน LIFF ได้แล้ว ให้ทำ identity linking เพื่อรู้ว่า Website Lead คนใดตรงกับ LINE user คนใด.

### 4.1 สร้าง lead_id หลัง Submit Form

- Backend ต้องสร้าง internal lead_id ให้ทุก Talk to us submission
- lead_id ไม่ควรใช้ email/mobile/LINE userId เป็น ID หลัก
- รูปแบบจะใช้ UUID, database ID หรือ LEAD-xxxx ก็ได้ตามมาตรฐานทีม
- lead_id ต้องอ้างกลับไปยัง Canonical Payload ของ submission ได้

Example:
```json
{
  "lead_id": "LEAD-000123",
  "line_user_id": null,
  "line_identity_status": "unlinked"
}
```

### 4.2 สร้าง short-lived lead_token

- สร้าง random token ที่ผูกกับ lead_id ฝั่ง server
- ควรหมดอายุประมาณ 10-30 นาที หรือค่าที่ทีมกำหนด
- ควรใช้ได้ครั้งเดียว (one-time)
- หลัง link สำเร็จให้ mark used/consumed
- ห้ามใช้ email/mobile/customer data แทน token

```
lead_token = "tkn_x9F8..."
  ↓
lead_id = "LEAD-000123"
```

### 4.3 ส่ง lead_token เข้า LIFF Flow

หลัง form submit และ user เลือก "คุยผ่าน LINE" ให้ LIFF flow ได้รับ lead_token เพื่อให้ Backend รู้ว่า LINE identity ที่กำลัง login นี้มาจาก lead ใด.

Concept example only:
```
https://liff.line.me/<LIFF_ID>?lead_token=tkn_x9F8...
```

### 4.4 LIFF Login + Get ID Token

1. เรียก `liff.init()`
2. เช็ก `liff.isLoggedIn()`
3. ถ้ายังไม่ login ให้เรียก `liff.login()`
4. หลัง login สำเร็จให้เรียก `liff.getIDToken()`
5. อ่าน lead_token จาก flow
6. ส่ง id_token + lead_token ไป Backend

```js
const idToken = liff.getIDToken();

POST /api/line/link-lead
{
  "lead_token": "tkn_x9F8...",
  "id_token": "<LINE_ID_TOKEN>"
}
```

### 4.5 Backend Verify LINE Identity

- Validate lead_token
- ตรวจ expiry / used status
- Verify LINE ID token ฝั่ง server
- resolve verified LINE user identifier จาก token
- ห้าม trust line_user_id ที่ client ส่งมาเอง

### 4.6 สร้าง Identity Mapping

```json
{
  "lead_id": "LEAD-000123",
  "line_user_id": "Uxxxxxxxxxxxxxxxx",
  "line_identity_status": "linked"
}
```

- บันทึก lead_id <-> line_user_id
- บันทึก linked_at
- mark lead_token เป็น used
- ถ้า lead ถูก link กับ LINE user อื่นอยู่แล้ว ห้าม overwrite แบบเงียบ ๆ

### 4.7 Reuse Step 0.11 และถอด hardcoded userId

หลัง link สำเร็จ ไม่ต้องสร้าง Message Builder ใหม่. ให้ใช้ function/service จาก Step 0.11 แล้วส่งไปยัง line_user_id ที่ได้จาก mapping.

```js
// Before:
sendLineMessage(HARDCODED_USER_ID, summary)

// After:
sendLineMessage(linkedLineUserId, summary)
```

## 5. Security Requirements

- LINE Channel Secret และ Messaging API Channel Access Token อยู่ Backend เท่านั้น
- ห้าม hardcode secret ใน frontend/repository
- ห้าม log raw ID token / Channel Access Token / Channel Secret แบบเต็ม
- ใช้ HTTPS
- lead_token ต้อง random + short-lived + one-time
- Backend ต้อง verify LINE ID token ก่อนสร้าง mapping

## 6. Error Handling ขั้นต่ำ

| กรณี | Expected |
|---|---|
| lead_token ไม่ถูกต้อง | Reject / ไม่ link |
| lead_token หมดอายุ | ให้ user เริ่ม flow ใหม่ |
| lead_token ถูกใช้แล้ว | Reject reuse |
| ไม่มี id_token | ให้ login ใหม่ |
| ID token verify ไม่ผ่าน | ไม่สร้าง mapping |
| Lead ถูก link กับ LINE user อื่นแล้ว | ไม่ overwrite อัตโนมัติ |
| Push Summary ล้มเหลว | log error และแยกสถานะ link กับ message delivery |

## 7. Acceptance Test - Step 0.12.6

| TC | Action | Expected |
|---|---|---|
| TC-01 | Submit Talk to us | สร้าง lead_id |
| TC-02 | หลัง submit | สร้าง lead_token + expiry |
| TC-03 | กดคุยผ่าน LINE | LIFF ได้ lead context |
| TC-04 | LINE Login | ได้ ID token |
| TC-05 | เรียก link API | verify id_token + lead_token สำเร็จ |
| TC-06 | Identity Mapping | lead_id <-> line_user_id ถูกบันทึก |
| TC-07 | Push Summary | ข้อความไป LINE account ที่ถูกต้อง |
| TC-08 | เปลี่ยนทดสอบอีก LINE account | ข้อความไป account ใหม่ ไม่ใช่ hardcoded user |
| TC-09 | Reuse token | ถูก reject |
| TC-10 | Expired token | ถูก reject |

## 8. Definition of Done รวม Step 0.12.5 + 0.12.6

- ปุ่ม "คุยผ่าน LINE" เปิด LIFF URL ได้จริง
- LIFF page initialize สำเร็จ
- LINE Login / get ID token ทำงานได้
- ทุก form submission มี lead_id
- ระบบสร้าง lead_token ที่มี expiry / one-time use ได้
- LIFF ส่ง id_token + lead_token เข้า Backend ได้
- Backend verify LINE identity ได้
- Backend map lead_id <-> line_user_id ได้
- Summary จาก Step 0.11 ถูกส่งไปยัง linked user
- ไม่มี hardcoded LINE userId ใน end-to-end flow

## 9. Out of Scope

- HubSpot Contact / Company / Deal
- CRM reverse sync
- Customer 360 / CDP
- Advanced membership/account linking

## 10. Output ที่ PM ต้องขอจาก Dev

- ยืนยัน route/page ที่ใช้เป็น LIFF frontend จริง
- ยืนยันว่า `liff.init()` ทำงานแล้ว
- API/route ที่สร้าง lead_id / lead_token
- API identity linking ที่ใช้จริง
- ตัวอย่าง success response แบบไม่เปิดเผย secret
- หลักฐาน mapping lead_id <-> line_user_id
- ผล test ของ Step 0.12.5 และ 0.12.6
- ยืนยันว่า hardcoded LINE userId ถูกถอดออกแล้ว

## 11. ข้อความสำหรับ Assign Dev

Please complete Step 0.12.5 + 0.12.6 end-to-end: integrate the existing LIFF ID/LIFF URL with the "คุยผ่าน LINE" button and initialize LIFF; then implement lead_id + short-lived one-time lead_token, LIFF login/get ID token, backend token verification, lead_id <-> line_user_id mapping, and reuse Step 0.11 to push the Talk to us summary to the linked LINE user without hardcoded userId. Include expiry, error handling and test results according to this brief.

---

## 12. Implementation (Dev) — 2026-09-02

Branch `feat/Line-liff-integration` → merged to `dev` (PR #13). Commit
`feat(line): Step 0.12.6 — persist lead ↔ LINE identity in Supabase`.

Step 0.12.5 (ปุ่ม → LIFF URL → `liff.init()`) ทำเสร็จ + verify บนเครื่องจริง
ตั้งแต่รอบก่อน. งานรอบนี้คือ **0.12.6 + เปลี่ยนที่เก็บ state จาก stateless
signed token เป็น Supabase**.

### 12.1 ทำอะไร เพื่อให้ตรงกับ brief ข้อไหน เพราะอะไร

| brief | ทำอะไร | ทำไมทำแบบนี้ |
|---|---|---|
| §4.1 `lead_id` ทุก submission + อ้างกลับ canonical | `POST /api/crm/lead` insert 1 row/submission ลง `line_user.leads` (เก็บ canonical payload ทั้งก้อนใน `jsonb`) แล้วคืน `lead_id` (uuid). **leads-first**: เขียน lead row ก่อน แล้วค่อยเรียก CRM connector | lead ต้องมี id ก่อน flow LINE จะเริ่มได้; CRM ล่มไม่ควรทำ lead หาย → CRM upsert เป็น best-effort, ล้มแล้วยังคืน `{ok:true, lead_id, crmContactId:null, crm_status:"failed"}` |
| §4.2 token สั้น + one-time | token = `tkn_<64 hex>` สุ่มจาก `crypto.randomBytes(32)`; เก็บแค่ `sha256(token)` ใน `line_user.lead_link_tokens`; TTL 15 นาที; one-time บังคับด้วย `UPDATE ... SET consumed_at=now() WHERE token_hash=$1 AND consumed_at IS NULL AND expires_at>now()` (0 row = reject) | เลือก **opaque + state ใน DB** แทน signed token: ไม่มี secret ให้ดูแล, summary ไม่โผล่ใน URL/log, มี source of truth เดียว, **one-time บังคับได้จริงข้าม serverless instance** (signed token เดิมทำไม่ได้ — replay ได้จนหมดอายุ) |
| §4.3 ส่ง token เข้า LIFF | `?lead_token=tkn_...` บน LIFF URL (เหมือน 0.12.5) | — |
| §4.4 LIFF login + ID token | `liff.init()` → `isLoggedIn()` → `login()` → `getIDToken()` → `POST /api/line/link-lead` (เหมือน 0.12.5) | — |
| §4.5 backend verify identity | `verifyLineIdToken()` POST ไป `https://api.line.me/oauth2/v2.1/verify` (`client_id=LINE_LOGIN_CHANNEL_ID`), re-check `aud`, คืน `sub`. ลำดับ: peek token → verify id_token → link → **consume token** → push | verify **ก่อน** consume → id_token พังไม่เผา token (retry ได้); consume **หลัง** link สำเร็จ → link ที่โดน reject ไม่เสีย token ฟรี; ไม่เคยรับ `userId` จาก client |
| §4.6 identity mapping + `linked_at` + mark used + ห้าม overwrite เงียบ | `linkLeadToLineUser()` = `UPDATE line_user.leads SET line_user_id=$sub, line_identity_status='linked', linked_at=now() WHERE id=$lead AND (line_user_id IS NULL OR line_user_id=$sub)`. 0 row + มี `line_user_id` อื่นอยู่ → `409 linked_to_other_user`. `sub` เดิม → idempotent success. token `consumed_at` ถูก set | guard อยู่ใน `WHERE` → race กับ request อื่นจบที่ DB ไม่ใช่ที่ read. **ไม่ใส่** `unique(line_user_id)` → คนเดิมมีหลาย inquiry (หลาย lead) link LINE เดียวกันได้ ซึ่งเป็นเคสปกติของ lead capture |
| §4.7 reuse Step 0.11 + ถอด hardcoded userId | `link-lead` เรียก `buildLineLeadSummary()` (ตัวเดิมจาก Step 0.11) → `pushLineMessages(sub, ...)`. **ลบ** `/api/line/lead-summary` route + env `LINE_TEST_USER_ID` + `src/features/line/leadToken.ts` ออกจาก repo | ไม่เหลือ hardcoded LINE userId ที่ไหนเลย (ไม่ใช่แค่ "ไม่เรียกใน flow") — ตรวจ repo แล้วสะอาด |

### 12.2 Security (§5)

| §5 | ทำ |
|---|---|
| Channel Secret / Access Token อยู่ backend | ไม่เปลี่ยน — server env เท่านั้น |
| ห้าม hardcode secret ใน repo | `.env` gitignored; ลบ `LINE_LEAD_TOKEN_SECRET` (ไม่ใช้แล้ว) |
| ห้าม log token / id_token เต็ม | `link-lead` log แค่ `lineUserId` แบบ mask (`U1a2b…`) + สถานะ ไม่มี token |
| HTTPS | Vercel |
| token random + short-lived + one-time | 256-bit random, 15 นาที, one-time ผ่าน DB |
| verify ID token ก่อนสร้าง mapping | ทำ — link เกิดหลัง `verifyLineIdToken()` ผ่านเท่านั้น |
| `SUPABASE_SERVICE_ROLE_KEY` (ใหม่) | server-only, ไม่มี `NEXT_PUBLIC_`, ไม่ log; RLS เปิดบนทั้ง 2 ตาราง (ไม่มี policy → anon key แตะไม่ได้, service_role bypass) |

### 12.3 Error handling (§6)

| กรณี | HTTP + response |
|---|---|
| `lead_token` ไม่มีจริง / รูปแบบผิด | `401 { error: "invalid_lead_token" }` |
| `lead_token` หมดอายุ | `410 { error: "lead_token_expired" }` → user เริ่ม flow ใหม่ |
| `lead_token` ถูกใช้แล้ว (รวมเคส race) | `409 { error: "lead_token_used" }` |
| ไม่มี `id_token` ใน body | `422 { error: "validation_failed" }` |
| ID token verify ไม่ผ่าน | `401 { error: "line_identity_unverified" }` — ไม่สร้าง mapping, ไม่แตะ token |
| lead ถูก link กับ LINE user อื่นแล้ว | `409 { error: "linked_to_other_user" }` — ไม่ overwrite |
| push summary ล้มเหลว | `200 { ok:true, line_identity_status:"linked", summary_delivered:false }` — **link commit แล้ว, delivery เป็นสถานะแยก** (`leads.summary_delivered_at` = null), log error ไว้ retry มือ |
| env ไม่ครบ | `500 { error: "server_misconfigured" }` |

### 12.4 Schema — `supabase/schema.sql` (schema `line_user`)

| ตาราง | คอลัมน์ |
|---|---|
| `line_user.leads` | `id uuid pk`, `canonical jsonb`, `crm_contact_id text`, `line_user_id text`, `line_identity_status text` (`unlinked`\|`linked`), `linked_at timestamptz`, `summary_delivered_at timestamptz`, `created_at timestamptz` |
| `line_user.lead_link_tokens` | `token_hash text pk` (= sha256), `lead_id uuid → leads.id on delete cascade`, `line_summary jsonb`, `expires_at timestamptz`, `consumed_at timestamptz`, `created_at timestamptz` |

RLS เปิดทั้งสองตาราง ไม่มี policy. ใช้ Postgres schema แยก (namespace) ไม่ปนกับ `public`.

**ตั้งค่า schema ต้องครบ 3 ขั้น** (schema ที่สร้างมือ Supabase ไม่ auto-config ให้เหมือน `public`):
1. รัน `supabase/schema.sql` ใน SQL Editor
2. Dashboard → Settings → Data API → **Exposed schemas** → เพิ่ม `line_user` (ไม่งั้น `PGRST106 Invalid schema`)
3. `grant usage on schema line_user to service_role` + `grant all on all tables ...` + `alter default privileges ...` (อยู่ท้าย `schema.sql`) (ไม่งั้น `42501 permission denied for schema line_user`)

### 12.5 API contract (ตัวอย่าง success — ไม่มี secret)

```
POST /api/crm/lead        { <canonical payload> }
  → 200 { ok:true, lead_id:"<uuid>", crmContactId:"STUB-1000", provider:"stub", action:"created", crm_status:"ok" }

POST /api/line/lead-token { lead_id:"<uuid>", line_summary:{ first_name, interested_solution, qualification:{screen_count,usage_type}, contact_preference:{channel} } }
  → 200 { ok:true, lead_token:"tkn_<64hex>", expires_in:900 }

POST /api/line/link-lead  { lead_token:"tkn_...", id_token:"<LINE ID token>" }
  → 200 { ok:true, lead_id:"<uuid>", line_user_id:"U...", line_identity_status:"linked", summary_delivered:true }
```

### 12.6 ไฟล์

| การกระทำ | ไฟล์ |
|---|---|
| สร้าง | `supabase/schema.sql` · `src/features/db/{client,leads,leadLinkTokens,index}.ts` |
| แก้ | `src/app/api/crm/lead/route.ts` · `src/app/api/line/lead-token/route.ts` · `src/app/api/line/link-lead/route.ts` · `src/store/talkToUsStore.ts` · `src/features/line/{index.ts,LiffTalkToUsClient.tsx}` · `src/app/[locale]/liff/talk-to-us/page.tsx` · `src/features/line/README.md` |
| ลบ | `src/app/api/line/lead-summary/route.ts` · `src/features/line/leadToken.ts` |
| env เพิ่ม | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (server-only) |
| env ลบ | `LINE_LEAD_TOKEN_SECRET`, `LINE_TEST_USER_ID` |

### 12.7 Acceptance test status

| TC | ผล | หมายเหตุ |
|---|---|---|
| TC-0.12.5-01/02/03 | ✅ ผ่าน | verify บนเครื่องจริง 2026-09-02 |
| TC-01 submit → `lead_id` | ✅ ผ่าน | local smoke + PM device — row ใน `line_user.leads` (`unlinked`) |
| TC-02 `lead_token` + expiry | ✅ ผ่าน | `tkn_<64hex>` + row (`expires_at` = created +15 นาที) |
| TC-03 LIFF ได้ lead context | ✅ ผ่าน | `?lead_token=` |
| TC-04 LINE Login → ID token | ✅ ผ่าน | PM device test 2026-09-02 — link เกิดจริง = ได้ `id_token` |
| TC-05 link API verify | ✅ ผ่าน | PM device — verify `id_token` + `lead_token` สำเร็จ (garbage id_token → 401 ด้วย) |
| TC-06 mapping ถูกบันทึก | ✅ ผ่าน | PM device — 2 row `linked` + `linked_at` ใน DB (§12.11) |
| TC-07 push ไป account ที่ถูก | ✅ ผ่าน | PM device — `summary_delivered_at` set ~2 วิ หลัง `linked_at` |
| TC-08 บัญชี LINE ที่ 2 | ✅ ผ่าน | PM device — 2 row `line_user_id` **คนละตัว** (`Ua586…` / `Ub8af…`), ไม่ใช่ hardcoded |
| TC-09 reuse token → reject | ✅ ผ่าน (local smoke) | forced-consume → `409 lead_token_used` · token 2 ตัวจาก PM test มี `consumed_at` set |
| TC-10 expired token → reject | ✅ ผ่าน (local smoke) | forced-expiry → `410 lead_token_expired` |
| guard "linked กับ user อื่น" | ⏳ ยังไม่ทดสอบ | logic-only: `409 linked_to_other_user` (ต้อง re-link lead เดิมด้วยอีก account) |
| 5a push fail → `summary_delivered:false` | ⏳ ยังไม่ทดสอบ | logic-only (push สำเร็จทั้ง 2 ครั้งของ PM) |

local smoke = `next start` + curl ยิงจริงกับ Supabase (ลบ row ทดสอบทิ้งแล้ว).
PM device test = PM กรอก Talk to us บน prod จาก 2 บัญชี LINE จริง.
tsc / eslint (ไฟล์ที่แก้) / `next build` ผ่านทั้งหมด.

### 12.8 Definition of Done (§8)

| DoD | สถานะ |
|---|---|
| ปุ่มเปิด LIFF URL | ✅ |
| LIFF initialize | ✅ |
| LINE Login / get ID token | ✅ (PM device) |
| ทุก submission มี `lead_id` | ✅ — `/api/crm/lead` |
| `lead_token` expiry + one-time | ✅ — DB, cross-instance |
| LIFF ส่ง `id_token + lead_token` | ✅ |
| backend verify identity | ✅ (PM device) |
| backend map `lead_id ↔ line_user_id` | ✅ **verified** (PM device — §12.11) |
| summary จาก Step 0.11 ส่งไป linked user | ✅ **verified** (PM device) |
| ไม่มี hardcoded LINE userId | ✅ — ลบ route + env ออกจาก repo; PM test 2 บัญชี ข้อความไปถูกทั้งคู่ |

**Step 0.12.5 + 0.12.6 = DONE** (verified end-to-end บนเครื่องจริงโดย PM 2026-09-02).

### 12.9 ยังเหลือ

1. ~~Vercel redeploy ให้เห็น env Supabase~~ — เสร็จแล้ว
2. ~~PM: LIFF Endpoint URL → `/th/liff/talk-to-us` · publish channel / เพิ่ม tester~~ — เสร็จแล้ว
3. commit 3 อย่างที่ staged: `supabase/schema.sql` (บล็อก grant) · `lead-token/route.ts` (env diagnostic) · §12 นี้
4. (optional) ทดสอบ guard "linked กับ user อื่น" + 5a push-fail · ถอด env-diagnostic endpoint ออกทีหลัง

### 12.11 หลักฐาน mapping (§10) — `line_user.leads` (PM device test 2026-09-02)

| lead_id | line_user_id | linked_at | summary_delivered_at | crm_contact_id |
|---|---|---|---|---|
| `5887a16a…` | `Ua586…` | 2026-09-02 10:49:20Z | 2026-09-02 10:49:22Z | STUB-1001 |
| `0aaade60…` | `Ub8af…` | 2026-09-02 10:45:22Z | 2026-09-02 10:45:24Z | STUB-1000 |

`line_user_id` คนละค่า = ไม่มี hardcoded recipient · `lead_link_tokens` ทั้ง 2 row `consumed_at` set = one-time ทำงาน.

### 12.10 PoC simplifications / นอก scope (§9)

- ไม่ sync `line_user_id` เข้า HubSpot / ไม่ทำ Company/Deal / Customer 360 / account linking (ตาม §9)
- link + consume token เป็น 2 คำสั่ง sequential ไม่ใช่ 1 transaction (race window เล็ก, PoC รับได้)
- push ที่ล้มเหลว log ไว้เฉย ๆ ไม่มี auto-retry / queue
- `line_summary` ส่งมาจาก client ตอน mint token (เป็น display text เข้า LINE ของเจ้าตัวเอง ความเสี่ยงต่ำ) — ยังไม่ rebuild จาก `leads.canonical` ฝั่ง server
- เขียน DB ด้วย `service_role` (god-mode) ไม่ใช่ scoped Postgres role
- ไม่มี PDPA consent re-check ก่อน push