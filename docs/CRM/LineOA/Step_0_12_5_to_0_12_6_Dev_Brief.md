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
| Step 0.12.5 Dev LIFF Integration | NOT DONE |
| lead_id | NOT IMPLEMENTED |
| lead_token | NOT IMPLEMENTED |
| Step 0.12.6 Identity Linking | NOT STARTED |

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