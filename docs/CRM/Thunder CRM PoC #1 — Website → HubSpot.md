# Thunder CRM PoC #1 — Website → HubSpot

## DEV ASSIGNMENT — Canonical Payload + Mapping Approach

**Objective:** ทดลองเชื่อมหน้า *Talk to us / Request Demo* ไปยัง *HubSpot* เพื่อศึกษา *CRM*, *Data Mapping* และพฤติกรรมของ *Contact record*

---

## 1. Scope

- ทำ PoC #1: Website → CRM โดยใช้ HubSpot เป็น CRM ตัวแรก
- Frontend ส่งข้อมูลจาก Talk to us Form เป็น Canonical Payload ของเราเอง
- Backend ทำ HubSpot Mapper เพื่อแปลง Canonical fields เป็น HubSpot Contact properties
- ส่งข้อมูลเข้า HubSpot ผ่าน Backend เท่านั้น ไม่ให้ Frontend เรียก HubSpot API โดยตรง
- รอบแรกโฟกัส Create/Update Contact และตรวจสอบข้อมูลที่เข้า HubSpot; Company association, Deal, LINE, Zoho และ Reverse Sync ทำในรอบถัดไป

---

## 2. Target Flow

```
Talk to us Form
      ↓
Canonical Payload
      ↓
Backend Validation
      ↓
HubSpot Mapper
      ↓
HubSpot Contact API
      ↓
HubSpot Contact Record
      ↓
Return / store HubSpot Contact ID
```

---

## 3. Canonical Payload from Website

ให้หน้า Website / Backend ใช้ payload กลางนี้เป็น Business Data Model สำหรับ PoC #1:

```json
{
  "first_name": "Somchai",
  "last_name": "Prasert",
  "company_name": "ABC Company",
  "position": "IT Manager",
  "mobile": "+66811111111",
  "email": "somchai@abc.com",
  "interested_solution": "ThunderOne",
  "inquiry_message": "I would like a demo",
  "consent": {
    "status": "granted",
    "purpose": "sales_contact",
    "source": "website",
    "timestamp": "2026-08-27T14:20:00+07:00"
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

หมายเหตุ: Canonical Payload นี้ไม่ใช่ HubSpot API schema และไม่ควรผูกชื่อ field ของ Website กับ CRM เจ้าใดเจ้าเดียว

---

## 4. Mapping Requirement

| Canonical Field | Business Meaning | HubSpot Property | Type / Note |
|---|---|---|---|
| first_name | ชื่อ | firstname | Default Contact property |
| last_name | นามสกุล | lastname | Default Contact property |
| email | อีเมล | email | Default Contact property / ใช้ทดสอบ duplicate |
| mobile | เบอร์โทร | mobilephone | Default Contact property |
| position | ตำแหน่ง | jobtitle | Default Contact property |
| company_name | ชื่อบริษัท | company | PoC รอบแรกเก็บเป็น text; association ทำรอบถัดไป |
| interested_solution | Solution ที่สนใจ | interested_solution | Custom property |
| inquiry_message | ข้อความที่ลูกค้าส่ง | inquiry_message | Custom property |
| consent.status | สถานะ Consent | thunder_consent_status | Custom property |
| consent.purpose | วัตถุประสงค์ Consent | thunder_consent_purpose | Custom property |
| consent.source | แหล่ง Consent | thunder_consent_source | Custom property |
| consent.timestamp | เวลา Consent | thunder_consent_timestamp | Custom property |
| acquisition.source | Lead source | thunder_lead_source | Custom property |
| acquisition.medium | Acquisition medium | thunder_medium | Custom property |
| acquisition.campaign | Campaign | thunder_campaign | Custom property |
| acquisition.utm_source | UTM source | thunder_utm_source | Custom property |
| acquisition.utm_medium | UTM medium | thunder_utm_medium | Custom property |
| acquisition.utm_campaign | UTM campaign | thunder_utm_campaign | Custom property |
| acquisition.landing_page | Landing page | thunder_landing_page | Custom property |

Dev ต้องตรวจสอบ internal name และ field type ของ HubSpot properties จริงก่อน implement หากไม่มี property ให้สร้าง Custom Property ใน HubSpot test account

---

## 5. Example HubSpot API Payload After Mapping

```json
{
  "properties": {
    "firstname": "Somchai",
    "lastname": "Prasert",
    "email": "somchai@abc.com",
    "mobilephone": "+66811111111",
    "jobtitle": "IT Manager",
    "company": "ABC Company",
    "interested_solution": "ThunderOne",
    "inquiry_message": "I would like a demo",
    "thunder_consent_status": "granted",
    "thunder_consent_purpose": "sales_contact",
    "thunder_consent_source": "website",
    "thunder_consent_timestamp": "2026-08-27T14:20:00+07:00",
    "thunder_lead_source": "website",
    "thunder_medium": "organic",
    "thunder_campaign": "",
    "thunder_utm_source": "facebook",
    "thunder_utm_medium": "cpc",
    "thunder_utm_campaign": "thunderone_poc",
    "thunder_landing_page": "/talk-to-us"
  }
}
```

---

## 6. Implementation Notes

- Mapping อยู่ฝั่ง Backend / Connector ไม่อยู่ใน Frontend
- ห้าม expose HubSpot token / secret ใน Browser
- Backend ต้อง validate required fields และ normalize email / mobile ก่อนเรียก CRM
- ให้แยก Canonical model ออกจาก HubSpot-specific model เพื่อให้ภายหลังสามารถเพิ่ม Zoho Mapper โดยไม่แก้ Website payload
- สำหรับ PoC รอบแรก company_name map เป็น Contact text property ได้ก่อน; Company Object + Association เป็น scope ถัดไป
- Custom properties ต้องสร้างและยืนยัน internal name ใน HubSpot test account ก่อนส่ง payload จริง

---

## 7. Minimum Test Cases for This Assignment

| ID | Scenario | Action | Expected |
|---|---|---|---|
| TC-01 | New Contact | Submit email ใหม่ | HubSpot สร้าง Contact และ field ที่ map ไว้เข้าได้ครบ |
| TC-02 | Same Email | Submit email เดิมซ้ำ | บันทึก behavior ว่า create / update / reject อย่างไร; ห้ามสรุปเองโดยไม่มี evidence |
| TC-03 | Custom Fields | ส่ง interested_solution + UTM + consent | Custom properties ถูกเก็บและอ่านกลับได้ |
| TC-04 | Validation | ส่ง email invalid / required field ขาด | Backend ไม่ส่ง payload ที่ไม่ผ่าน validation เข้า HubSpot |
| TC-05 | Contact ID | Create/Update สำเร็จ | Backend ได้ HubSpot Contact ID กลับมาและ return/store ได้ |

---

## 8. Deliverables from Dev

- Working Website → Backend → HubSpot Contact flow
- Canonical-to-HubSpot mapping table ที่ใช้จริง
- รายการ HubSpot Custom Properties ที่สร้าง พร้อม internal name และ type
- Evidence ของ TC-01 ถึง TC-05 (request/result หรือ screenshot/record ID ตามเหมาะสม)
- สรุปข้อจำกัด/สิ่งที่พบจาก HubSpot: duplicate behavior, required fields, property limitations, error cases

---

## 9. Definition of Done

- Submit Talk to us Form แล้ว HubSpot Contact ถูกสร้างหรืออัปเดตได้จริง
- ข้อมูลหลัก Name / Email / Mobile / Company / Position / Interested Solution / Message / Consent / Source / UTM ไม่สูญหาย
- Website payload ยังคงเป็น Canonical Payload และไม่ได้ใช้ HubSpot-specific field names โดยตรง
- Mapping ถูกแยกไว้ใน Backend
- ทีมสามารถเปิด HubSpot แล้วตรวจ Contact record จาก PoC ได้

---

**Source basis:** Thunder CRM Integration Exploration & Demo Paper v0.1 — PoC #1 Website → CRM, Canonical Customer Data Model, Connector Interface, Security Requirements.