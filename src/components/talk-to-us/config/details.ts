// Structural config for the `details` step (question.md ขั้นที่ 3 —
// ข้อมูลพื้นฐานองค์กร + ข้อมูลติดต่อ). Display labels live in
// messages/{th,en}/talk-to-us.json under `details.*`; the English strings
// serialized into the CRM payload live in ./crmLabels.ts.
//
// Contact fields (name / company / email / phone) are plain text inputs
// handled directly in DetailsStep — only the pick-one firmographic groups
// and the optional preferred-time group are config-driven.

export type DetailFieldConfig = {
  id: string;
  options: string[];
};

// question.md ข้อมูลพื้นฐานองค์กร ข้อ 1–3.
export const FIRMOGRAPHIC_FIELDS: DetailFieldConfig[] = [
  {
    id: "position",
    options: ["owner", "manager", "it-ops", "marketing", "procurement", "other"],
  },
  {
    id: "industry",
    options: [
      "retail",
      "manufacturing",
      "real-estate",
      "healthcare",
      "education",
      "finance",
      "hospitality",
      "other",
    ],
  },
  {
    id: "orgSize",
    options: ["1-50", "51-200", "201-500", "501-1000", "1000-plus"],
  },
];

// Optional — carried over from the removed callback sub-step. "" means the
// customer left it unset, in which case it is omitted from the CRM payload.
export const PREFERRED_TIME_OPTIONS = ["any", "morning", "afternoon", "evening"] as const;
