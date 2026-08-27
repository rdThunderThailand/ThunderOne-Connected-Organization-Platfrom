import type { BreadcrumbItem } from "@/components/ui/Breadcrumb";

export type IconColor = "blue" | "green" | "purple" | "orange" | "pink" | "teal" | "red";

export type FilterGroupKey = "role" | "need" | "industry";

// Icon fields are keys into `iconRegistry.ts`, not component references —
// LucideIcon components are functions and can't cross the server -> client
// props boundary (page.tsx is a Server Component, UseCasesClient is not).

// --- Structural (non-translated) data shapes, defined in data/*.ts ---

export type UseCaseDefinition = {
  id: string;
  icon: string;
  color: IconColor;
  tagIds: string[];
  featured?: boolean;
  roleIds: string[];
  needIds: string[];
  industryIds: string[];
  href: string;
};

export type FilterOptionDefinition = {
  id: string;
};

export type FilterGroupDefinition = {
  key: FilterGroupKey;
  visibleCount: number;
  options: FilterOptionDefinition[];
};

export type CategorySummaryDefinition = {
  key: FilterGroupKey;
  icon: string;
  color: IconColor;
  avatarIcons: string[];
  href: string;
};

// --- Fully-resolved (translated) shapes passed from page.tsx to the client ---

export type UseCaseTag = {
  id: string;
  label: string;
  color: IconColor;
};

export type UseCaseContent = {
  id: string;
  icon: string;
  color: IconColor;
  title: string;
  description: string;
  tags: UseCaseTag[];
  featured: boolean;
  roleIds: string[];
  needIds: string[];
  industryIds: string[];
  href: string;
};

export type FilterOptionContent = {
  id: string;
  label: string;
};

export type FilterGroupContent = {
  key: FilterGroupKey;
  title: string;
  options: FilterOptionContent[];
  visibleCount: number;
};

export type CategorySummaryContent = {
  key: FilterGroupKey;
  icon: string;
  color: IconColor;
  title: string;
  subtitle: string;
  avatarIcons: string[];
  countLabel: string;
  viewAllLabel: string;
  href: string;
};

export type HeroContent = {
  titleLine1: string;
  titleHighlight: string;
  description: string;
  searchPlaceholder: string;
  filterButtonLabel: string;
};

export type SortOption = "relevant" | "featured" | "az";

export type ToolbarContent = {
  showingTemplate: string;
  sortByLabel: string;
  sortOptions: Record<SortOption, string>;
  viewGridLabel: string;
  viewListLabel: string;
};

export type FilterCopy = {
  title: string;
  clearAll: string;
  more: string;
  less: string;
  reset: string;
};

export type CardCopy = {
  featured: string;
  seeDetails: string;
};

export type NoResultsCopy = {
  title: string;
  description: string;
};

export type PaginationCopy = {
  previous: string;
  next: string;
};

export type HelpCtaContent = {
  title: string;
  description: string;
  button: string;
};

export type { BreadcrumbItem };
