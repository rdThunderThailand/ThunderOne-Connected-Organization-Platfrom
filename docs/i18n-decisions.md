# การตัดสินใจเรื่องเว็บสองภาษา (i18n)

วันที่: 2026-08-20

บันทึกการตัดสินใจสถาปัตยกรรมสำหรับการทำเว็บ ThunderOne ให้รองรับสองภาษา (ไทย/อังกฤษ) สรุปจากการสัมภาษณ์ก่อนเริ่มลงมือทำ ยังไม่ได้ implement — เอกสารนี้ใช้เป็น reference ตอนเริ่มเขียนโค้ดจริง

## 1. ภาษาที่รองรับ

- **ไทย (`th`)** — ค่าเริ่มต้น (default locale)
- **อังกฤษ (`en`)** — ภาษารอง

## 2. โครงสร้าง routing

- ใช้ **path-based routing**: `app/[locale]/...`
- **มี locale prefix เสมอทุกภาษา** (รวมถึงภาษาเริ่มต้น) เช่น `/th/about`, `/en/about` — ไม่มีเวอร์ชันไม่มี prefix
- **slug เหมือนกันทั้งสองภาษา** ไม่แปล path (เช่น `/th/about` และ `/en/about` ไม่ใช่ `/th/เกี่ยวกับเรา`)

## 3. การตัดสินใจภาษาเริ่มต้นเมื่อเข้า root `/`

ลำดับความสำคัญ (สูงไปต่ำ):

1. locale ที่ระบุตรงใน URL อยู่แล้ว
2. cookie ที่ผู้ใช้เคยเลือกไว้เอง (การเลือกเองของผู้ใช้ต้องชนะทุกอย่างในครั้งถัดไป)
3. เช็ค IP location ผ่าน `geolocation()` จากแพ็กเกจ `@vercel/functions` — ถ้าอยู่ในไทย → `th`, **ถ้าไม่ใช่ → `en`**
4. ไม่มีข้อมูล geo เลย (unknown) → fallback เป็น `th` (site default)

**หมายเหตุ**: ตอนคุยกันตอนแรกเขียนไว้ว่า "ถ้าไม่ใช่ไทย → ใช้ default" ซึ่งจะทำให้ฟีเจอร์นี้ไม่มีผลอะไรเลย (เพราะ default ก็คือ `th` อยู่แล้ว) แก้ไขให้ตรงกับเจตนาจริงแล้ว: ไม่ใช่ไทย → `en`, ส่วนกรณีไม่มีข้อมูล geo เลย (unknown/local dev) → fallback เป็น `th`

**ข้อจำกัดทางเทคนิค**: `geolocation()` ใช้งานได้เฉพาะตอน deploy จริงบน Vercel เท่านั้น ไม่มีข้อมูลตอนรัน `next dev` ในเครื่อง (Next.js 15+ ถอด `request.geo`/`request.ip` ออกจาก `NextRequest` แล้ว) กรณีนี้ถือเป็น "ไม่มีข้อมูล geo" จึง fallback เป็น `th`

## 4. การเก็บเนื้อหา/คำแปล

- ใช้ **ไฟล์ dictionary ในโค้ด** (ไม่ใช่ database) — นักพัฒนาเป็นคนแก้ไข/อัปเดตเอง ผ่าน deploy
- ใช้ไลบรารี **`next-intl`** (ไม่เขียน i18n เอง) เพราะ:
  - มี `useTranslations()` ใช้ได้ทั้ง Server และ Client Component (จำเป็นเพราะ `Navbar.tsx` เป็น Client Component)
  - มี routing helper ที่ครอบ locale prefix + cookie + detection logic ให้พร้อมใช้
- **โครงสร้างไฟล์**: แยก namespace ต่อหน้า/component (เช่น `navbar.json`, `about.json`, `solutions.json`) ไม่ใช้ไฟล์เดียวรวมทุก key — เผื่อเว็บขยายเป็น ~20 หน้าตามแผนเมนูใน `Navbar.tsx`

## 5. เนื้อหาที่จะเติบโตในอนาคต (นอกเหนือจาก UI copy)

- ตอนนี้ทุกหน้ารวมถึง Resources (Knowledge, Customer Stories ฯลฯ) เป็นเนื้อหาตายตัวเหมือนหน้าอื่น ๆ — ใช้ dictionary เช่นกัน
- **หมายเหตุสำหรับอนาคต**: ส่วนที่จะกลายเป็นเนื้อหาเพิ่มเรื่อย ๆ (เช่น Customer Stories, บทความความรู้) จะย้ายไปเก็บใน **Supabase** แทน (มี dependency อยู่แล้ว) — ตอน implement ควรแยกชั้น data-fetching ของหน้าพวกนี้ออกจาก UI ไว้ล่วงหน้า เพื่อให้สลับ source จาก dictionary ไป Supabase ทีหลังได้โดยไม่ต้องรื้อโครงสร้าง

## 6. พฤติกรรมเมื่อคำแปลขาดหาย

- **Fallback ไปภาษาไทย** โดยอัตโนมัติเมื่อ key ไหนยังไม่มีคำแปลอังกฤษ (กันหน้าเว็บพัง)
- เพิ่ม **warning ตอน dev/CI** เมื่อพบ key ที่ขาดคำแปล เพื่อไม่ให้ลืมแปลจริงก่อนขึ้น production

## 7. Language switcher

- สลับ locale prefix แต่ **อยู่หน้าเดิม** (เช่น `/th/platform/security` → `/en/platform/security`) ไม่เด้งกลับหน้าแรก
- ต้องต่อเข้ากับ dropdown ที่มีอยู่แล้วใน `src/components/layout/Navbar.tsx` (ปัจจุบันเป็นแค่ local state `languages = ["TH", "EN"]` ยังไม่ทำงานจริง)

## 8. คำศัพท์ภาษาอังกฤษที่ตายตัว (glossary)

- คำแปลใน `th.json` ไม่จำเป็นต้องเป็นภาษาไทยเสมอไป — ใส่ค่าเป็นภาษาอังกฤษตรง ๆ ได้เมื่อคำนั้นตั้งใจให้คงเป็นอังกฤษ (next-intl ไม่บังคับภาษาของ value)
- **ชื่อแบรนด์/ชื่อ feature ที่ตายตัว** (เช่น "ThunderOne", "Thunder Care", "Asset Intelligence") ให้เก็บไว้ใน **namespace กลาง `common.json`** ค่าเดียวกันทั้ง `th` และ `en` แล้ว interpolate เข้าประโยคผ่าน next-intl (เช่น `t('intro', { term: t('common.thunderCare') })`) — เพื่อป้องกันพิมพ์ไม่ตรงกัน/แปลผิดโดยไม่ตั้งใจในไฟล์ต่าง ๆ
- คำภาษาอังกฤษทั่วไปที่ปนอยู่ในประโยค (ไม่ใช่ชื่อเฉพาะ) พิมพ์ตรง ๆ ในแต่ละไฟล์ namespace ของหน้านั้นได้เลย ไม่ต้องขึ้น glossary กลาง

## 9. งานคู่ขนานที่ต้องทำ

- Migrate `src/middleware.ts` → `proxy.ts` ตามข้อกำหนดใหม่ของ Next.js 16 (`middleware.js` ถูก deprecate แล้ว เปลี่ยนชื่อเป็น `proxy.js`, functionality เหมือนเดิม) — next-intl routing/middleware config จะไปอยู่ในไฟล์นี้

## สถานะ ณ วันที่บันทึก (ก่อนเริ่ม implement)

- Next.js 16.3.1, App Router, React 19
- หน้าที่มีอยู่ (แบนราบ ไม่มี locale prefix): `about`, `partners`, `platform`, `resources`, `solutions`, `use-cases` — เนื้อหา hardcode เป็นภาษาอังกฤษทั้งหมด
- `Navbar.tsx` เป็น Client Component, มี label เมนู hardcode + language switcher จำลอง
- `Footer.tsx` เป็น Server Component
- `src/middleware.ts` มีอยู่แต่ยังไม่ทำอะไร (ใช้ convention เก่า)
- `next-intl` ยังไม่ได้ติดตั้งเป็น dependency
- Supabase (`@supabase/ssr`, `@supabase/supabase-js`) มีอยู่ใน dependency แล้วแต่ยังไม่ได้ใช้งานส่วนนี้

## Implementation log (2026-08-20)

ทุกข้อข้างต้น implement เสร็จแล้วในรอบนี้:

- ติดตั้ง `next-intl` และ `@vercel/functions`
- `src/i18n/routing.ts`, `src/i18n/navigation.ts`, `src/i18n/request.ts`, `src/i18n/messages.ts` — routing config, navigation helpers (`Link`/`usePathname`), request config, และตัวรวม dictionary ต่อ namespace
- ย้ายทุกหน้าเข้า `src/app/[locale]/...` (ใช้ `git mv` รักษาประวัติ), root layout ย้ายไปเป็น `src/app/[locale]/layout.tsx`
- `src/middleware.ts` → `src/proxy.ts` พร้อม logic ตามลำดับ URL > cookie > geo-IP > `th`
- สร้าง `messages/{th,en}/*.json` ครบ 10 namespace (common, navbar, footer, home, about, partners, platform, resources, solutions, use-cases) — **คำแปลไทยเป็น draft ที่ยังไม่ได้ผ่านการรีวิวจากทีม ควรให้คนตรวจสำนวนก่อนขึ้น production จริง**
- อัปเดต `Navbar.tsx`/`Footer.tsx` ให้ใช้ `useTranslations`/`getTranslations` และ locale-aware `Link`, ต่อ language switcher ใน Navbar เข้ากับ `next-intl` จริง (เดิมเป็นแค่ local state ที่ไม่ทำงาน)
- ยืนยันด้วย `tsc --noEmit`, `eslint`, `next build` (ทุก route static-prerender ครบ 14 หน้า/locale), และรัน `next dev` ทดสอบทุก route จริงผ่าน curl (status code, เนื้อหาที่ถูกต้องต่อภาษา, `<html lang>`, cookie precedence)

**ข้อควรรู้ที่เจอระหว่างทำ**: การแยก `NextIntlClientProvider` ให้ครอบเฉพาะ `Navbar` (แยกจาก `main`/`Footer`) ทำให้เกิด error "No intl context found" ใน dev server (Next 16 + Turbopack + next-intl 4.13.7) ต้องครอบทั้ง `Navbar`, `main`, และ `Footer` ไว้ใน provider เดียวกันถึงจะทำงานถูกต้อง (แม้ Footer/pages จะเป็น Server Component ที่ใช้ `getTranslations` ฝั่ง server ก็ตาม) — ยังคง scope `messages` ที่ส่งเข้า provider ให้เหลือแค่ `Navbar`/`Common` ได้ตามเดิมเพื่อลด client bundle
