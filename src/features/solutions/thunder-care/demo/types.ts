// === Content types for the Thunder Care "See it in action" demo overlay.
// Everything arrives pre-translated from page.tsx (namespace "ThunderCareDemo");
// no component in the demo calls useTranslations. ===

export type DemoUser = {
  name: string;
  role: string;
  sub: string;
};

export type DemoAppShellContent = {
  /** Small label under the ThunderOne logo, e.g. "EMPLOYEE" / "EXECUTIVE". Empty string hides it. */
  productSub: string;
  nav: string[];
  activeNavIndex: number;
  user: DemoUser;
  bottomAction: string;
};

export type DemoStoryStep = {
  number: string;
  title: string;
  description: string;
  calloutTitle: string;
  calloutItems: string[];
};

export type DemoStoryContent = {
  title: string;
  totalLabel: string;
  steps: DemoStoryStep[];
};

export type DemoStepperItem = {
  name: string;
  tagline: string;
};

export type DemoStepperContent = {
  back: string;
  next: string;
  finish: string;
  items: DemoStepperItem[];
};

export type DemoTopBarContent = {
  productName: string;
  title: string;
  badge: string;
  estimatedTime: string;
  exit: string;
};

export type DemoMobileTabsContent = {
  content: string;
  story: string;
};

export type DemoStatCard = {
  label: string;
  value: string;
  unit: string;
  caption: string;
};

export type DemoStep1Row = {
  name: string;
  badge: string;
  role: string;
  dept: string;
  startDate: string;
  readinessPercent: number;
  readinessLabel: string;
  readinessDetail: string;
  actionButton: string;
};

export type DemoStep1Content = {
  appShell: DemoAppShellContent;
  breadcrumb: string;
  pageTitle: string;
  pageSubtitle: string;
  exportButton: string;
  addButton: string;
  stats: DemoStatCard[];
  tableTitle: string;
  searchPlaceholder: string;
  filterButton: string;
  columns: string[];
  rows: DemoStep1Row[];
  viewAll: string;
};

export type DemoTaskStatus = "done" | "doing" | "todo";

export type DemoStep2Task = {
  title: string;
  description: string;
  status: DemoTaskStatus;
  statusLabel: string;
  meta: string;
};

export type DemoStep2Content = {
  appShell: DemoAppShellContent;
  pageKicker: string;
  pageTitle: string;
  greeting: string;
  greetingSub: string;
  progressTitle: string;
  progressPercent: number;
  progressDetail: string;
  progressEta: string;
  tabs: string[];
  tasks: DemoStep2Task[];
  helpNote: string;
  helpButton: string;
};

/** Steps 3–6: shell + page heading only; the screen mockup is still a skeleton. */
export type DemoSkeletonStepContent = {
  appShell: DemoAppShellContent;
  pageTitle: string;
  pageSubtitle: string;
};

export type ThunderCareDemoContent = {
  topBar: DemoTopBarContent;
  mobileTabs: DemoMobileTabsContent;
  skeletonNote: string;
  stepper: DemoStepperContent;
  story: DemoStoryContent;
  steps: {
    step1: DemoStep1Content;
    step2: DemoStep2Content;
    step3: DemoSkeletonStepContent;
    step4: DemoSkeletonStepContent;
    step5: DemoSkeletonStepContent;
    step6: DemoSkeletonStepContent;
  };
};

export const TOTAL_DEMO_STEPS = 6;

export type DemoMobilePanel = "content" | "story";
