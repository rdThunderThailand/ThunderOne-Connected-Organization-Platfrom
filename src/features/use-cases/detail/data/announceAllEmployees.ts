import type { UseCaseDetailData } from "../types";

// Structural data for the "Announce to All Employees" use case detail page.
// Translated text lives in messages/{th,en}/use-case-detail-announce-all-employees.json
// under the "UseCaseDetailAnnounceAllEmployeesPage" namespace — this file only
// holds icon keys, colors, and hrefs, zipped with translated content in page.tsx.
export const ANNOUNCE_ALL_EMPLOYEES_DATA: UseCaseDetailData = {
  slug: "announce-all-employees",
  namespace: "UseCaseDetailAnnounceAllEmployeesPage",
  mockup: {
    channelIcons: ["smartphone", "message-square", "mail", "monitor-play"],
  },
  inContext: {
    teamView: { statusColor: "green" },
    employeeView: { statusColor: "blue" },
  },
  benefits: [
    { icon: "megaphone" },
    { icon: "trending-up" },
    { icon: "layers" },
    { icon: "shield-check" },
    { icon: "bar-chart-3" },
  ],
  steps: [
    { icon: "pen-line", accent: "blue" },
    { icon: "users", accent: "emerald" },
    { icon: "megaphone", accent: "purple" },
    { icon: "shield-check", accent: "orange" },
    { icon: "send", accent: "blue" },
    { icon: "bar-chart-3", accent: "emerald" },
  ],
  stakeholders: [{ icon: "briefcase" }, { icon: "user-cog" }, { icon: "user-round" }, { icon: "users" }],
  connections: [
    { icon: "users", badgeClassName: "bg-blue-500" },
    { icon: "file-text", badgeClassName: "bg-emerald-500" },
    { icon: "message-square", badgeClassName: "bg-purple-500" },
    { icon: "workflow", badgeClassName: "bg-amber-500" },
    { icon: "bar-chart-3", badgeClassName: "bg-pink-500" },
  ],
  relatedUseCases: [
    { icon: "alert-triangle", href: "/use-cases/manage-emergency-alerts" },
    { icon: "calendar-days", href: "/use-cases/plan-run-campaigns" },
    { icon: "smartphone", href: "/use-cases/deliver-mobile-workforce-updates" },
    { icon: "monitor-play", href: "/use-cases/manage-digital-signage" },
  ],
};
