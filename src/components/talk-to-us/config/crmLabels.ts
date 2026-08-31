// === English labels for the CRM payload ===
//
// Decision (grill Q10/Q11): everything Thunder generates for the CRM —
// `position` and the serialized `inquiry_message` block — is stored in
// English for every site locale, so the (Thai) sales team can scan every
// record the same way. These strings are deliberately SEPARATE from the
// display i18n in messages/{th,en}/talk-to-us.json: editing marketing copy
// on the site must never shift values already written to HubSpot.
//
// Keys mirror ./questions.ts and ./details.ts verbatim. If a value is
// missing here the serializer falls back to the raw slug (loud but safe).

import type { TopicKey } from "../types";

/** question.md ขั้น 1 — screener → HubSpot `interested_solution` (also the slug). */
export const CRM_SOLUTION_LABELS: Record<TopicKey, string> = {
  "digital-signage": "Digital Signage & Media",
  communication: "Communication",
  "thunder-care": "Thunder Care",
  "asset-intelligence": "Asset Intelligence",
  "not-sure": "Not sure yet — wants to talk it through",
};

/** Step-2 question id → English field label used in the inquiry_message block. */
export const CRM_QUESTION_LABELS: Record<string, string> = {
  // digital-signage
  screenCount: "Screens in use",
  contentManagement: "Content management model",
  contentTypes: "Primary content types",
  // communication
  audience: "Primary audiences",
  mainProblem: "Main problem",
  recipientVolume: "Recipients per send",
  // thunder-care
  deviceCount: "Devices under management",
  helpdeskSystem: "Current helpdesk / ticketing",
  serviceModel: "Service model wanted",
  // asset-intelligence
  assetCount: "Approximate asset count",
  trackingMethod: "Current asset tracking",
  // not-sure
  currentProblems: "Current problems",
  affectedDepartments: "Most affected departments",
  firstConversationHelp: "Wants from the first conversation",
};

/** Step-2 option slug → English, grouped by question id. */
export const CRM_OPTION_LABELS: Record<string, Record<string, string>> = {
  screenCount: {
    none: "None yet (just starting)",
    "1-5": "1-5",
    "6-20": "6-20",
    "21-50": "21-50",
    "50-plus": "More than 50",
  },
  contentManagement: {
    central: "Fully centralised",
    "per-branch": "Each branch / department manages its own",
    hybrid: "A mix of both",
    unsure: "Not sure yet",
  },
  contentTypes: {
    promotion: "Promotions / products",
    announcement: "News / company announcements",
    safety: "Safety information / guidance",
    schedule: "Schedules / queues",
    entertainment: "Entertainment media / video",
    other: "Other",
  },
  audience: {
    employees: "Internal employees",
    customers: "Customers",
    partners: "Partners / resellers",
    public: "General public",
  },
  mainProblem: {
    // communication
    "not-reaching": "Messages don't reach the audience",
    "too-slow": "Sent too slowly / not on time",
    "no-measurement": "Can't measure opens / responses",
    "high-cost": "High cost / too many overlapping systems",
    other: "Other",
    // asset-intelligence
    "cant-find": "Can't locate assets / assets go missing",
    "outdated-data": "Data is outdated / inaccurate",
    "poor-decisions": "Can't decide buy / repair / dispose accurately",
    "slow-audit": "Asset audits take too long",
    "missed-maintenance": "Missed preventive-maintenance cycles",
  },
  recipientVolume: {
    "lt-100": "Fewer than 100",
    "100-500": "100-500",
    "501-2000": "501-2,000",
    "gt-2000": "More than 2,000",
  },
  deviceCount: {
    "lt-50": "Fewer than 50",
    "50-200": "50-200",
    "201-500": "201-500",
    "gt-500": "More than 500",
  },
  helpdeskSystem: {
    none: "No system (phone / chat requests)",
    "hard-to-use": "Has a system but hard to use / incomplete",
    "want-to-switch": "Has a system but wants to switch",
    unsure: "Not sure",
  },
  serviceModel: {
    reactive: "Reactive (repair on failure) only",
    preventive: "Preventive maintenance included",
    both: "Both, end to end",
  },
  assetCount: {
    "lt-100": "Fewer than 100 items",
    "100-500": "100-500 items",
    "501-2000": "501-2,000 items",
    "gt-2000": "More than 2,000 items",
  },
  trackingMethod: {
    spreadsheet: "Excel / documents",
    "dedicated-system": "Already has a dedicated system",
    none: "No tracking system at all",
  },
  currentProblems: {
    signage: "Screens / signage hard to manage across many branches",
    communication: "Can't reach employees / customers, can't measure",
    "it-support": "IT devices fail often, slow repairs, understaffed",
    "asset-tracking": "Can't track assets, stale data, missed maintenance",
    "not-analyzed": "Haven't analysed the problem seriously yet",
    other: "Other",
  },
  affectedDepartments: {
    it: "IT",
    marketing: "Marketing / corporate communications",
    operations: "Operations",
    finance: "Accounting / finance",
    hr: "Human resources",
    executive: "Senior management",
  },
  firstConversationHelp: {
    analyze: "Analyse the problem and recommend a solution",
    demo: "See a demo / real usage example",
    budget: "Estimate budget and investment plan",
    compare: "Compare against the current system",
  },
};

/** question.md ขั้น 3 — ตำแหน่งงาน → HubSpot `jobtitle` (English label). */
export const CRM_POSITION_LABELS: Record<string, string> = {
  owner: "Owner / C-level",
  manager: "Department manager",
  "it-ops": "IT / Operations",
  marketing: "Marketing / Corporate communications",
  procurement: "Procurement",
  other: "Other",
};

/** question.md ขั้น 3 — ประเภทธุรกิจ/อุตสาหกรรม. */
export const CRM_INDUSTRY_LABELS: Record<string, string> = {
  retail: "Retail",
  manufacturing: "Factory / Manufacturing",
  "real-estate": "Real estate / Office buildings",
  healthcare: "Hospital / Healthcare",
  education: "Education",
  finance: "Banking / Finance",
  hospitality: "Hotel / Tourism",
  other: "Other",
};

/** question.md ขั้น 3 — ขนาดองค์กร (จำนวนพนักงาน). */
export const CRM_ORG_SIZE_LABELS: Record<string, string> = {
  "1-50": "1-50 employees",
  "51-200": "51-200 employees",
  "201-500": "201-500 employees",
  "501-1000": "501-1,000 employees",
  "1000-plus": "More than 1,000 employees",
};

/** Optional preferred callback time (carried from the old callback step). */
export const CRM_PREFERRED_TIME_LABELS: Record<string, string> = {
  any: "Any time",
  morning: "Morning (9:00-12:00)",
  afternoon: "Afternoon (13:00-16:00)",
  evening: "Evening (16:00-18:00)",
};

/** Field labels for the firmographic / meta lines of the inquiry_message block. */
export const CRM_META_LABELS = {
  solution: "Interested solution",
  industry: "Industry",
  orgSize: "Organisation size",
  preferredTime: "Preferred callback time",
} as const;
