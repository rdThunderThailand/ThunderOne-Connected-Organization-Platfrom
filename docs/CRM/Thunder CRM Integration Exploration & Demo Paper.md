# Thunder CRM Integration Exploration & Demo Paper

**Document Status:** Exploration / Proof of Concept
**Version:** 0.1
**Product Context:** Thunder Digital Presence / ThunderOne

---

## 1. Purpose

เอกสารฉบับนี้กำหนดกรอบสำหรับทีม Product และ Development ในการศึกษา ทดลอง และสร้าง Demo การเชื่อมต่อระหว่าง Digital Customer Touchpoints ของ Thunder กับระบบ CRM ภายนอก

เป้าหมายของงานนี้ **ไม่ใช่การพัฒนา CRM ใหม่**

แต่เพื่อพิสูจน์ว่า Thunder สามารถสร้าง Digital Customer Journey ที่เชื่อม

**Website + LINE OA + Customer Data + CRM**

ให้ทำงานร่วมกันได้จริง และสามารถนำไปใช้เป็น Capability มาตรฐานสำหรับ Thunder Digital Presence และ ThunderOne ในอนาคต

---

## 2. Business Scenario

ใช้ **ThunderOne** เป็น Demo Organization แรก

สมมติ Customer Journey:

**Visitor**

เข้าชม ThunderOne Website
↓
สนใจผลิตภัณฑ์
↓
กด **Talk to us / Request Demo**
↓
กรอกข้อมูล

- Name
- Company
- Position
- Mobile
- Email
- Interested Solution
- Message

↓
ระบบรับข้อมูล
↓
ส่งข้อมูลเข้าสู่ CRM
↓
สร้าง Lead / Contact
↓
กำหนด Owner
↓
Sales ติดต่อกลับ
↓
Meeting
↓
Proposal
↓
Deal
↓
Customer

เป้าหมายคือให้ทีมสามารถ Demonstrate Journey นี้แบบ End-to-End ได้จริง

---

## 3. CRM Candidates

PoC รอบแรกให้ทดลองอย่างน้อย 3 แนวทาง

### Candidate A — HubSpot CRM

ใช้ Free Edition สำหรับการทดลอง หาก feature และข้อกำหนดปัจจุบันรองรับ

ทดสอบ:
- Contact
- Company
- Deal
- Owner
- Lead Source
- Custom Properties
- API
- Webhook
- Authentication
- Duplicate Handling
- Update / Upsert

### Candidate B — Zoho CRM

ใช้ Free Edition สำหรับการทดลอง หาก feature และ API quota ปัจจุบันรองรับ

ทดสอบ:
- Lead
- Contact
- Account
- Deal
- Owner
- Lead Source
- Custom Fields
- API
- Webhook
- Authentication
- Duplicate Handling
- Update / Upsert

### Candidate C — LINE Customer System

ศึกษาและทดลอง

**LINE Official Account + MyCustomer | CRM**

เพื่อประเมินความเหมาะสมสำหรับ B2C / Membership / Loyalty Use Case

ทดสอบ:
- Customer Profile
- LINE Identity
- Member
- Tag / Segment
- Point
- Tier
- Reward
- Consent
- Data Export
- API / Integration Availability
- Messaging API Relationship

**หมายเหตุสำคัญ**

ทีมต้องแยกให้ชัดระหว่าง

**LINE Messaging API**

กับ

**MyCustomer | CRM API / Integration Capability**

ห้าม assume ว่าข้อมูลทุกอย่างใน MyCustomer สามารถเข้าถึงผ่าน Messaging API ได้

---

## 4. Out of Scope

PoC นี้ยังไม่ต้องพัฒนา

- Thunder CRM
- Full Sales Automation
- Marketing Automation Platform
- Customer Data Platform
- Loyalty Platform
- Advanced AI Lead Scoring
- Full Customer 360
- ERP Integration
- Production-grade Multi-tenant Connector Platform

เป้าหมายคือ พิสูจน์ Integration Pattern ก่อน

---

## 5. Proposed Architecture

```
                         CUSTOMER
                            |
            ┌───────────────┼───────────────┐
            |               |               |
        WEBSITE          LINE OA          SOCIAL
            |               |               |
            └───────────────┼───────────────┘
                            |
                            ▼
                  LEAD / CUSTOMER CAPTURE
                            |
                            ▼
                    ┌──────────────────┐
                    │  THUNDER CONNECT │
                    └──────────────────┘
                            |
            ┌───────────────┼───────────────┐
            |               |               |
        Identity         Consent          Source
            |               |               |
            └───────────────┼───────────────┘
                            |
                            ▼
                  CUSTOMER DATA MODEL
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
        HUBSPOT           ZOHO            LINE
          CRM              CRM       CUSTOMER SYSTEM
            |               |               |
            └───────────────┼───────────────┘
                            |
                            ▼
                       THUNDERONE
                    (Future Capability)
```

**Thunder Connect** ใน PoC เป็นเพียง Logical Component

ยังไม่ถือว่าเป็น Product หรือ Platform Module ที่ได้รับการอนุมัติ

---

## 6. Thunder Customer Data Model — Draft

ทีมต้องสร้าง Canonical Data Model กลางก่อนเขียน Connector

### Identity
- thunder_customer_id
- first_name
- last_name
- email
- mobile
- line_user_id

### Organization
- company_name
- company_domain
- position
- organization_type

### Acquisition
- source
- medium
- campaign
- utm_source
- utm_medium
- utm_campaign
- landing_page
- first_touch_at

### Interest
- interested_product
- interested_solution
- inquiry_message

### Business
- lead_status
- lead_owner
- opportunity_status
- estimated_value
- next_action

### Consent
- consent_status
- consent_purpose
- consent_source
- consent_timestamp

### External Identity

รองรับการ Mapping เช่น

- hubspot_contact_id
- zoho_lead_id
- zoho_contact_id
- line_user_id

ห้ามออกแบบ Data Model โดยยึด Schema ของ CRM รายใดรายหนึ่งเป็น Master

---

## 7. Identity Resolution

PoC ต้องตอบคำถามนี้ให้ได้:

> Website Visitor, LINE User และ CRM Contact เป็นบุคคลเดียวกันหรือไม่?

**Minimum Identity Strategy:**

- **Primary:** Email
- **Secondary:** Mobile Number
- **Channel Identity:** LINE User ID
- **Internal Identity:** Thunder Customer ID

ตัวอย่าง:

```
Thunder Customer #T100023

├── Email: somchai@abc.com
├── Mobile: 08x-xxx-xxxx
├── LINE: Uxxxxxxxx
├── HubSpot: 182736
└── Zoho: 58492
```

ต้องทดสอบกรณี:
- Email เดิมกรอก Form ซ้ำ
- Mobile เดิมแต่ Email ใหม่
- LINE User มีอยู่แต่ยังไม่มี Email
- CRM มี Contact อยู่ก่อนแล้ว
- Duplicate Contact
- CRM record ถูกแก้ไขภายหลัง

---

## 8. PoC #1 — Website → CRM

สร้าง Demo Landing Page:

**Request ThunderOne Demo**

Fields:
- Name
- Company
- Position
- Mobile
- Email
- Interested Solution
- Message
- Consent

เมื่อ Submit:

- **Step 1** — Validate Input
- **Step 2** — Create / Resolve Thunder Customer
- **Step 3** — Capture Source + UTM
- **Step 4** — Send to CRM
- **Step 5** — Create or Update Contact / Lead
- **Step 6** — Associate Company หากรองรับ
- **Step 7** — Create Lead / Deal ตาม Test Scenario
- **Step 8** — Return Successful Submission

---

## 9. PoC #2 — LINE OA → Customer Identity

สร้าง LINE OA Test Account

ทดสอบ Journey:

Customer → Add Friend → Welcome Message → เลือก **สนใจ ThunderOne** → เปิด Landing Page / Form → Submit → Associate LINE Identity → CRM

เป้าหมายคือพิสูจน์ว่า

**LINE User + Website Lead + CRM Contact**

สามารถถูกเชื่อมให้เป็น Customer Identity เดียวกันได้หรือไม่ และต้องใช้ mechanism ใด

---

## 10. PoC #3 — Lead Lifecycle

สร้าง Demo Lead:

**Somchai — ABC Company**

แล้ว Demonstrate:

New → Contacted → Qualified → Meeting → Proposal → Won

ทีมต้องตรวจสอบว่าแต่ละ CRM จัดเก็บ Lifecycle อย่างไร และ Thunder Model ควร Map อย่างไร

---

## 11. PoC #4 — CRM → Thunder

หลังจาก Website → CRM สำเร็จ ให้ทดลอง Reverse Flow

ตัวอย่าง:

Sales เปลี่ยน Deal **Proposal → Won**

CRM → Webhook / Event / Polling → Thunder Connect → Update Customer State

เป้าหมายไม่ใช่สร้าง Production Sync Engine แต่เพื่อพิสูจน์ว่า **Two-way Integration** เป็นไปได้

---

## 12. PoC #5 — LINE MyCustomer

สร้าง B2C Scenario แยกจาก ThunderOne

ตัวอย่าง Demo Business:

**Thunder Café — Demo**

Customer → Add LINE → Register Member → Customer Profile → Earn Point → Member Tier → Segment → Reward → Targeted Communication

ทีมต้องตอบให้ได้ว่า:
1. ข้อมูลอะไรอยู่ใน MyCustomer
2. ข้อมูลอะไรอยู่ใน LINE OA
3. ข้อมูลอะไรเข้าถึงผ่าน Messaging API
4. MyCustomer เปิด API ใดให้ใช้
5. Export ข้อมูลอะไรได้
6. สามารถ Mapping กับ Thunder Customer ID ได้หรือไม่
7. สามารถ Sync กับ HubSpot/Zoho ได้หรือไม่
8. ข้อจำกัดด้าน License / API / Terms มีอะไรบ้าง

---

## 13. Connector Interface

Connector แต่ละตัวควร implement Conceptual Interface เดียวกัน

```
CRMConnector

authenticate()

createContact()
updateContact()
findContact()

createCompany()
associateCompany()

createLead()
createDeal()
updateDeal()

assignOwner()

receiveEvent()

healthCheck()
```

ไม่จำเป็นต้อง implement ทุก method ใน PoC

แต่ Architecture ต้องไม่ผูก Business Logic เข้ากับ HubSpot หรือ Zoho โดยตรง

---

## 14. Integration Levels

ให้ทีมประเมิน Connector เป็น 3 ระดับ

### Level 1 — Lead Capture

Website → CRM

Create / Update Contact

เหมาะสำหรับ **Thunder Digital Presence — Launch**

### Level 2 — Customer Integration

Website + LINE ↕ CRM

รองรับ: Identity, Source, Lead, Company, Owner, Deal

เหมาะสำหรับ **Launch / Transform**

### Level 3 — Connected Customer

Website + LINE + CRM ↕ ThunderOne

รองรับ: Identity, Activity, Lifecycle, Opportunity, Consent, Analytics

ยังถือเป็น **Future Architecture**

---

## 15. Security Requirements

PoC ต้องใช้แนวทางที่สามารถยกระดับสู่ Production ได้

**ห้าม:**
- Hard-code API Key
- Commit Secret ลง Repository
- Expose Token ฝั่ง Browser
- Log Personal Data โดยไม่จำเป็น

**ต้องมีอย่างน้อย:**
- Environment Secret
- HTTPS
- Authentication
- Webhook Verification
- Error Handling
- API Rate-limit Handling
- Retry Strategy
- Audit Log
- Minimum Required Data
- Consent Capture

---

## 16. Evaluation Matrix

หลังจบ PoC ให้ทีมให้คะแนนแต่ละระบบ 1–5

| Criteria | HubSpot | Zoho | LINE |
|---|---|---|---|
| Setup | | | |
| API Quality | | | |
| Documentation | | | |
| Free-tier Capability | | | |
| Authentication | | | |
| Webhook | | | |
| Contact Model | | | |
| Company Model | | | |
| Deal / Pipeline | | | |
| LINE Compatibility | | | |
| Custom Fields | | | |
| Identity Mapping | | | |
| Data Export | | | |
| PDPA / Consent Fit | | | |
| Developer Experience | | | |
| SME Fit | | | |
| Enterprise Scalability | | | |
| Cost to Customer | | | |

พร้อมเขียน ข้อดี / ข้อจำกัด / Recommendation ของแต่ละระบบ

---

## 17. Required Demo

ทีมต้องสามารถ Demo Live Scenario ต่อไปนี้ได้

### Demo A — B2B

ThunderOne Website → Request Demo → Lead Capture → CRM Contact → Company → Deal → Sales Owner → Update Deal Stage → Thunder รับสถานะกลับ

### Demo B — LINE Journey

ThunderOne LINE OA → Add Friend → Interested in ThunderOne → Lead Form → Identity Mapping → CRM → Existing/New Customer Detection

### Demo C — B2C

Demo Business → LINE OA → MyCustomer → Member → Point / Tier → Segment → Campaign

---

## 18. Success Criteria

PoC ถือว่าผ่านเมื่อทีมสามารถพิสูจน์ได้ว่า:

1. Website Lead เข้า CRM ได้จริง
2. Duplicate Lead สามารถตรวจสอบหรือจัดการได้
3. Source / Campaign / UTM ถูกส่งเข้า CRM
4. Company และ Contact สามารถสัมพันธ์กันได้
5. สามารถสร้างหรือจัดการ Opportunity / Deal ได้
6. LINE Identity สามารถเชื่อมกับ Customer Journey ได้ในระดับที่พิสูจน์ได้
7. CRM สามารถส่ง Event/Status กลับมายัง Integration Layer ได้อย่างน้อยหนึ่งระบบ
8. ทีมเข้าใจข้อจำกัดของ Free Edition
9. LINE MyCustomer Capability ถูกแยกออกจาก Messaging API อย่างถูกต้อง
10. สามารถ Demo End-to-End ให้ Product/Sales ดูได้

---

## 19. Expected Deliverables

เมื่อจบ Exploration ทีมส่งมอบ:

**01 — Working PoC**
- HubSpot Connector
- Zoho Connector
- LINE OA Journey

**02 — Demo Environment**
- ThunderOne Demo Website
- LINE OA Test
- CRM Test Accounts

**03 — Technical Report**
- API
- Authentication
- Data Mapping
- Limits
- Issues
- Security
- Cost

**04 — CRM Comparison Matrix**
- HubSpot vs Zoho vs LINE

**05 — Architecture Recommendation**

เสนอว่า Thunder ควร:
- Support อะไรเป็น Standard
- Support อะไรเป็น Optional
- อะไรไม่ควรทำ
- Thunder Connect จำเป็นหรือไม่
- ThunderOne ควรเก็บ Customer Data ระดับใด

---

## 20. Development Principle

**Integrate before we build.**

Thunder จะไม่สร้าง CRM เพียงเพราะเราสามารถสร้างได้

เราจะสร้างเฉพาะ Capability ที่ทำให้ Customer Journey ของ Thunder แตกต่าง และใช้ระบบมาตรฐานของตลาดสำหรับ Capability ที่มีอยู่แล้ว

เป้าหมายของ Exploration นี้จึงไม่ใช่

> "CRM ตัวไหนดีที่สุด?"

แต่คือ

> "Thunder ควรเชื่อม Customer Journey ของเราเข้ากับ CRM อย่างไร โดยไม่ผูก Platform กับ CRM รายใดรายหนึ่ง"

---

## Target Outcome

หลังจบ PoC เราควรสามารถ Demonstrate Journey จริง:

- **DISCOVER** — Website / Social
- **ENGAGE** — LINE OA
- **IDENTIFY** — Customer Identity
- **CAPTURE** — Lead / Interest / Consent
- **CONNECT** — CRM
- **CONVERT** — Sales / Deal
- **UNDERSTAND** — ThunderOne

นี่จะเป็น Technical Foundation สำหรับ

**Thunder Digital Presence — Design. Build. Connect.**