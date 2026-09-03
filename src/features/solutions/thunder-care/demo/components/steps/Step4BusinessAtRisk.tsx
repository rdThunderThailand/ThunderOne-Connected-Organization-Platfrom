// === Step 4 — "Business at Risk" (employee view). Skeleton for now: the
// "Report an issue" screen with the red at-risk banner + countdown, the
// report form, and the auto-gathered device/context still needs its mockup. ===

import type { LucideIcon } from "lucide-react";
import { Activity, BookOpen, Boxes, ClipboardList, Home, PackageCheck, TriangleAlert } from "lucide-react";
import { SkeletonStep } from "./SkeletonStep";
import type { DemoSkeletonStepContent } from "../../types";

const NAV_ICONS: LucideIcon[] = [Home, Boxes, ClipboardList, TriangleAlert, PackageCheck, Activity, BookOpen];

export function Step4BusinessAtRisk({ content, note }: { content: DemoSkeletonStepContent; note: string }) {
  return <SkeletonStep content={content} navIcons={NAV_ICONS} note={note} theme="light" />;
}
