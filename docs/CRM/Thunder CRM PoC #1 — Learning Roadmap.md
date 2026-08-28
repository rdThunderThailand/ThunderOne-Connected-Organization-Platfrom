# Thunder CRM PoC #1 — Learning Roadmap (แผนการทำความเข้าใจ)

**Document Status:** Onboarding / Study Guide
**Version:** 0.1
**สำหรับ:** Dev ที่ได้รับมอบหมายงาน PoC #1 (Website → HubSpot) แต่ยังไม่เคยทำ CRM Integration มาก่อน
**อ่านคู่กับ:**
- `Thunder CRM Integration Exploration & Demo Paper.md` (ภาพใหญ่)
- `Thunder CRM PoC #1 — Website → HubSpot.md` (โจทย์งานจริง)

---

## 0. วิธีใช้เอกสารนี้

เอกสารนี้เรียงความรู้เป็น **10 ชั้น (Layer)** จากพื้นฐานสุดไปหางานจริง แต่ละชั้นต่อยอดจากชั้นก่อนหน้า

| กลุ่ม | ชั้น | ใช้ทำอะไร |
|---|---|---|
| พื้นฐานที่ต้องแน่นก่อน | 0–2 | ถ้าข้ามจะงงตลอดทาง |
| หัวใจของงานนี้ | 3–6 | แนวคิดที่เอกสารโจทย์เน้น |
| ทำให้เสร็จและส่งมอบ | 7–9 | Security + การทำ PoC ให้มี evidence |

แต่ละชั้นจบด้วย **"เข้าใจแล้วเมื่อ…"** ไว้เช็คตัวเองก่อนไปชั้นถัดไป

> คำศัพท์เทคนิคคงไว้เป็นภาษาอังกฤษตลอด เพื่อให้ตรงกับเอกสารโจทย์และ documentation ของ HubSpot

---

## Layer 0 — ภาพใหญ่: งานนี้คืออะไร ไม่ใช่อะไร

| ประเด็น | สาระ |
|---|---|
| **ไม่ได้สร้าง CRM** | เราต่อกับ CRM ที่มีอยู่แล้ว (HubSpot) หลักการของโปรเจกต์คือ *"Integrate before we build"* |
| **PoC = Proof of Concept** | เป้าหมายคือพิสูจน์ว่า *ทำได้จริง* ไม่ใช่ของ production — ยอมมี rough edge ได้ แต่ต้องมี evidence |
| **ขอบเขต PoC #1 แคบมาก** | ฟอร์ม *Talk to us / Request Demo* กรอกเสร็จ → ข้อมูลไปโผล่เป็น **Contact** ใน HubSpot แค่นั้น |
| **อะไรที่ทำให้ "ยากกว่าที่คิด"** | ต้องเขียนโค้ดแบบ **ไม่ผูกกับ HubSpot** เพราะรอบถัดไปจะเพิ่ม Zoho โดยห้ามแก้ฟอร์ม |
| **ใครทำ mapping** | Backend เท่านั้น — Frontend ห้ามเรียก HubSpot API ตรง และห้ามรู้จักชื่อ field ของ HubSpot |

**สิ่งที่ PoC #1 รอบแรก _ไม่_ ทำ (อยู่รอบถัดไป):**
Company object + Association, Deal / Pipeline, Owner assignment, LINE OA, Zoho, Reverse Sync (CRM → Thunder), Identity Resolution ข้ามช่องทาง

**เข้าใจแล้วเมื่อ:** อธิบายได้ว่าทำไมเราไม่ให้ React (ฝั่ง browser) ยิง HubSpot API ตรง ๆ
→ คำตอบ: (1) token หลุดให้คนอื่นเห็น = ยิง CRM แทนเราได้ (2) ผูกหน้าเว็บกับ CRM รายเดียว เปลี่ยนทีหลังยาก

---

## Layer 1 — คำศัพท์ CRM (พูดภาษาเดียวกับเอกสาร)

| คำ | ความหมายในบริบทนี้ | ใช้ในรอบนี้ไหม |
|---|---|---|
| **Contact** | คน 1 คน (ชื่อ อีเมล เบอร์ ตำแหน่ง) — หน่วยหลักของ PoC #1 | ✅ |
| **Company** | บริษัท/องค์กร | รอบแรกเก็บแค่เป็น "ข้อความ" ในช่อง company ของ Contact |
| **Deal** | ดีลการขาย 1 รายการ | ❌ รอบถัดไป |
| **Pipeline / Stage** | ขั้นตอนการขาย เช่น New → Contacted → Qualified → Won | ❌ รอบถัดไป |
| **Lead** | ผู้ที่แสดงความสนใจแต่ยังไม่เป็นลูกค้า (ใน HubSpot มักแทนด้วย Contact + lifecycle stage) | บางส่วน |
| **Lead Source** | ลูกค้ามาจากไหน (website / facebook ads / …) | ✅ เก็บเป็น custom property |
| **Owner** | เซลส์ที่รับผิดชอบ contact นั้น | ❌ รอบถัดไป |
| **Lifecycle Stage** | สถานะของ contact ใน funnel (subscriber / lead / MQL / SQL / customer) | อ่านให้เข้าใจ แต่ยังไม่ต้องเซ็ต |
| **Property** | "ช่องข้อมูล" 1 ช่องบน object — มี 2 แบบ | ✅ |
| &nbsp;&nbsp;• default property | มีมาให้แล้ว เช่น `firstname`, `lastname`, `email`, `mobilephone`, `jobtitle`, `company` | ✅ |
| &nbsp;&nbsp;• custom property | เราสร้างเอง เช่น `interested_solution`, `thunder_lead_source` | ✅ |
| **Association** | การ "ผูก" 2 object เข้าด้วยกัน เช่น Contact ↔ Company | ❌ รอบถัดไป |

**เข้าใจแล้วเมื่อ:** ตอบได้ว่าฟอร์มที่กรอก 1 ครั้งในรอบนี้ สร้าง/แก้ไข **อะไรบ้าง**
→ คำตอบ: Contact 1 ราย + เซ็ตค่า property ของมัน จบ (ไม่มี Company object, ไม่มี Deal)

---

## Layer 2 — พื้นฐานเทคนิคที่ต้องมีก่อน

### 2.1 HTTP / REST / JSON

| หัวข้อ | สิ่งที่ต้องรู้ |
|---|---|
| **HTTP method** | `GET` = อ่าน · `POST` = สร้างใหม่ · `PATCH` = แก้บางฟิลด์ · `PUT` = แทนที่ทั้งก้อน |
| **REST API** | ยิง request ไปที่ URL (endpoint) หนึ่ง แนบ body เป็น JSON แล้วได้ response กลับเป็น JSON |
| **Header** | ข้อมูลกำกับ request เช่น `Content-Type: application/json`, `Authorization: Bearer <token>` |
| **Status code** | ดูตารางข้างล่าง |

| Status | แปลว่า | ต้องทำอะไร |
|---|---|---|
| `200 OK` / `201 Created` | สำเร็จ | อ่านผลลัพธ์ |
| `400 Bad Request` | ข้อมูลที่เราส่งผิดรูปแบบ | แก้ payload ฝั่งเรา |
| `401 / 403` | auth ผิด / ไม่มีสิทธิ์ | เช็ค token |
| `404 Not Found` | ไม่เจอ record | id ผิด หรือยังไม่มี |
| **`409 Conflict`** | ชนกับของที่มีอยู่แล้ว (เช่น email ซ้ำ) | **จับ error นี้แล้วเปลี่ยนไป PATCH** |
| `429 Too Many Requests` | ยิงถี่เกิน rate limit | รอแล้วลองใหม่ (backoff) |
| `5xx` | ฝั่ง server เขาพัง | retry ได้ |

### 2.2 Authentication & Secrets

- HubSpot (สำหรับงาน server-to-server แบบนี้) ใช้ **Private App access token**
  แนบมากับ header: `Authorization: Bearer pat-xxxxxxxx`
- token เก็บใน **environment variable** (`.env.local`) — **ห้าม** commit เข้า git, **ห้าม** ส่งไปฝั่ง browser
- เหตุผล: ใครได้ token ไป = ยิง HubSpot ในนามเราได้ทั้งหมด

### 2.3 ฝั่งไหนรันโค้ด

- โค้ดที่คุยกับ HubSpot **ต้องรันบน server** (Next.js route handler หรือ server action)
- Component ฝั่ง client (React ใน browser) มีหน้าที่แค่ **เก็บข้อมูลจากฟอร์ม แล้วส่ง canonical payload มาที่ backend ของเราเอง**

### 2.4 ตัวอย่าง request จริง (ไว้ทำความเข้าใจ ไม่ใช่โค้ดสุดท้าย)

```bash
# สร้าง Contact ใหม่
curl -X POST https://api.hubapi.com/crm/v3/objects/contacts \
  -H "Authorization: Bearer $HUBSPOT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "properties": {
      "firstname": "Somchai",
      "lastname": "Prasert",
      "email": "somchai@abc.com"
    }
  }'
```

Response (สำเร็จ):

```json
{ "id": "123456789", "properties": { "email": "somchai@abc.com", "...": "..." } }
```

**เข้าใจแล้วเมื่อ:** อ่าน curl ข้างบนแล้วบอกได้ว่า — endpoint ไหน, method อะไร, token อยู่ตรงไหน, ผลลัพธ์ที่ต้องเก็บคืออะไร (`id`)

---

## Layer 3 — HubSpot Object & API Model (เฉพาะที่ใช้จริง)

### 3.1 สิ่งที่ต้องจำ

- **Contact เป็นหน่วยหลัก และ unique key คือ `email`** → HubSpot ใช้ email ตัดสินว่า "คนเดิม" หรือ "คนใหม่"
- ทุกค่าข้อมูลของ Contact อยู่ใต้ key `properties`
- **Property internal name ≠ label ที่เห็นใน UI** — โค้ดต้องใช้ internal name (ตัวพิมพ์เล็ก, snake_case) เสมอ

### 3.2 Endpoint ที่จะใช้ในรอบนี้

| งาน | Method + Endpoint |
|---|---|
| สร้าง Contact | `POST /crm/v3/objects/contacts` |
| แก้ไข Contact | `PATCH /crm/v3/objects/contacts/{contactId}` |
| อ่าน Contact | `GET /crm/v3/objects/contacts/{contactId}?properties=firstname,email,...` |
| ค้นหา Contact ด้วย email | `POST /crm/v3/objects/contacts/search` |
| ดูรายชื่อ property ทั้งหมดของ Contact | `GET /crm/v3/properties/contacts` |
| สร้าง custom property | `POST /crm/v3/properties/contacts` |

ตัวอย่าง search ด้วย email:

```json
POST /crm/v3/objects/contacts/search
{
  "filterGroups": [{
    "filters": [{ "propertyName": "email", "operator": "EQ", "value": "somchai@abc.com" }]
  }],
  "properties": ["email", "firstname", "lastname"]
}
```

### 3.3 ข้อจำกัด HubSpot Free Edition ที่กระทบงานนี้ตรง ๆ

| จำกัด | ค่า (โดยประมาณ — ต้องยืนยันใน account จริง) | ผลกับงาน |
|---|---|---|
| **Custom property ต่อ object** | ~**10 ตัว** | mapping ในเอกสารโจทย์มี custom property **13 ตัว → เกิน** ต้องยุบ |
| Contact | ~1,000 ราย | พอสำหรับ PoC |
| Deal pipeline | 1 | รอบถัดไป |
| User | 2 | พอสำหรับ PoC |
| API rate limit (private app) | ~100 request / 10 วินาที | ปกติไม่ชนใน PoC |
| Search API | ~4 request / วินาที + มี indexing lag ~5–10 วินาทีหลัง create | **อย่า create แล้ว search ทันที** ให้ใช้ `id` ที่ได้กลับมาเลย |

**วิธียุบ custom property ให้เหลือ ≤ 10** (ตัวอย่าง):
- รวม consent 4 ช่อง (`status/purpose/source/timestamp`) → `thunder_consent` 1 ช่อง (เก็บเป็น string เช่น `granted;sales_contact;website;2026-08-27T14:20:00+07:00` หรือ JSON)
- รวม acquisition/UTM หลายช่อง → `thunder_acquisition` 1 ช่อง
- Mapper ฝั่ง backend เป็นตัวประกอบ/แตกค่ากลับ ทำให้ canonical model ยังครบเหมือนเดิม

**เข้าใจแล้วเมื่อ:** สมัคร HubSpot Free, สร้าง Private App, แล้วใช้ curl/Postman สร้าง Contact 1 ราย → เปิดเจอใน HubSpot UI ได้ด้วยตัวเอง

---

## Layer 4 — Canonical Model & Mapping (แนวคิดที่เอกสารเน้นที่สุด)

### 4.1 Canonical Payload คืออะไร

- โครงข้อมูลกลาง **ของเราเอง** (ดู §3 ของเอกสาร `PoC #1 — Website → HubSpot`)
- ตั้งชื่อ field แบบเป็นกลาง: `first_name`, `interested_solution`, `acquisition.utm_source`
- **ไม่ใช่** schema ของ HubSpot และห้ามผูกชื่อ field ของ Website กับ CRM รายใดรายหนึ่ง

### 4.2 Mapper คืออะไร

ฟังก์ชันเดียวที่แปลง `canonical → HubSpot API payload`

```
canonical.first_name          → properties.firstname
canonical.email               → properties.email
canonical.position            → properties.jobtitle
canonical.company_name        → properties.company           (text ก่อน)
canonical.interested_solution → properties.interested_solution (custom)
canonical.acquisition.utm_*   → properties.thunder_utm_*       (custom)
canonical.consent.*           → properties.thunder_consent*    (custom)
```

รอบถัดไปจะมี mapper อีกตัว `canonical → Zoho fields` โดย **ฟอร์มและ canonical model ไม่ต้องแก้เลย**

### 4.3 Validation + Normalization (ทำก่อนส่งเข้า CRM เสมอ)

| ข้อมูล | ต้องทำ |
|---|---|
| email | required · ตรวจรูปแบบ · `trim()` + เป็นตัวพิมพ์เล็ก |
| mobile | required · แปลงเป็นรูปแบบ **E.164** (`+66811111111`) |
| first_name / last_name | required · trim |
| consent.status | ต้องเป็นค่าที่กำหนด (`granted` / `denied`) |
| field ที่ไม่ผ่าน | **ตอบ error กลับ frontend — ห้ามยิง HubSpot** |

### 4.4 ภาพรวม flow ของข้อมูล

```
[ฟอร์ม React]
   │  ส่ง canonical payload (JSON) มาที่ backend ของเราเอง
   ▼
[backend: validate + normalize]
   │
   ▼
[HubSpot Mapper]   ← จุดเดียวที่ "รู้จัก" ชื่อ property ของ HubSpot
   │
   ▼
[HubSpot Contact API]  → ได้ hubspot_contact_id กลับมา
```

**เข้าใจแล้วเมื่อ:** เขียน mapping table ของตัวเองได้ + ตอบได้ว่า "ถ้าจะเพิ่ม Zoho ต้องแตะไฟล์ไหนบ้าง"
→ คำตอบ: เพิ่มไฟล์ mapper/connector ใหม่ 1 ไฟล์ + สลับ connector 1 จุด ไม่แตะฟอร์ม ไม่แตะ canonical model

---

## Layer 5 — Identity Resolution & Deduplication (กรอกซ้ำ = คนเดิมไหม)

### 5.1 ปัญหา

คนเดิมกรอกฟอร์มอีกครั้ง → เราต้อง **ไม่สร้าง Contact ซ้ำ**

### 5.2 ลำดับ match key (ในรอบนี้ใช้แค่ email)

1. **Primary:** `email` (normalize แล้ว)
2. Secondary: `mobile` (E.164) — เผื่อ email ไม่มี
3. (อนาคต) Channel identity: `line_user_id`
4. Internal anchor: `thunder_customer_id`

### 5.3 Upsert Pattern ที่ใช้ในงานนี้

```
1. connector.findContact(email)      → search HubSpot ด้วย email
2. ถ้าเจอ   → connector.updateContact(id, props)   (PATCH)
3. ถ้าไม่เจอ → connector.createContact(props)        (POST)
4. เก็บ hubspot_contact_id ที่ได้กลับมา
```

### 5.4 เรื่อง 409 Conflict (นี่คือ TC-02)

- ถ้าเผลอ `POST` ด้วย email ที่มีอยู่แล้ว → HubSpot ตอบ **409** พร้อมข้อความประมาณ `Contact already exists. Existing ID: <id>`
- โค้ดต้อง **จับ 409 → อ่าน id เดิม → เปลี่ยนไป PATCH**
- เอกสารโจทย์สั่งไว้ชัด: **"ห้ามสรุปเองโดยไม่มี evidence"** → ต้องยิงจริง แล้วแนบ request/response ของทั้งเคส 409 และเคส PATCH

### 5.5 External ID Mapping

- `hubspot_contact_id` ที่ได้กลับมา → เก็บผูกกับข้อมูลฝั่งเรา (ไฟล์ / DB ของ PoC)
- เพื่อให้รอบถัดไป (Deal, reverse sync) อ้างอิงกลับได้ และรองรับการเพิ่ม `zoho_contact_id` ในอนาคต

**เข้าใจแล้วเมื่อ:** วาด flowchart ของ Step 2 (Create/Resolve Thunder Customer) + Step 5 (Create or Update Contact) จากเอกสารโจทย์ได้เอง

---

## Layer 6 — Architecture Pattern: Connector Interface

### 6.1 แนวคิด

- ใช้ pattern แบบ **adapter / port**: business logic เรียกผ่าน **interface กลาง** ไม่เรียก SDK ของ HubSpot ตรง ๆ
- เอกสาร §13 ให้ interface ไว้แล้ว:

```
CRMConnector
  authenticate()
  createContact()      ← รอบนี้
  updateContact()      ← รอบนี้
  findContact()        ← รอบนี้
  createCompany() / associateCompany()   ← รอบถัดไป
  createLead() / createDeal() / updateDeal()   ← รอบถัดไป
  assignOwner()        ← รอบถัดไป
  receiveEvent()       ← รอบถัดไป (reverse sync)
  healthCheck()        ← ทำง่าย ทำได้เลย
```

### 6.2 กฎเหล็ก

> **มีโค้ดแค่ไฟล์เดียวที่ "รู้จัก" HubSpot** คือ `HubSpotConnector`
> ส่วนที่เหลือของระบบรู้จักแค่ `CRMConnector` interface

### 6.3 โครงไฟล์ที่แนะนำ

```
src/lib/crm/
  canonical.ts     ← type ของ canonical payload (business data model)
  connector.ts     ← interface CRMConnector
  hubspot.ts       ← class HubSpotConnector implements CRMConnector  (+ mapper อยู่ในนี้หรือแยก mapper.ts)
  index.ts         ← เลือกว่าจะใช้ connector ตัวไหน (รอบนี้ = hubspot)
```

**เข้าใจแล้วเมื่อ:** ตอบได้ว่า "ถ้าเอา HubSpot ออกแล้วใส่ Zoho แทน ต้องแก้กี่ไฟล์"
→ คำตอบที่ถูก: เพิ่ม `zoho.ts` 1 ไฟล์ + เปลี่ยน `index.ts` 1 จุด

---

## Layer 7 — Security & Operational Requirements (เอกสาร §15)

| ต้องมี | รายละเอียด |
|---|---|
| **Environment secret** | HubSpot token อยู่ใน `.env.local` เท่านั้น · ห้าม hard-code · ห้าม commit · ห้ามส่งไป browser |
| **HTTPS** | ทุก request ไป CRM ผ่าน HTTPS (default อยู่แล้ว) |
| **Webhook verification** | (รอบถัดไป) ตรวจ signature ก่อนเชื่อ event ที่ CRM ส่งมา |
| **Error handling** | จับ error ทุกชั้น · ตอบ frontend ด้วย message ที่ปลอดภัย (ไม่หลุด token / stack) |
| **Rate-limit handling** | เจอ `429` → รอแล้ว retry แบบ exponential backoff |
| **Retry strategy** | retry เฉพาะ error ที่ retry ได้ (`429`, `5xx`) · ไม่ retry `400` |
| **Audit log** | บันทึกว่า "ยิงอะไรไป CRM เมื่อไร ผลเป็นอะไร (สำเร็จ/ล้มเหลว, contact id)" — **ไม่ log ค่า PII เต็ม ๆ โดยไม่จำเป็น** |
| **Minimum required data** | ส่งเข้า CRM เฉพาะ field ที่จำเป็นต่อ use case |
| **Consent capture** | เก็บสถานะความยินยอม (`status`, `purpose`, `source`, `timestamp`) และส่งเข้า CRM ด้วย — เกี่ยวกับ PDPA |

**ห้ามเด็ดขาด (จากเอกสาร):** Hard-code API key · Commit secret ลง repo · Expose token ฝั่ง browser · Log personal data โดยไม่จำเป็น

**เข้าใจแล้วเมื่อ:** ชี้จุดใน flow ได้ว่าตรงไหนมี personal data (email / เบอร์ / ชื่อ) ไหลผ่านบ้าง และตรงไหนต้องมี consent

---

## Layer 8 — แมปลงโค้ดจริง (โปรเจกต์นี้: Next.js)

> ⚠️ **สำคัญ:** `AGENTS.md` ระบุว่า Next.js เวอร์ชันในโปรเจกต์นี้มี breaking changes
> **อ่าน `node_modules/next/dist/docs/` (resolve จากตำแหน่งของ AGENTS.md) ก่อนเขียน route handler / server action จริง** — API และ convention อาจต่างจากที่เคยรู้

### 8.1 โครงที่แนะนำ

```
src/features/talk-to-us/TalkToUsClient.tsx   ← ฟอร์ม (client component) — เก็บข้อมูล + POST canonical payload
app/[locale]/talk-to-us/page.tsx              ← server page.tsx (ตาม memory: page.tsx + feature Client)
app/api/talk-to-us/route.ts (หรือ server action)  ← รับ payload, validate, เรียก connector, return result
src/lib/crm/canonical.ts                       ← type CanonicalLeadPayload
src/lib/crm/connector.ts                       ← interface CRMConnector
src/lib/crm/hubspot.ts                         ← HubSpotConnector + mapper
.env.local                                     ← HUBSPOT_PRIVATE_APP_TOKEN=...
```

### 8.2 Flow

```
TalkToUsClient  ──POST canonical JSON──▶  route.ts / action
                                              │  validate + normalize
                                              ▼
                                         getCrmConnector()  (= HubSpotConnector)
                                              │  findContact(email)
                                              │  → updateContact(id, props)  หรือ  createContact(props)
                                              ▼
                                         return { ok: true, hubspot_contact_id }
```

### 8.3 สิ่งที่ frontend รับผิดชอบ / ไม่รับผิดชอบ

| Frontend ทำ | Frontend ไม่ทำ |
|---|---|
| เก็บค่าจากฟอร์ม | เรียก HubSpot API |
| validate เบื้องต้น (UX) | รู้จักชื่อ property ของ HubSpot |
| ส่ง canonical payload | ถือ token |
| แสดงผลสำเร็จ / error | mapping |
| เก็บ UTM จาก URL query แล้วใส่ใน payload | ตัดสิน dedupe |

**เข้าใจแล้วเมื่อ:** ชี้ได้ว่าไฟล์ไหนรับ HTTP request, ไฟล์ไหนคุยกับ HubSpot, token ถูกอ่านจากที่ไหน

---

## Layer 9 — ทำ PoC ให้มี Evidence + ส่งมอบ (เอกสาร §7–9)

### 9.1 Test Cases ที่ต้องรันและเก็บหลักฐาน

| ID | Scenario | เก็บอะไรเป็น evidence |
|---|---|---|
| TC-01 | New Contact (email ใหม่) | request + response + contact id + screenshot ใน HubSpot ว่า field ครบ |
| TC-02 | Same Email (ส่งซ้ำ) | **response จริง** ว่าเป็น create / update / 409 อย่างไร + สิ่งที่โค้ดทำต่อ (PATCH) |
| TC-03 | Custom Fields (interested_solution + UTM + consent) | อ่านค่ากลับจาก HubSpot ได้ครบ |
| TC-04 | Validation (email เสีย / field ขาด) | หลักฐานว่า **ไม่มี** call ออกไป HubSpot |
| TC-05 | Contact ID | หลักฐานว่า backend ได้ id กลับมาและ return/store ได้ |

> TC-02 ย้ำอีกครั้ง: **ห้ามสรุปจากเอกสารหรือจากที่ใครเล่า ต้องยิงจริงแล้วแนบผล**

### 9.2 Deliverables ที่ต้องส่ง (เอกสาร §8)

1. Flow ที่ทำงานได้จริง: Website → Backend → HubSpot Contact
2. Canonical-to-HubSpot mapping table ที่ใช้จริง (รวมการยุบ field ถ้ามี)
3. รายการ HubSpot custom properties ที่สร้าง + internal name + type
4. Evidence ของ TC-01 ถึง TC-05
5. สรุปข้อจำกัด/สิ่งที่เจอจาก HubSpot: duplicate behavior, required fields, property limits (10-cap), error cases

### 9.3 Definition of Done (เอกสาร §9)

- [ ] Submit ฟอร์มแล้ว HubSpot Contact ถูกสร้างหรืออัปเดตได้จริง
- [ ] ข้อมูลหลักไม่สูญหาย: Name / Email / Mobile / Company / Position / Interested Solution / Message / Consent / Source / UTM
- [ ] Website payload ยังเป็น canonical (ไม่ใช้ชื่อ field ของ HubSpot ตรง ๆ)
- [ ] Mapping แยกอยู่ฝั่ง backend
- [ ] เปิด HubSpot แล้วตรวจ Contact จาก PoC ได้

**เข้าใจแล้วเมื่อ:** เปิด HubSpot ให้ Product / Sales ดู Contact ที่มาจากฟอร์มได้ พร้อมอธิบายที่มาของแต่ละ field

---

## ลำดับลงมือจริง (แนะนำทำตามนี้)

| # | ขั้นตอน | ชั้นที่เกี่ยวข้อง |
|---|---|---|
| 1 | สมัคร HubSpot Free · สร้าง **Private App** · เก็บ token ใส่ `.env.local` | 2–3 |
| 2 | ยิง `curl` สร้าง Contact 1 ราย ให้เห็นว่ามันโผล่ใน HubSpot UI | 3 |
| 3 | สร้าง custom property ที่จำเป็น — เจอปัญหา 10-cap → ยุบ field ให้เหลือ ≤ 10 · จด internal name + type | 3–4 |
| 4 | เขียน `canonical.ts` (type) + mapper + validation/normalization | 4 |
| 5 | เขียน `connector.ts` (interface) + `hubspot.ts`: `findContact` → `updateContact` / `createContact` + จับ 409 | 5–6 |
| 6 | อ่าน `node_modules/next/dist/docs/` แล้วต่อ route handler / server action + ฟอร์ม Talk to us | 8 |
| 7 | รัน TC-01–05 เก็บ evidence | 9 |
| 8 | เขียน mapping table จริง + รายการ custom property + สรุปข้อจำกัด | 9 |

---

## สิ่งที่ยัง "ไม่ต้อง" เข้าใจ/ทำ ตอนนี้ (กันหลงทาง)

- Zoho CRM (รอบถัดไป — และ Free edition ตัด custom field / webhook ออก ใช้พิสูจน์ไม่ได้ ต้องขอ trial อื่น)
- LINE OA / LINE Login / LINE MyCustomer (PoC #2, #5)
- **MyCustomer ≠ Messaging API** — จำไว้เฉย ๆ ว่าเป็นคนละระบบ ยังไม่ต้องลงลึก
- Deal / Pipeline / Lifecycle stage (PoC #3)
- Company object + Association (scope ถัดไปของ PoC #1)
- Owner assignment
- Reverse Sync: CRM → Webhook → Thunder (PoC #4)
- Identity Resolution ข้ามช่องทาง (Website + LINE + CRM = คนเดียวกันไหม)
- Evaluation Matrix / การให้คะแนน CRM

---

## Glossary สรุปเร็ว

| คำ | หนึ่งบรรทัด |
|---|---|
| **PoC** | Proof of Concept — พิสูจน์ว่าทำได้ ไม่ใช่ของ production |
| **Canonical payload / model** | โครงข้อมูลกลางของเราเอง ไม่ผูกกับ CRM รายใด |
| **Mapper** | ฟังก์ชันแปลง canonical → field ของ CRM หนึ่งราย |
| **Connector** | โมดูลที่ห่อ API ของ CRM หนึ่งราย ให้ตรงกับ interface กลาง (`CRMConnector`) |
| **Property** | ช่องข้อมูลบน object ใน HubSpot (default / custom) |
| **Internal name** | ชื่อ property ที่โค้ดใช้ (ต่างจาก label ใน UI) |
| **Upsert** | "update ถ้ามี, insert ถ้าไม่มี" |
| **Dedupe / Deduplication** | กันไม่ให้เกิด record ซ้ำของคนเดียวกัน |
| **409 Conflict** | HTTP error ที่ HubSpot ตอบเมื่อ email ซ้ำ |
| **E.164** | รูปแบบเบอร์โทรมาตรฐานสากล เช่น `+66811111111` |
| **PII** | Personally Identifiable Information — ข้อมูลระบุตัวบุคคล (email, เบอร์, ชื่อ) |
| **Consent capture** | การเก็บหลักฐานความยินยอมให้ติดต่อ (PDPA) |
| **UTM** | พารามิเตอร์ใน URL ที่บอกที่มาของ traffic (`utm_source`, `utm_medium`, `utm_campaign`) |
| **Private App token** | วิธี authenticate กับ HubSpot API แบบ server-to-server |
| **Rate limit** | เพดานจำนวน request ต่อช่วงเวลา |
| **Backoff** | กลยุทธ์รอ (เพิ่มเวลาขึ้นเรื่อย ๆ) ก่อน retry |

---

## แหล่งอ้างอิงข้อเท็จจริง (ค่า limit / behavior อาจเปลี่ยน — ยืนยันใน account จริงเสมอ)

- HubSpot API usage guidelines & limits — https://developers.hubspot.com/docs/developer-tooling/platform/usage-guidelines
- HubSpot Free plan limits — https://www.usecarly.com/blog/hubspot-free-plan-limits/
- HubSpot Community: 409 Conflict when creating/updating contacts — https://community.hubspot.com/t5/APIs-Integrations/409-Conflict-problem-when-creating-updating-contacts/m-p/760250
- Zoho CRM API limits (official) — https://www.zoho.com/crm/developer/docs/api/v8/api-limits.html
- LINE Messaging API overview (official) — https://developers.line.biz/en/docs/messaging-api/overview/
- MyCustomer | CRM (LINE for Business) — https://lineforbusiness.com/th/service/mycustomer
