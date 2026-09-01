# Step 0.11 — Talk to us → LINE Summary — สรุปการ implement

> Brief ต้นทาง: [`lineOA 1sep.md`](./lineOA%201sep.md)
> Round-1 webhook (มาก่อนหน้า): [`lineOA 31aug.md`](./lineOA%2031aug.md)
> วันที่: 2026-09-01 · Branch: `feat/CRMQuestion`

---

## 1. ขอบเขตที่ตกลง (จาก grilling session)

- **Backend**: Message Builder แปลง lead → ข้อความสรุปภาษาไทย + push เข้า LINE ผ่าน endpoint เฉพาะ โดยใช้ LINE userId ที่ **hardcode** ผ่าน env var
- **Frontend**: ปรับชุดคำถาม Talk-to-us **เฉพาะหัวข้อ Digital Signage** ให้เก็บ "จำนวนจอ" + "ลักษณะการใช้งาน" และให้ wizard ยิง endpoint หลังผู้ใช้เลือก "คุยผ่าน LINE" (fire-and-forget)
- **ไม่แตะ** canonical CRM payload schema (`src/features/crm/*`)
- **ไม่ทำ**: Lead ↔ LINE identity linking จริง, LIFF, HubSpot, consent gate, Flex message, หัวข้ออื่นนอกจาก DS (เลื่อนไป Step 0.12)

### สรุป decision สำคัญ

| # | ประเด็น | ผลสรุป |
|---|---|---|
| 1 | trigger การ push | endpoint เฉพาะ `POST /api/line/lead-summary` (ไม่ผูกกับ `/api/crm/lead`) |
| 2 | input ของ builder | type ใหม่เฉพาะ LINE (`LineLeadSummaryInput`) — ไม่ใช้ canonical payload |
| 3 | ชุดคำถาม DS | เหลือ 2 ข้อ: `screenCount` (ตัด `none`) + `usageType` (ใหม่); ลบ `contentManagement` + `contentTypes` |
| 4 | slug convention | ใช้ dash ทั้งหมด (`21-50`, `multi-branch`) — underscore ใน brief §4 ถือเป็น "ตารางอ้างอิง display" |
| 5 | frontend เรียก push เอง | ใช่ — จาก `chooseLine()` แบบ fire-and-forget เมื่อ topic = digital-signage |
| 6 | LINE userId | env var `LINE_TEST_USER_ID`; ไม่มีค่า → endpoint ตอบ 500 |
| 7 | ข้อความสรุป | ลอกจาก brief §5 เป๊ะ (มี "ครับ" + 👋) |
| 8 | non-DS topic | frontend ไม่ยิง endpoint; builder เองไม่ gate topic |
| 9 | label map | ไฟล์ใหม่ `summaryLabels.ts` (ไทย hardcode) แยกจาก i18n และ `crmLabels.ts` |
| 10 | response / error | zod validate → 422; push fail → 502; token/userId หาย → 500; สำเร็จ → `{ ok, preview }` |
| 11 | consent gate | ไม่ทำในรอบนี้ (มี `// TEMPORARY` โน้ตไว้) |

---

## 2. Flow ที่ได้

```
กรอกฟอร์ม Talk-to-us (Digital Signage)
        │  topic → questions(screenCount, usageType) → details(+consent)
        ▼
  POST /api/crm/lead        ← ของเดิม ไม่เปลี่ยน
        ▼
  channel step → กด "คุยผ่าน LINE"  → chooseLine()
        │
        ├─ (topic === "digital-signage")
        │     buildLeadSummaryPayload(state)  → LineLeadSummaryInput (snake_case)
        │     void fetch POST /api/line/lead-summary   ← fire-and-forget
        │            │
        │            ├─ zod validate            → 400 / 422
        │            ├─ buildLineLeadSummary()  → ข้อความไทยตาม §5
        │            └─ pushLineMessages(LINE_TEST_USER_ID, [text])  → 502 ถ้า LINE ปฏิเสธ
        │                   ▼
        │              LINE OA → มือถือ test user เด้งข้อความสรุป
        ▼
  confirmation step (แสดงเสมอ ไม่รอผล push)
```

---

## 3. งานแยกตามหัวข้อ

### 3.1 Message Builder (แกนหลัง backend)

**ทำอะไร:** ฟังก์ชัน pure ที่รับ DTO ของ lead แล้วคืน string ข้อความสรุปภาษาไทยตาม brief §5 — แปลง slug ภายใน (`21-50`, `multi-branch`, `line`) เป็นข้อความ display ผ่าน label map; slug ที่ไม่รู้จัก fallback เป็น slug ดิบ (เสียงดังแต่ไม่พัง เหมือน `crmLabels.ts`)

**ไฟล์ที่สร้าง:** `src/features/line/buildLeadSummary.ts`

**เพราะอะไร:**
- แยกเป็นไฟล์ของตัวเองเพราะ brief §6 นิยาม `buildLineLeadSummary(payload)` เป็นหน่วยงานอิสระ
- `LineLeadSummaryInput` เป็น **type เฉพาะของ LINE** ไม่ใช่ `CanonicalLeadPayload` เพราะเว็บไม่ได้ส่ง `qualification` / `contact_preference` เข้า canonical schema และมี decision เดิมว่า "ไม่แก้ schema" — การ decouple ทำให้ Step 0.12 เพิ่ม adapter ได้โดยไม่แตะ `src/features/crm`
- zod schema (`lineLeadSummaryInputSchema`) คุมแค่รูปร่าง + string ไม่ว่าง ไม่ enum ค่า slug (ให้ fallback ทำงาน)

### 3.2 Label / copy map ภาษาไทย

**ทำอะไร:** เก็บ (ก) map `slug → ข้อความไทย` สำหรับ `screen_count` / `usage_type` / `channel` ตรงตามคอลัมน์ Display ใน brief §4 และ (ข) template ข้อความตาม brief §5 (ลอกเป๊ะ รวม "ครับ", 👋, การเว้นบรรทัด) — บรรทัดค่าเติมโดย builder

**ไฟล์ที่สร้าง:** `src/features/line/summaryLabels.ts`

**เพราะอะไร:**
- เป็น copy ที่ส่งหาลูกค้าผ่าน LINE — ไม่ขึ้นกับ locale ของเว็บ จึง**ไม่ใช่** i18n ใน `messages/{th,en}/talk-to-us.json`
- **ไม่ใช่** `src/components/talk-to-us/config/crmLabels.ts` ด้วย เพราะอันนั้นเป็นภาษาอังกฤษสำหรับ CRM — เหตุผลเดียวกับที่ `crmLabels.ts` แยกจาก i18n อยู่แล้ว (แก้ marketing copy ต้องไม่ขยับค่าที่ส่งลูกค้า/CRM)
- รอบนี้มีแค่ `th` — โครงสร้างเผื่อเพิ่ม `en` ทีหลังได้ (builder รับ map เป็น argument)

### 3.3 API endpoint

**ทำอะไร:** `POST /api/line/lead-summary` — อ่าน `LINE_TEST_USER_ID` → parse JSON → zod validate → `buildLineLeadSummary()` → `pushLineMessages(testUserId, [text])`; มี `GET` health check

| กรณี | response |
|---|---|
| สำเร็จ | `200 { ok: true, preview: "<ข้อความที่ push>" }` |
| body ไม่ใช่ JSON | `400 { ok: false, error: "invalid_json" }` |
| field ไม่ครบ/ผิดรูป | `422 { ok: false, error: "validation_failed", issues: [...] }` |
| LINE API ปฏิเสธ | `502 { ok: false, error: "line_push_failed", detail }` + `console.error` |
| `LINE_TEST_USER_ID` หรือ `LINE_CHANNEL_ACCESS_TOKEN` หาย | `500 { ok: false, error: "server_misconfigured" }` |

**ไฟล์ที่สร้าง:** `src/app/api/line/lead-summary/route.ts`

**เพราะอะไร:**
- endpoint แยก (ไม่ bolt ต่อท้าย `/api/crm/lead`) → ทดสอบเดี่ยวด้วย curl ได้, ไม่ทำให้ route CRM แปดเปื้อน, และเป็นจุดที่ Step 0.12 ให้ frontend เรียกต่อได้พอดี
- `preview` ใน response ใส่ไว้เพื่อ debug ตอน curl (เป็นข้อความเดียวกับที่ push จริง)
- **ไม่มี** `export const runtime` — Next.js 16 กำหนดให้ `nodejs` เป็น default และ Edge runtime ถูก deprecate (อ่าน `node_modules/next/dist/docs/.../route-segment-config/runtime.md` ตาม AGENTS.md) — ต่างจาก `webhook/route.ts` ที่ยัง pin ไว้เพราะใช้ `node:crypto`
- validate ด้วย zod แพตเทิร์นเดียวกับ `/api/crm/lead` (`parseCanonicalLead`)

### 3.4 Frontend — ปรับชุดคำถาม Digital Signage

**ทำอะไร:** ลดคำถาม DS จาก 3 → 2 ข้อ ให้ตรงกับ mockup และ brief §4

| เดิม | ใหม่ |
|---|---|
| `screenCount` — 5 ตัวเลือก (มี `none`) | `screenCount` — 4 ตัวเลือก (`1-5` / `6-20` / `21-50` / `50-plus`), label → "ตอนนี้คุณดูแลจอ ประมาณกี่จอ?" |
| `contentManagement` — central / per-branch / hybrid / unsure | **ลบ** → `usageType` (single) — `office-organization` / `multi-branch` / `public-government` / `advertising-network`, label → "ลักษณะการใช้งานหลักคือ?" |
| `contentTypes` — multi-select 6 ตัวเลือก | **ลบทั้งข้อ** |

**ไฟล์ที่แก้:**
- `src/components/talk-to-us/config/questions.ts` — DS set ใน `QUESTIONS_BY_TOPIC`
- `src/components/talk-to-us/config/crmLabels.ts` — ลบ `contentManagement` / `contentTypes` + `screenCount.none` ออกจาก `CRM_QUESTION_LABELS` / `CRM_OPTION_LABELS`; เพิ่ม `usageType` (label EN สำหรับ CRM: "Primary usage pattern" + 4 option)
- `messages/th/talk-to-us.json` — `questions.sets.digital-signage`
- `messages/en/talk-to-us.json` — เช่นเดียวกัน (label EN: "About how many screens do you manage now?" / "How will you mainly use them?")

**เพราะอะไร:**
- brief §2/§4 ต้องการเก็บ "จำนวนจอ" + "ลักษณะการใช้งาน" เป็น Quick Questions ที่ป้อน LINE summary; `contentManagement` (ใครจัดการเนื้อหา) คนละความหมายกับ `usageType` (ใช้งานที่ไหน/แบบไหน) จึงแทนที่ ไม่ใช่ rename
- `contentTypes` ไม่อยู่ใน mockup และไม่เกี่ยวกับ summary → ตัดออก
- `ConfirmationStep.tsx` และ `buildInquiryMessage()` (`leadPayload.ts`) วน loop ตาม `QUESTIONS_BY_TOPIC` อยู่แล้ว → **ไม่ต้องแก้** ปรับตามอัตโนมัติ
- `QuestionsStep.tsx` มี gate `allAnswered` → ผู้ใช้ตอบครบทั้ง 2 ข้อก่อนไป step ถัดไปเสมอ → DTO มี `screen_count` + `usage_type` เสมอ

### 3.5 Frontend — DTO builder

**ทำอะไร:** แปลง state ของ wizard (camelCase) → `LineLeadSummaryInput` (snake_case ตาม brief §6)

```ts
{
  first_name: state.firstName.trim(),
  interested_solution: "Digital Signage & Media",   // จาก CRM_SOLUTION_LABELS["digital-signage"]
  qualification: {
    screen_count: state.answers.screenCount?.[0] ?? "",
    usage_type:   state.answers.usageType?.[0] ?? "",
  },
  contact_preference: { channel: "line" },
}
```

**ไฟล์ที่สร้าง:** `src/components/talk-to-us/leadSummaryPayload.ts`

**เพราะอะไร:**
- รูปร่างต่างจาก canonical payload (`leadPayload.ts`) → แยกไฟล์คู่ขนานกัน ชื่อสื่อความ
- `import type { LineLeadSummaryInput }` เป็น type-only → ถูก strip ตอน build ไม่ลาก `zod` / โค้ด server เข้า client bundle (ยืนยันด้วย `next build` ผ่าน)
- `interested_solution` ส่งมาใน DTO (ไม่ hardcode ใน builder) เพื่อให้ `buildLineLeadSummary()` เป็น pure/general ตาม brief §6

### 3.6 Frontend — ยิง push จาก wizard

**ทำอะไร:** ใน `chooseLine()` — ถ้า `selectedTopic === "digital-signage"` ให้ `void fetch("/api/line/lead-summary", { POST, body: buildLeadSummaryPayload(...) }).catch(() => {})` แล้ว `set({ step: "confirmation" })` ต่อทันที ไม่รอผล

**ไฟล์ที่แก้:** `src/store/talkToUsStore.ts` (action `chooseLine` + import)

**เพราะอะไร:**
- brief §10 DoD "LINE user ได้รับข้อความที่ข้อมูลตรงกับ Form" + test case #4 "ตรวจมือถือ" → ต้อง end-to-end
- gate ที่ `digital-signage` เพราะ `channel` step โผล่ทุกหัวข้อ แต่ scope คือ DS เท่านั้น (brief §2, §11)
- fire-and-forget เพราะ push ที่ fail **ต้องไม่บล็อก** confirmation — lead เข้า CRM ไปแล้วตั้งแต่ step `details`
- แพตเทิร์น `fetch` inline สอดคล้องกับ `submitLead()` ที่มีอยู่

### 3.7 Environment variable

**ทำอะไร:** เพิ่ม `LINE_TEST_USER_ID` — LINE userId ปลายทางเดียวที่ hardcode ไว้สำหรับ push

**ไฟล์ที่แก้:** `.env` (gitignored — เพิ่มบรรทัดว่าง + คอมเมนต์), `src/features/line/README.md` (ตาราง Env)

**เพราะอะไร:**
- เข้าชุดกับ `LINE_CHANNEL_*` ที่เป็น env อยู่แล้ว; LINE userId เป็น PII อ่อน ๆ ไม่ควร commit
- เปลี่ยนคนเทสได้โดยไม่แก้โค้ด; Step 0.12 swap เป็น `lookedUpId ?? process.env.LINE_TEST_USER_ID` ได้เนียน
- ค่าที่ใช้ได้ตอนนี้ = userId ของเจ้าของโปรเจกต์ `Ub8affb5140dfd6e5a90b0639c2a2fc2f` (ได้จาก webhook log รอบ 1)

### 3.8 แก้ doc reference ที่พัง

**ทำอะไร:** `docs/CRM/LineOA/lineOA.md` ถูกลบ (แยกเป็น `lineOA 31aug.md` + `lineOA 1sep.md`) แต่คอมเมนต์ในโค้ดยังชี้ path เก่า → อัปเดตให้ชี้ `lineOA 31aug.md` (brief รอบ 1)

**ไฟล์ที่แก้:** `src/features/line/events.ts`, `src/features/line/send.ts`, `src/features/line/log.ts`, `src/features/line/verifySignature.ts`, `src/app/api/line/webhook/route.ts`

**เพราะอะไร:** กันลิงก์ตายในไฟล์ที่กำลังแก้อยู่แล้ว; โค้ดใหม่ทั้งหมดอ้าง `lineOA 1sep.md`

### 3.9 เอกสาร README ของ feature

**ทำอะไร:** เพิ่มหัวข้อ Step 0.11 (scope, ไฟล์, ตัวอย่าง curl), เพิ่ม `LINE_TEST_USER_ID` + 2 ไฟล์ใหม่ในตาราง, อัปเดตตาราง ⚠️ TEMPORARY

**ไฟล์ที่แก้:** `src/features/line/README.md`, `src/features/line/index.ts` (header comment + export)

---

## 4. ตารางไฟล์ทั้งหมด

### สร้างใหม่ (4)

| ไฟล์ | เหตุผลสั้น |
|---|---|
| `src/features/line/buildLeadSummary.ts` | Message Builder + DTO type + zod schema |
| `src/features/line/summaryLabels.ts` | copy ไทย + template §5 (แยกจาก i18n / crmLabels) |
| `src/app/api/line/lead-summary/route.ts` | endpoint เฉพาะสำหรับ build + push |
| `src/components/talk-to-us/leadSummaryPayload.ts` | map wizard state → DTO |

### แก้ไข (11)

| ไฟล์ | แก้อะไร |
|---|---|
| `src/features/line/index.ts` | export ของใหม่ + header comment + fix doc ref |
| `src/features/line/events.ts` | fix doc ref |
| `src/features/line/send.ts` | fix doc ref (คอมเมนต์) |
| `src/features/line/log.ts` | fix doc ref |
| `src/features/line/verifySignature.ts` | fix doc ref |
| `src/app/api/line/webhook/route.ts` | fix doc ref |
| `src/features/line/README.md` | หัวข้อ Step 0.11 + env + files + TEMPORARY |
| `src/components/talk-to-us/config/questions.ts` | DS set → 2 คำถาม |
| `src/components/talk-to-us/config/crmLabels.ts` | ลบ contentManagement/contentTypes/none, เพิ่ม usageType (EN) |
| `messages/th/talk-to-us.json` | DS question i18n |
| `messages/en/talk-to-us.json` | DS question i18n |
| `src/store/talkToUsStore.ts` | `chooseLine()` ยิง endpoint (DS เท่านั้น) |
| `.env` | เพิ่ม `LINE_TEST_USER_ID` (ว่าง) |

> ไม่แตะ: `src/features/crm/*`, `ConfirmationStep.tsx`, `QuestionsStep.tsx`, `leadPayload.ts` (ปรับตาม config เอง)

---

## 5. การตรวจสอบที่ทำแล้ว

| เครื่องมือ | ผล |
|---|---|
| `npx tsc --noEmit` | ✅ ผ่าน (exit 0) |
| `npx eslint` (ไฟล์ที่แตะ) | ✅ ผ่าน — full project เจอ warning เดิมใน `use-cases/UseCasesClient.tsx` ที่ไม่เกี่ยวกัน |
| `npx next build` | ✅ compiled successfully; `/api/line/lead-summary` ขึ้นเป็น `ƒ (Dynamic)` |
| เทียบ output `buildLineLeadSummary()` กับ brief §5 | ✅ ตรงทุกตัวอักษร (ทดสอบด้วย sample `screen_count=21-50`, `usage_type=multi-branch`) |
| push จริงเข้า LINE | ❌ **ยังไม่ได้ทดสอบ** — ต้องตั้ง `LINE_TEST_USER_ID` ก่อน |

### วิธีทดสอบต่อ

```bash
# .env และ Vercel (Production)
LINE_TEST_USER_ID=Ub8affb5140dfd6e5a90b0639c2a2fc2f

pnpm dev
curl -sS localhost:3000/api/line/lead-summary \
  -H 'content-type: application/json' -d '{
    "first_name": "Somchai",
    "interested_solution": "Digital Signage & Media",
    "qualification": { "screen_count": "21-50", "usage_type": "multi-branch" },
    "contact_preference": { "channel": "line" }
  }'
# → { "ok": true, "preview": "สวัสดีครับ คุณ Somchai 👋\n…" } + มือถือ test user เด้ง
```

หรือกรอกฟอร์ม Talk-to-us → Digital Signage → ตอบ 2 คำถาม → กรอกข้อมูลติดต่อ + consent → เลือก "คุยผ่าน LINE"

---

## 6. หัวข้อที่ต้องแก้ในอนาคต

### 6.1 Step 0.12 — Website Lead ↔ LINE Identity Linking (งานถัดไปตาม brief §12)

- เลิก hardcode `LINE_TEST_USER_ID` — ต้องรู้ว่า lead ที่เพิ่งกรอกฟอร์มเป็น LINE user คนไหน
- จุดแก้: `src/app/api/line/lead-summary/route.ts` เปลี่ยน `process.env.LINE_TEST_USER_ID` → userId ที่ resolve ได้ (fallback เป็น env ได้)
- ต้องมีที่เก็บ mapping (Lead ↔ LINE userId) — ตอนนี้ยังไม่มี persistence (Supabase ลงไว้แต่ยังไม่ใช้)
- frontend อาจต้องส่ง join key (เช่น email/mobile) หรือทำ LIFF / account link

### 6.2 Consent gate

- `src/app/api/line/lead-summary/route.ts` มี `// TEMPORARY` — รอบนี้ push ให้ test user ที่ opt-in มาเทสเอง และ wizard บล็อก submit ถ้าไม่ยินยอมอยู่แล้ว
- flow จริง (0.12+) **ต้อง** เช็ก `consent.status === "granted"` ก่อน push หา user จริง → อาจต้องเพิ่ม field `consent` เข้า DTO

### 6.3 โทน / ถ้อยคำข้อความ

- `src/features/line/summaryLabels.ts` — template ตอนนี้ลอกจาก brief §5 เป๊ะ รวมคำลงท้าย "ครับ" (ผู้พูดชาย) และ 👋
- ต้องรีวิวกับ brand voice — พิจารณาถ้อยคำเป็นกลางทางเพศ, อาจเพิ่ม EN variant

### 6.4 หัวข้ออื่นนอกจาก Digital Signage

- ตอนนี้ `chooseLine()` ยิง endpoint เฉพาะ `digital-signage`; หัวข้ออื่นเลือก LINE แล้วไม่มี summary
- ถ้าจะรองรับ ต้องออกแบบ Quick Questions + label map + copy ต่อหัวข้อ

### 6.5 Robustness / production hardening ของ endpoint

- ไม่มี auth / rate-limit / bot protection (เหมือน `/api/crm/lead` ที่มี `// TEMPORARY` เดียวกัน)
- `pushLineMessages` ถูก `await` ใน request — ถ้า latency สำคัญให้ย้ายเป็น queue (`send.ts` มีโน้ตนี้อยู่แล้ว)
- ยังเป็น text message ล้วน — brief §11 บอก Flex/Rich message ไว้ทีหลัง

### 6.6 ความไม่ตรงกันเล็ก ๆ ที่จงใจปล่อยไว้

- **slug**: frontend/DTO ใช้ dash (`21-50`, `multi-branch`) แต่ brief §4 เขียน underscore (`21_50`, `multi_branch`) — ตกลงว่า dash เพื่อให้สอดคล้องทั้ง repo; ถ้าจะ diff payload กับ brief ตรง ๆ ในอนาคตต้องมี adapter
- **ค่า display จอ**: wizard แสดง "1 – 5 จอ" (มีเว้นวรรค), LINE summary แสดง "1–5 จอ" (ไม่มีเว้นวรรค ตาม brief §4) — คนละ map จงใจ
- **`interested_solutions` (array) vs `interested_solution` (string)**: canonical payload เป็น array (decision D-01), DTO ของ LINE เป็น string ตาม brief §6 — builder/DTO ฝั่ง LINE จับเป็น string ตัวเดียว

### 6.7 เอกสาร

- `docs/CRM/LineOA/lineOA.md` ยังค้างสถานะ `D` (deleted, unstaged) ใน git — ต้อง `git add`/commit การ rename เป็น `lineOA 31aug.md` + `lineOA 1sep.md` พร้อมกับงานนี้
- ชื่อไฟล์ brief มีเว้นวรรค (`lineOA 1sep.md`) — อ้างใน code comment ได้แต่ไม่สวย; ถ้าจะ rename เป็น kebab-case ต้องไล่แก้ comment ทั้งหมดอีกรอบ
