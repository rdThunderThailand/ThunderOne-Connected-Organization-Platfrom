ThunderOne LINE OA PoC
Step 0.11 — Talk to us → LINE Summary
DEV BRIEF — Canonical Payload → Message Builder → LINE Push

1. Objective
เมื่อผู้ใช้กรอก Talk to us flow สำหรับ Digital Signage & Media แล้ว Backend ต้องรับ Canonical Payload, สร้างข้อความสรุปที่อ่านง่ายสำหรับลูกค้า และส่งข้อความนั้นเข้า LINE OA ผ่าน LINE Messaging API.
2. Scope ของ Step 0.11
•	ใช้ Canonical Payload ชุดเดิมจาก Website เป็น input หลัก
•	เพิ่มข้อมูล Quick Questions ของ Digital Signage & Media: จำนวนจอ และลักษณะการใช้งาน
•	เพิ่มช่องทางที่ลูกค้าต้องการติดต่อ เช่น LINE / callback
•	สร้าง Message Builder ใน Backend
•	ส่งข้อความ Summary ผ่าน LINE Push Message API
•	รอบแรกสามารถใช้ LINE userId สำหรับ test แบบ hardcode ได้

3. Updated Canonical Payload
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
    "timestamp": "2026-09-01T09:30:00+07:00"
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

4. Quick Question Value Set
Field	Internal Value	Display Value
qualification.screen_count	1_5	1–5 จอ
    6_20	6–20 จอ
    21_50	21–50 จอ
    50_plus	50+ จอ
qualification.usage_type	office_organization	ภายในสำนักงาน / องค์กร
    multi_branch	หลายสาขา / หลายพื้นที่
    public_government	พื้นที่สาธารณะ / หน่วยงานรัฐ
    advertising_network	Advertising Network
contact_preference.channel	line	LINE
    callback	ให้เราติดต่อกลับ

5. Message Builder — Backend Responsibility
Message Builder คือ logic/function ฝั่ง Backend ที่รับ Canonical Payload แล้วแปลงค่าภายใน ให้เป็นข้อความที่ลูกค้าอ่านได้ ก่อนส่งต่อไป LINE Messaging API.
Suggested function concept:
buildLineLeadSummary(payload)
ตัวอย่าง input:
{
  "first_name": "Somchai",
  "interested_solution": "Digital Signage & Media",
  "qualification": {
    "screen_count": "21_50",
    "usage_type": "multi_branch"
  },
  "contact_preference": {
    "channel": "line"
  }
}
ตัวอย่าง output:
สวัสดีครับ คุณ Somchai 👋

ขอบคุณที่สนใจ ThunderOne
ทีมงานได้รับข้อมูลของคุณเรียบร้อยแล้วครับ

ข้อมูลที่คุณระบุ
หัวข้อ: Digital Signage & Media
จำนวนจอ: 21–50 จอ
ลักษณะการใช้งาน: หลายสาขา / หลายพื้นที่
ช่องทางติดต่อ: LINE

ทีมงานจะนำข้อมูลนี้ไปประกอบการแนะนำ Solution
และสามารถสอบถามข้อมูลเพิ่มเติมผ่าน LINE นี้ได้เลยครับ
6. Target Backend Flow
Talk to us Form
      ↓
Canonical Payload
      ↓
Backend
  ├─ Validate payload
  ├─ buildLineLeadSummary(payload)
  └─ sendLineMessage(lineUserId, summary)
      ↓
LINE Push Message API
      ↓
LINE OA
      ↓
Customer receives summary

7. LINE API Call
Backend เรียก LINE Push Message API ที่ทดสอบผ่านแล้ว:
POST https://api.line.me/v2/bot/message/push
Body concept:
{
  "to": "<LINE_USER_ID>",
  "messages": [
    {
      "type": "text",
      "text": "<SUMMARY_FROM_MESSAGE_BUILDER>"
    }
  ]
}
8. ข้อมูลที่ไม่ต้องแสดงใน LINE
ข้อมูลต่อไปนี้ยังคงอยู่ใน Canonical Payload และใช้ใน Backend/CRM ได้ แต่ไม่จำเป็นต้องโชว์ในข้อความสรุปให้ลูกค้าเห็น:
•	Email / Mobile (ถ้าไม่จำเป็นต่อข้อความสรุป)
•	UTM Source / Medium / Campaign
•	Landing Page
•	Consent timestamp / consent metadata
•	System/internal IDs
9. Test Case — Step 0.11
#	Action	Expected Result
1	Submit payload ที่มี screen_count=21_50, usage_type=multi_branch	Backend รับ payload ได้
2	Run Message Builder	แปลง 21_50 → 21–50 จอ และ multi_branch → หลายสาขา / หลายพื้นที่
3	ใช้ LINE userId test ที่ได้จาก Webhook	Backend ส่ง Push Message ได้
4	ตรวจมือถือ	ได้รับ Summary และข้อมูลตรงกับ Form
10. Definition of Done
•	Website ส่ง payload ที่มี qualification.screen_count และ qualification.usage_type ได้
•	Backend มี Message Builder ที่ใช้ Canonical Payload เป็น input
•	Message Builder แปลง internal value เป็น display text ได้ถูกต้อง
•	Backend ส่ง Summary ผ่าน LINE Push API ได้
•	LINE user ได้รับข้อความที่ข้อมูลตรงกับ Form
•	ไม่แก้ Website Payload ให้ผูกกับ LINE-specific schema
11. Out of Scope ใน Step นี้
•	ยังไม่ทำ Website Lead ↔ LINE userId linking อัตโนมัติ
•	ยังไม่ทำ LIFF
•	ยังไม่เชื่อม HubSpot ใน step นี้
•	ยังไม่ทำ CRM owner / qualification automation
•	ยังไม่ทำ Rich/Flex Message; text message ผ่านก่อน
12. Next Step
Step 0.12: Website Lead ↔ LINE Identity Linking — เลิก hardcode LINE userId และทำให้ระบบรู้ว่า Lead ที่เพิ่งกรอก Form ต้องส่ง Summary ไปหา LINE user คนใด.
