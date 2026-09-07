// === Step 6 — "Business Uptime" (executive view, dark theme). Skeleton for
// now: the executive dashboard with readiness KPIs vs targets, the 30-day
// trend, top priorities and business-impact estimates still needs its mockup. ===

import type { LucideIcon } from "lucide-react";
import { BarChart3, Building2, Gauge, Headset, LayoutDashboard, Settings, ShieldAlert, Wallet } from "lucide-react";
import { SkeletonStep } from "./SkeletonStep";
import type { DemoSkeletonStepContent } from "../../types";

const NAV_ICONS: LucideIcon[] = [
  LayoutDashboard,
  Building2,
  Gauge,
  Headset,
  ShieldAlert,
  Wallet,
  BarChart3,
  Settings,
];

export function Step6BusinessUptime({ content, note }: { content: DemoSkeletonStepContent; note: string }) {
  return <SkeletonStep content={content} navIcons={NAV_ICONS} note={note} theme="dark" />;
}
