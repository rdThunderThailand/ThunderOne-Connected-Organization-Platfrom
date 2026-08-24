# โครงสร้างหน้าเว็บ: page.tsx + feature Client component

ทุกครั้งที่สร้างหน้าเว็บใหม่ ให้แยกเป็นสองไฟล์เสมอ:

1. **`src/app/[locale]/<name>/page.tsx`** — Server Component บาง ๆ ทำหน้าที่:
   - `generateMetadata` (แปล title/description ตาม locale)
   - ดึง `params`, เรียก `setRequestLocale(locale)`
   - ดึงคำแปล/ข้อมูลผ่าน `getTranslations`/data fetching อื่น ๆ ฝั่ง server
   - ส่งค่าที่ดึงมาเป็น **props** เข้า `<NameClient />` เท่านั้น ไม่มี JSX ของ UI จริงอยู่ในไฟล์นี้

2. **`src/features/<name>/<Name>Client.tsx`** — `"use client"` component ที่รับ props มาแสดงผล เก็บ JSX/UI/interactivity ทั้งหมดของหน้านั้นไว้ที่นี่

ตัวอย่าง (about):

```
src/features/about/AboutClient.tsx     <- "use client", รับ props (eyebrow, heading, ...)
src/app/[locale]/about/page.tsx        <- Server Component, generateMetadata + getTranslations + <AboutClient ... />
```

## เหตุผล

- **`page.tsx` ต้องอยู่ฝั่ง server เสมอ** เพื่อให้ `generateMetadata`/`generateStaticParams` ทำงานได้ และหน้ายัง static-prerender ได้ (`next build` ต้องได้ `●` ไม่ใช่ `ƒ`)
- คำแปล/ข้อมูลถูกดึงที่ `page.tsx` แล้ว **ส่งเป็น props** เข้า Client component เสมอ — Client component **ห้ามเรียก `useTranslations()` เอง** เพราะจะทำให้เสีย static prerendering ของเนื้อหาที่แปลแล้ว
- แยก UI ออกจาก routing ทำให้ทดสอบ/reuse component ได้อิสระจากโครงสร้าง route

## ข้อยกเว้น

- `Navbar`/`Footer` ใน `src/components/layout/` เป็นกรณีพิเศษ (ใช้ร่วมทุกหน้า ไม่ผูกกับ route เดียว) ไม่ต้องอยู่ใน `src/features/`
- **หน้าที่มีหลาย section ซับซ้อน** (เช่น `home`, `solutions`) สามารถแยกแต่ละ section ออกเป็นไฟล์ย่อยใน `src/features/<name>/components/` ได้ โดย `<Name>Client.tsx` ทำหน้าที่แค่ import มาประกอบร่างตามลำดับ ไม่มี UI ของตัวเองอยู่ในไฟล์นั้นโดยตรง — เริ่มใช้ครั้งแรกกับ `home` (8 section + 1 shared `OrbitDiagram`) เพราะไฟล์เดียวจะยาวและแก้ยากเกินไป หน้าที่มี section น้อย/เรียบง่ายยังคงเป็นไฟล์เดียวตามเดิม
- **UI component ที่ใช้ร่วมกันข้าม feature จริงๆ** (ไม่ใช่แค่ layout อย่าง Navbar/Footer) ให้แยกไปไว้ `src/components/ui/` (เช่น `Breadcrumb.tsx`) หรือ `src/components/diagrams/` สำหรับ diagram/visualization ที่ซับซ้อน (เช่น `HeroOrbitDiagram.tsx` ซึ่งเดิมอยู่ใน `src/features/home/components/` แต่ย้ายออกมาเป็น shared เมื่อหน้า `solutions` ต้องใช้ diagram แบบเดียวกัน — รับ nodes/caption เป็น props แทนการผูกกับคีย์ตายตัวของหน้าใดหน้าหนึ่ง) — หลักการ: ถ้า component ถูกออกแบบมาให้ใช้เฉพาะหน้านั้น ให้อยู่ใน `src/features/<name>/components/`, ถ้าเริ่มมีหน้าที่สองต้องใช้ซ้ำ ให้ย้ายออกมาเป็น shared component แทนการ copy โค้ด

## ทางเลือกที่พิจารณาแล้วแต่ไม่ใช้: `useTranslations()` ใน client component

เคยพิจารณาให้ client component เรียก `useTranslations()` เองแทนการรับ props จาก server (ลด prop-drilling เวลามี section/ค่าคำแปลเยอะ เช่นหน้า `home`) แต่ตัดสินใจไม่ใช้ เพราะขัดกับเหตุผลข้อ "ต้องส่งเป็น props เสมอ" ด้านบน — เก็บไว้เป็นบันทึกในกรณีมีการเสนอแนวทางนี้อีกในอนาคต ไม่ใช่แนวทางที่ใช้อยู่

## ประวัติ

- 2026-08-20: กำหนดแนวทางนี้และย้าย 6 หน้าที่มีอยู่ (`home`, `about`, `partners`, `platform`, `resources`, `solutions`, `use-cases`) เข้าโครงสร้างนี้แล้วทั้งหมด
- 2026-08-20: เพิ่มข้อยกเว้น `components/` subfolder สำหรับหน้าที่มีหลาย section ซับซ้อน (เริ่มที่ `home`) และบันทึกทางเลือก `useTranslations()`-in-client ที่พิจารณาแล้วแต่ไม่ใช้
- 2026-08-20: สร้างหน้า `solutions` เต็มรูปแบบตาม pattern เดียวกับ `home` (components/ subfolder + types.ts) — ย้าย `HeroOrbitDiagram` จาก `home/components/` ไปเป็น shared `src/components/diagrams/HeroOrbitDiagram.tsx`, เพิ่ม `src/components/ui/Breadcrumb.tsx` เป็น shared component ตัวแรกใน `components/ui/`
- 2026-08-20: สร้างหน้าลูกของ `solutions` ตัวแรก (`solutions/digital-signage-media`) ยืนยันว่า convention นี้ใช้กับ **ทุกหน้ารวมถึงหน้าลูกของ route ที่มีอยู่แล้ว** ไม่ใช่แค่หน้าระดับบนสุด — แต่ละหน้าลูก (`solutions/<slug>`) มี `page.tsx` + `<Name>Client.tsx` + `types.ts` ของตัวเอง เก็บที่ `src/features/solutions/<slug>/`, และมี namespace คำแปลของตัวเองแยกจาก `SolutionsPage` (เช่น `DigitalSignageMediaPage` → `messages/{th,en}/digital-signage-media.json`) ลงทะเบียนใน `src/i18n/messages.ts` เพิ่มทีละหน้า
- 2026-08-20: สร้างหน้าลูกของ `solutions` ตัวที่สอง (`solutions/communication`) — พอ section shape เดิมโผล่ครั้งที่ 2 (numbered step-flow แบบ "How it works", bordered feature-card grid แบบ "Key capabilities") ก็ extract ออกเป็น shared component ทันทีตามหลักการด้านบน: `src/components/ui/StepFlowRow.tsx` และ `src/components/ui/FeatureCardGrid.tsx` — รับ icon/label ต่อ item เป็น props จาก caller, แก้ `solutions/digital-signage-media`'s `HowItWorksSection.tsx`/`KeyCapabilitiesSection.tsx` ให้ใช้ตัวร่วมนี้ด้วยแทนโค้ดเดิมที่ซ้ำ
- 2026-08-20: `use-cases/[slug]` (หน้า detail ของ use case แรก "announce-all-employees") **เบี่ยงเบนจาก default bespoke-per-page โดยตั้งใจ** — ผู้ใช้เลือก generic data-driven engine แทน เพราะ `USE_CASES` มีถึง 32 รายการ (ต่างจาก `solutions` ที่มีลูกไม่กี่หน้า) ทำให้ bespoke-per-page จะสร้างโฟลเดอร์ซ้ำซ้อนจำนวนมาก โครงสร้าง: `src/features/use-cases/detail/UseCaseDetailClient.tsx` + `components/*.tsx` (generic, รับ content ผ่าน `UseCaseDetailContent` ตัวเดียว ไม่ผูกกับ slug ใด) + `data/registry.ts` (map slug → structural data, ตอนนี้มี 1 entry) — `[slug]/page.tsx` เดียวรองรับทุก use case ในอนาคตได้โดยไม่ต้องสร้าง route/component ใหม่ ต่างจากทุกหน้าอื่นที่ทำ bespoke มาตลอด อย่าเข้าใจผิดว่าเป็นแนวทาง default ใหม่ — เฉพาะ `use-cases/[slug]` เท่านั้น (ตัดสินใจผ่านการสัมภาษณ์ผู้ใช้ตรงๆ ไม่ใช่ default ของ agent). คำแปลแต่ละ use case แยกไฟล์ต่ออัน (`messages/{th,en}/use-case-detail-<slug>.json`, namespace ของตัวเองใน `messages.ts`) ไม่ใช่ไฟล์รวม — ตาม principle "แยก namespace ต่อหน้า" เดิม. slug ที่ยังไม่มี entry ใน registry จะ `notFound()` (32-1 = 31 รายการที่เหลือใน `USE_CASES` ยังไม่มีหน้า detail จริง จนกว่าจะเพิ่ม data+i18n ให้ทีละอัน)
