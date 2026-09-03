// === Step 5 — "Thunder Care" (employee view). Skeleton for now: the
// "Status & tracking" screen with the care timeline, case details, assigned
// team and contact options still needs its mockup. ===

import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BookOpen,
  Boxes,
  ClipboardList,
  Home,
  MessageSquare,
  PackageCheck,
  TriangleAlert,
} from "lucide-react";
import { SkeletonStep } from "./SkeletonStep";
import type { DemoSkeletonStepContent } from "../../types";

const NAV_ICONS: LucideIcon[] = [
  Home,
  Boxes,
  ClipboardList,
  PackageCheck,
  TriangleAlert,
  Activity,
  BookOpen,
  MessageSquare,
];

export function Step5ThunderCare({ content, note }: { content: DemoSkeletonStepContent; note: string }) {
  return <SkeletonStep content={content} navIcons={NAV_ICONS} note={note} theme="light" />;
}
