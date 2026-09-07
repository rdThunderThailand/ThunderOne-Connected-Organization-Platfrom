// === Step 3 — "Ready for Day One" (new-employee view). Skeleton for now:
// the "My assets" screen with issued devices, granted access and a first-day
// checklist still needs its mockup. ===

import type { LucideIcon } from "lucide-react";
import { BookOpen, Boxes, Building2, ClipboardList, Home, PackageCheck, TriangleAlert } from "lucide-react";
import { SkeletonStep } from "./SkeletonStep";
import type { DemoSkeletonStepContent } from "../../types";

const NAV_ICONS: LucideIcon[] = [Home, Boxes, ClipboardList, PackageCheck, Building2, TriangleAlert, BookOpen];

export function Step3ReadyDayOne({ content, note }: { content: DemoSkeletonStepContent; note: string }) {
  return <SkeletonStep content={content} navIcons={NAV_ICONS} note={note} theme="light" />;
}
