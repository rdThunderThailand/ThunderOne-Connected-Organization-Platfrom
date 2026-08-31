# ThunderOne - LINE OA PoC
## Backend Webhook Dev Brief

**Current phase:** Build the first backend endpoint for LINE Messaging API

---

## 1. Objective

สร้าง Backend endpoint ตัวแรกสำหรับ LINE OA เพื่อรับ event จาก LINE Messaging API เช่น user ส่งข้อความหรือ Add Friend และเตรียมฐานสำหรับขั้นถัดไปที่จะเชื่อมข้อมูลจาก Website Talk to us, LINE Identity และ CRM.

## 2. Current Status

| Item | Status |
|---|---|
| LINE OA created | DONE |
| Messaging API enabled | DONE |
| Provider: ThunderOne | DONE |
| Messaging API Channel created | DONE |
| Test user Add Friend + send message | DONE |
| Greeting / response settings checked | DONE |
| Channel Access Token issued | DONE |
| Backend exists | NOT YET |
| Webhook endpoint exists | NOT YET |
| Webhook URL configured in LINE | NOT YET |
| HubSpot connected | NOT YET |

## 3. What Dev Needs to Build Now

- สร้าง Backend service สำหรับ LINE Integration (PoC version)
- สร้าง public HTTPS endpoint: `POST /api/line/webhook`
- รับ webhook events จาก LINE Messaging API
- Verify request signature ด้วย Channel Secret ก่อนประมวลผล
- รองรับอย่างน้อย event type: `follow` และ `message`
- Log เฉพาะข้อมูลที่จำเป็นสำหรับ PoC เช่น event type, LINE userId, message text, timestamp โดยไม่ log secret/token
- ตอบ HTTP 200 ให้ LINE เมื่อรับ event สำเร็จ

## 4. Target Flow

```
LINE User
  |
  | Add Friend / Send Message
  v
LINE Platform
  |
  | Webhook Event
  v
POST https://<domain>/api/line/webhook
  |
  v
Thunder Backend
  |- Verify x-line-signature
  |- Read event type
  |- Read LINE userId
  |- Read message (if message event)
  |- Log / store test event
  v
Return HTTP 200
```

## 5. Important Clarification

Webhook endpoint ไม่ใช่ URL ที่ลูกค้ากดจากหน้า Website. ปุ่ม "คุยผ่าน LINE" จะไป LINE OA / LIFF ในขั้นถัดไป. Webhook endpoint มีไว้ให้ LINE Server เรียกเข้าหา Backend ของเราเท่านั้น.

## 6. Credentials / Environment Variables

ให้ Dev เก็บ credential ฝั่ง server เท่านั้น เช่น:

```
LINE_CHANNEL_ID=<from LINE Developers>
LINE_CHANNEL_SECRET=<secret>
LINE_CHANNEL_ACCESS_TOKEN=<issued token>
```

ห้ามใส่ Channel Secret หรือ Channel Access Token ใน Frontend, repository หรือ client-side JavaScript.

## 7. Minimum Event Handling for PoC

| Event | Expected Handling |
|---|---|
| `follow` | เก็บ LINE userId และยืนยันว่า backend รับ Add Friend event ได้ |
| `message:text` | เก็บ LINE userId + message text เพื่อพิสูจน์ว่า backend ระบุผู้ส่งได้ |

## 8. First Test Case

1. PM ใส่ Webhook URL ที่ Dev ส่งให้ใน LINE Developers Console
2. กด Verify / Enable Webhook
3. PM ส่งข้อความ "test" จาก LINE ส่วนตัวไปยัง Thunder One OA
4. LINE ส่ง message event ไปยัง `POST /api/line/webhook`ckend ต้องแสดงว่าได้รับ event พร้อม LINE userId และข้อความ "test"
6. Backend ตอบ HTTP 200

## 9. Definition of Done - This Step

- มี public HTTPS webhook URL ที่ LINE เรียกได้
- LINE Developers Verify webhook ผ่าน
- ส่งข้อความจาก LINE user แล้ว Backend รับ event ได้จริง
- Backend อ่าน LINE userId ได้
- Backend อ่าน message text ได้
- Signature verification ผ่าน
- ไม่มี secret/token ถูก expose ฝั่ง Frontend

## 10. Out of Scope for This Step

5. Ba
- ยังไม่เชื่อม HubSpot
- ยังไม่สร้าง Lead จาก LINE
- ยังไม่ทำ LIFF / Website-to-LINE identity linking
- ยังไม่ส่ง Talk to us summary เข้า LINE
- ยังไม่ทำ Auto reply / bot conversation logic
- ยังไม่ทำ Customer 360 หรือ Thunder Connect เต็มรูปแบบ

## 11. Next Step After Webhook Works

เมื่อ webhook รับ LINE userId ได้แล้ว ขั้นถัดไปคือเชื่อม Website Talk to us กับ LINE Identity เพื่อให้รู้ว่า Website Lead และ LINE user เป็นคนเดียวกัน จากนั้นค่อยส่ง summary จาก Form เข้า LINE OA และ sync ข้อมูลเดียวกันเข้าสู่ CRM.

---

**PM summary:** รอบนี้ Dev ยังไม่ต้องทำ CRM. งานมีแค่ทำ backend endpoint ให้ LINE ยิง event เข้ามาได้จริง และพิสูจน์ว่าเราได้รับ LINE userId + message จาก OA.