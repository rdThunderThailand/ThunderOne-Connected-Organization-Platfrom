# Thunder CRM PoC #1 — Design Decisions (เรื่องที่ต้องตัดสินใจ)

**Document Status:** Decision Register / Open Questions
**Version:** 0.1
**ขอบเขต:** เฉพาะ PoC #1 รอบแรก (Website *Talk to us* → HubSpot Contact)
**อ่านคู่กับ:**
- `Thunder CRM PoC #1 — Website → HubSpot.md` (โจทย์งาน)
- `Thunder CRM PoC #1 — Learning Roadmap.md` (พื้นฐาน)

---

## วิธีใช้เอกสารนี้

รวม "จุดที่ต้องตัดสินใจ" ก่อน/ระหว่างทำ PoC #1 แต่ละรายการมี: บริบท → ตัวเลือก → คำแนะนำ → ผลกระทบ

**สถานะ:**
- 🔴 **Open** — ยังไม่ตัดสิน ต้องคุย
- 🟡 **Recommended** — มีข้อเสนอแล้ว รอยืนยัน
- 🟢 **Decided** — ตัดสินแล้ว (ระบุว่าใคร/เอกสารไหน)

**ใครตัดสิน:**
- **Dev** — ตัดสินเองได้ (เชิงเทคนิคล้วน)
- **Dev + Product** — กระทบข้อมูลที่ Sales/Product เห็นหรือใช้งาน
- **Product/Sales** — เชิงธุรกิจ

---

## สรุปรายการ

| ID | หัวข้อ | สถานะ | ใครตัดสิน | บล็อก PoC #1 ไหม |
|---|---|---|---|---|
| D-01 | ลูกค้าสนใจหลาย product / ยิงซ้ำหลายรอบ — เก็บอย่างไร | 🟡 | Dev + Product | ใช่ |
| D-02 | HubSpot Free จำกัด custom property ~10 ตัว | 🟡 | Dev + Product | ใช่ |
| D-03 | Upsert strategy (find-then-write vs catch-409 vs batch) | 🟡 | Dev | ใช่ |
| D-04 | First-touch vs last-touch attribution เมื่อยิงซ้ำ | 🟡 | Dev + Product | ไม่ (แต่ควรตัดสิน) |
| D-05 | รูปแบบการเก็บ Consent (4 ช่อง vs รวม) | 🟡 | Dev + Product | ใช่ (ผูกกับ D-02) |
| D-06 | `interested_solution` เป็น dropdown ค่าคงที่ หรือ free text | 🟡 | Dev + Product | ใช่ |
| D-07 | เก็บ `hubspot_contact_id` ไว้ที่ไหนใน PoC | 🟡 | Dev | ไม่ |
| D-08 | HubSpot auth method | 🟢 | Dev | — |
| D-09 | Company: text property ตอนนี้ vs Company object | 🟢 | spec | — |
| D-10 | รูปแบบ timestamp ของ consent | 🟡 | Dev | ใช่ |
| D-11 | Validation: field ไหน required | 🟡 | Dev + Product | ใช่ |
| D-12 | Retry / rate-limit policy | 🟡 | Dev | ไม่ |
| D-13 | Zoho Free edition ใช้พิสูจน์ไม่ได้ (heads-up รอบถัดไป) | 🔴 | Dev + Product | ไม่ |
| D-14 | UTM capture ฝั่ง frontend | 🟡 | Dev | ไม่ |

---

## D-01 — ลูกค้าสนใจมากกว่า 1 product / คนเดิมยิง request หลายรอบ

**สถานะ:** 🟡 Recommended — **Dev + Product**

### บริบท
หน้า *Talk to us* มี 4 product. เกิดได้ 2 กรณี:
- **A. กรอกครั้งเดียว เลือกหลาย product** — canonical ปัจจุบัน (`interested_solution` เป็น string เดียว) เก็บได้แค่ 1
- **B. คนเดิมกรอกหลายรอบ คนละ product** — HubSpot dedupe ด้วย `email` → Contact เดียว, `PATCH` จะ **เขียนทับ** ค่าเดิม → product ที่สนใจอันแรกหายจากค่าปัจจุบัน (ยังเห็นใน property history แต่ query/segment ไม่ได้)

> **ไม่เป็นปัญหาเรื่อง duplicate Contact** — HubSpot ไม่สร้าง Contact ซ้ำอยู่แล้ว
> **เป็น design decision** — ถ้าไม่ทำอะไร ข้อมูล product/ข้อความรอบก่อนจะเงียบ ๆ หายไป

### ตัวเลือก
| # | วิธี | ข้อดี | ข้อเสีย |
|---|---|---|---|
| 1 | single-value, last-write-wins (ไม่ทำอะไร) | ง่ายสุด | product แรก + ข้อความแรกหายจากค่าปัจจุบัน |
| 2 | **multi-value property + merge** | เห็นทุก product บน Contact เดียว, segment ได้ | backend ต้อง read-modify-write เอง (HubSpot API ไม่ append ให้ ต้องส่งค่าเต็ม คั่นด้วย `;`) |
| 3 | append ข้อความลง text log (`thunder_interest_log`) | เก็บข้อความ + เวลาแต่ละครั้งครบ | filter/report ไม่ได้ |
| 4 | สร้าง Note ต่อ 1 submission (Engagements API) | history ครบ ไม่ยุ่ง property | งานเพิ่ม |
| 5 | แต่ละ product interest = 1 Deal | ถูกต้องตามหลัก CRM ที่สุด | **Deal อยู่ scope รอบถัดไป** |

### คำแนะนำ (PoC #1 รอบแรก)
- ใช้ **ข้อ 2 + ข้อ 3**
- แก้ canonical: `interested_solution: string` → **`interested_solutions: string[]`**
  ```json
  "interested_solutions": ["ThunderOne", "Thunder Digital Presence"]
  ```
- HubSpot property `interested_solution` type = **multiple checkboxes** (enumeration), ค่าเก็บเป็น `ThunderOne;Thunder Digital Presence`
- Backend merge logic:
  ```
  findContact(email)
    เจอ    → อ่าน interested_solution เดิม → union กับค่าใหม่ → dedupe → PATCH ค่าเต็ม
    ไม่เจอ → POST ค่าใหม่
  ```
- ข้อความแต่ละครั้ง (`inquiry_message` ก็โดนทับเหมือนกัน) → append ลง `thunder_interest_log` เช่น `[2026-08-28] ThunderOne: อยากได้ demo`
- Target design ระยะยาว: 1 product interest = 1 Deal (บันทึกไว้เฉย ๆ ทำรอบถัดไป)

### ผลกระทบ
- Canonical model, HubSpot mapper, จำนวน custom property (+1 `thunder_interest_log`)
- เพิ่ม test case **TC-02b**: email เดิม + product ที่ 2 → Contact เดิมมี product ครบทั้ง 2, ข้อความไม่หาย

---

## D-02 — HubSpot Free จำกัด custom property ~10 ตัว/object

**สถานะ:** 🟡 Recommended — **Dev + Product**

### บริบท
Mapping ในเอกสารโจทย์มี custom property **13 ตัว** (`interested_solution`, `inquiry_message`*, `thunder_consent_status/purpose/source/timestamp`, `thunder_lead_source`, `thunder_medium`, `thunder_campaign`, `thunder_utm_source/medium/campaign`, `thunder_landing_page`) + D-01 เพิ่ม `thunder_interest_log` → **เกินโควตา Free**
(*`inquiry_message` อาจใช้ default property หรือ note ได้ ต้องเช็ค)

### ตัวเลือก
| # | วิธี | ข้อดี | ข้อเสีย |
|---|---|---|---|
| 1 | ยุบหลาย field เป็น field รวม | อยู่ใน Free ได้ | query แยกราย field ใน HubSpot ไม่ได้ (ต้องแตกที่ backend) |
| 2 | Upgrade HubSpot Starter | mapping 1:1 ตรงเอกสาร | มีค่าใช้จ่าย ผิดเจตนา "ทดลองด้วย Free" |
| 3 | ลดขอบเขต field ที่เก็บ | ง่าย | ข้อมูลบางอย่างไม่เข้า CRM |

### คำแนะนำ
ข้อ 1 — ยุบให้เหลือ ≤ 10:
- `thunder_consent` (รวม status/purpose/source/timestamp) — ดู D-05
- `thunder_acquisition` (รวม source/medium/campaign) หรือ `thunder_utm` (รวม utm_source/medium/campaign)
- เหลือประมาณ: `interested_solution`, `inquiry_message`, `thunder_interest_log`, `thunder_consent`, `thunder_lead_source`, `thunder_acquisition`, `thunder_utm`, `thunder_landing_page` ≈ 8
- Mapper ฝั่ง backend เป็นตัวประกอบตอนเขียน / แตกตอนอ่าน → canonical model ยังครบเท่าเดิม

### ผลกระทบ
Mapping table, mapper (serialize/deserialize), deliverable §8 (รายการ custom property จริง)

---

## D-03 — Upsert strategy

**สถานะ:** 🟡 Recommended — **Dev**

### ตัวเลือก
| # | วิธี | หมายเหตุ |
|---|---|---|
| a | `POST /contacts/search` (filter email EQ) → เจอ `PATCH` / ไม่เจอ `POST` | ชัด ควบคุมง่าย · ระวัง Search API indexing lag ~5–10s หลัง create |
| b | `POST /contacts` เลย → ถ้า `409` อ่าน existing id → `PATCH` | ประหยัด 1 call ตอนสร้างใหม่ · ต้อง parse ข้อความ error |
| c | `POST /contacts/batch/upsert` ตั้ง `idProperty: "email"` | 1 call จบ · **แต่** ถ้ามี conflict คืน `409` ทั้ง batch ขณะที่ non-conflict ถูกสร้างไปแล้ว → ยุ่งใน PoC |

### คำแนะนำ
ใช้ **a** เป็นหลัก (อ่านง่าย เขียน evidence ง่าย) หรือ **b** ก็ได้ · **เลี่ยง c** ใน PoC · ไม่ create แล้ว search ทันทีใน 
flow เดียว (ใช้ `id` ที่ได้กลับมาเลย)

### ผลกระทบ
`HubSpotConnector.findContact / createContact / updateContact` · evidence TC-01, TC-02

---

## D-04 — First-touch vs last-touch attribution (เมื่อยิงซ้ำ)

**สถานะ:** 🟡 Recommended — **Dev + Product**

### บริบท
คนเดิมยิงรอบ 2 อาจมาจาก UTM/campaign คนละตัว → ถ้า `PATCH` ทับ `thunder_lead_source` / `thunder_utm_*` จะเสีย first-touch attribution

### ตัวเลือก
| # | วิธี | ผล |
|---|---|---|
| 1 | ทับทุกครั้ง (last-touch) | เห็นแหล่งล่าสุด เสีย first-touch |
| 2 | ไม่เขียนทับถ้ามีค่าแล้ว (first-touch) | เก็บแหล่งแรก เสีย last-touch |
| 3 | เก็บทั้งคู่ (`thunder_first_*` + `thunder_last_*`) | ครบ แต่เปลือง property (ชน D-02) |

### คำแนะนำ
PoC = **ข้อ 2** (keep first-touch: mapper เขียน field กลุ่ม acquisition เฉพาะตอน create หรือตอนค่าเดิมว่าง) · จดเป็น known limitation ว่า last-touch ไม่ถูกเก็บ

---

## D-05 — รูปแบบการเก็บ Consent

**สถานะ:** 🟡 Recommended — **Dev + Product** (ผูกกับ D-02)

### ตัวเลือก
| # | วิธี | ข้อดี | ข้อเสีย |
|---|---|---|---|
| 1 | 4 custom properties แยก | query/segment ตาม consent ได้ตรง | กิน 4 slot (ชน D-02) |
| 2 | รวมเป็น 1 string `granted;sales_contact;website;2026-08-27T14:20:00+07:00` | ประหยัด slot | ต้อง parse, segment ยาก |
| 3 | รวมเป็น 1 JSON string | ยืดหยุ่น | อ่านใน HubSpot UI ไม่สวย |

### คำแนะนำ
ถ้าติด 10-cap (D-02) → **ข้อ 2** ชื่อ `thunder_consent` · ถ้ามี slot เหลือหลังยุบ field อื่นแล้ว → เก็บ `thunder_consent_status` แยกไว้ 1 ตัว (ตัวที่ต้องใช้ filter บ่อยสุด) ที่เหลือรวม

### หมายเหตุ PDPA
ต้องเก็บให้พิสูจน์ย้อนได้ว่า *ใคร ยินยอมเรื่องอะไร เมื่อไร จากช่องทางไหน* — ไม่ว่าจะเก็บรูปแบบไหนก็ต้องมีครบ 4 ข้อมูลนี้

---

## D-06 — `interested_solution`: dropdown ค่าคงที่ หรือ free text

**สถานะ:** 🟡 Recommended — **Dev + Product**

### ตัวเลือก
| # | วิธี | ข้อดี | ข้อเสีย |
|---|---|---|---|
| 1 | enumeration (multiple checkboxes) ด้วยรายชื่อ 4 product ตรงกับฟอร์ม | segment ได้, กัน typo, กราฟใน HubSpot ใช้ได้ | ถ้าเพิ่ม product ต้องเพิ่ม option ทั้งในฟอร์มและ property |
| 2 | free text | ยืดหยุ่น | ค่าเพี้ยน ("ThunderOne" vs "Thunder One"), segment ยาก |

### คำแนะนำ
**ข้อ 1** — กำหนด internal value ให้คงที่ (เช่น `thunderone`, `digital_presence`, `thunder_care`, `xxx`) และให้ frontend ส่ง value เดียวกันนี้ · เก็บ list ค่าไว้ที่เดียว (shared constant) ให้ฟอร์มกับ mapper อ้างอิงร่วมกัน

---

## D-07 — เก็บ `hubspot_contact_id` ไว้ที่ไหนใน PoC

**สถานะ:** 🟡 Recommended — **Dev**

### ตัวเลือก
| # | วิธี | เหมาะกับ |
|---|---|---|
| 1 | ไม่เก็บ — query ด้วย email ทุกครั้ง | PoC #1 ล้วน ๆ |
| 2 | ไฟล์ JSON/CSV ในโปรเจกต์ (`.data/` gitignored) | อยากมี mapping ให้ดู |
| 3 | SQLite / DB | เตรียมไปรอบถัดไป (reverse sync ต้องมี mapping store) |

### คำแนะนำ
PoC #1 = **ข้อ 1 หรือ 2** (ง่าย) · แต่ในรายงานให้ระบุว่า **รอบ reverse sync (PoC #4) ต้องมี persistent mapping store** ระหว่าง `thunder_customer_id` ↔ external ids

---

## D-08 — HubSpot auth method

**สถานะ:** 🟢 Decided (Learning Roadmap Layer 2/3) — **Dev**

- ใช้ **Private App access token** (server-to-server) เก็บใน env
- OAuth public app จำเป็นเฉพาะตอนทำ webhook subscription / ขึ้น marketplace → เลื่อนไป PoC #4

---

## D-09 — Company: text property ตอนนี้ vs Company object

**สถานะ:** 🟢 Decided (เอกสารโจทย์ §1, §6) — **spec**

- รอบแรก: `company_name` → HubSpot Contact property `company` (text)
- Company object + Association = scope รอบถัดไปของ PoC #1
- แค่ต้อง implement ให้เพิ่ม association ทีหลังได้โดยไม่รื้อ (mapper แยกส่วน)

---

## D-10 — รูปแบบ timestamp ของ consent

**สถานะ:** 🟡 Recommended — **Dev**

### บริบท
`consent.timestamp` ในตัวอย่างเป็น ISO8601 มี timezone (`2026-08-27T14:20:00+07:00`). HubSpot property แต่ละ type รับไม่เหมือนกัน

### ตัวเลือก
| # | HubSpot property type | รับค่ารูปแบบ |
|---|---|---|
| 1 | `datetime` | epoch milliseconds (UTC) หรือ ISO8601 ที่เป็น **UTC midnight/มี Z** — ต้องทดสอบ |
| 2 | `string` (single-line text) | เก็บ ISO8601 ตรง ๆ ได้เลย รวม timezone |

### คำแนะนำ
PoC = **ข้อ 2** (string) เก็บ ISO8601 เดิมทั้งก้อน — ง่าย ไม่เพี้ยน timezone · ถ้าต้องการ filter ตามวันที่ค่อยเปลี่ยนเป็น `datetime` แล้ว normalize เป็น UTC epoch ใน mapper · **ต้องทดสอบและบันทึกพฤติกรรมจริง** (เป็นส่วนหนึ่งของ TC-03)

---

## D-11 — Validation: field ไหน required

**สถานะ:** 🟡 Recommended — **Dev + Product**

### ตัวเลือก
| # | ชุด required | หมายเหตุ |
|---|---|---|
| 1 | `email` อย่างเดียว | ยืดหยุ่นสุด, lead คุณภาพต่ำ |
| 2 | `first_name`, `email`, `consent.status` | ขั้นต่ำที่ใช้งานได้ |
| 3 | + `mobile` | `mobile` เป็น secondary match key (D กรณี email ใหม่แต่เบอร์เดิม) |
| 4 | + `company_name`, `interested_solutions` | เข้ม เหมาะ B2B |

### คำแนะนำ
เริ่มที่ **ข้อ 3** (`first_name`, `last_name`, `email`, `mobile`, `consent.status`, `interested_solutions` อย่างน้อย 1) · ให้ Product ยืนยัน field ที่บังคับบนฟอร์มจริง · Backend ต้อง reject ก่อนเรียก HubSpot (TC-04)

### Normalization ที่ต้องทำเสมอ
`email` → trim + lowercase · `mobile` → E.164 (`+66…`) · ตัด whitespace หัวท้ายทุก field

---

## D-12 — Retry / rate-limit policy

**สถานะ:** 🟡 Recommended — **Dev**

### คำแนะนำ
- retry เฉพาะ `429` และ `5xx` · **ไม่ retry** `4xx` อื่น (`400/401/403/409` แก้ที่ logic)
- exponential backoff: 3 ครั้ง, หน่วง ~1s / 2s / 4s (เคารพ header `Retry-After` ถ้ามี)
- ทุกครั้งที่ retry / fail → เขียน audit log (ไม่ log ค่า PII เต็ม)
- PoC ไม่ต้องมี queue/worker — retry แบบ inline พอ

---

## D-13 — Zoho Free edition ใช้พิสูจน์ PoC ไม่ได้ (heads-up รอบถัดไป)

**สถานะ:** 🔴 Open — **Dev + Product** · **ไม่บล็อก PoC #1**

### บริบท
Zoho CRM **Free edition** ตัด custom fields, custom modules, **webhook**, workflow automation ออก → พิสูจน์ mapping (custom field) และ reverse event (webhook) ไม่ได้

### ตัวเลือก
| # | วิธี |
|---|---|
| 1 | Zoho **Developer Edition** (ฟรีสำหรับ dev/test) |
| 2 | Zoho **Professional/Enterprise trial** (จำกัดวัน) |
| 3 | เลื่อน Zoho ออก ไปโฟกัส HubSpot ให้ครบก่อน |

### คำแนะนำ
ตอนเริ่มรอบ Zoho ให้ขอ **Developer Edition** ก่อน · จดไว้ในรายงานว่า "Free edition ตามเอกสารใช้ทำ PoC นี้ไม่ได้จริง"

---

## D-14 — UTM capture ฝั่ง frontend

**สถานะ:** 🟡 Recommended — **Dev**

### ตัวเลือก
| # | วิธี | ผล |
|---|---|---|
| 1 | อ่าน `utm_*` จาก URL query ตอน submit | ง่าย · พลาดถ้า user เปลี่ยนหน้า/รีเฟรชจน query หาย |
| 2 | เก็บ `utm_*` + `landing_page` ตอน **first landing** ลง cookie/localStorage แล้วแนบตอน submit | attribution แม่นกว่า · โค้ดเพิ่มเล็กน้อย |

### คำแนะนำ
PoC = **ข้อ 1** พอ · ถ้าทีมอยากได้ attribution แม่น (สอดคล้อง D-04 first-touch) ใช้ **ข้อ 2** — เก็บครั้งแรกที่เข้าเว็บ ไม่เขียนทับถ้ามีอยู่แล้ว

---

## ต้องเคาะก่อนเริ่มเขียนโค้ด (blocking)

1. **D-01** — โครง `interested_solutions` เป็น array + merge strategy
2. **D-02 / D-05** — รายการ custom property สุดท้าย (หลังยุบให้ ≤ 10)
3. **D-06** — internal value ของ 4 product (ต้องตรงกันระหว่างฟอร์ม + property)
4. **D-11** — required fields บนฟอร์มจริง

ที่เหลือ (D-03, D-04, D-07, D-10, D-12, D-14) Dev ตัดสินระหว่างทำได้ แล้วบันทึกผลจริงลงรายงาน
