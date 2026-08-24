"use client";

import { useEffect, useMemo, useState } from "react";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/Breadcrumb";
import { HeroHeader } from "./components/HeroHeader";
import { CategorySummaryCards } from "./components/CategorySummaryCards";
import { FilterSidebar } from "./components/FilterSidebar";
import { ResultsToolbar } from "./components/ResultsToolbar";
import { UseCaseGrid } from "./components/UseCaseGrid";
import { HelpCta } from "./components/HelpCta";
import type {
  CardCopy,
  CategorySummaryContent,
  FilterCopy,
  FilterGroupContent,
  FilterGroupKey,
  HelpCtaContent,
  HeroContent,
  NoResultsCopy,
  SortOption,
  ToolbarContent,
  UseCaseContent,
} from "./types";

type SelectedFilters = Record<FilterGroupKey, string[]>;

const EMPTY_FILTERS: SelectedFilters = { role: [], need: [], industry: [] };

type UseCasesClientProps = {
  locale: string;
  breadcrumb: BreadcrumbItem[];
  hero: HeroContent;
  categorySummaries: CategorySummaryContent[];
  filterGroups: FilterGroupContent[];
  toolbar: ToolbarContent;
  cardCopy: CardCopy;
  filterCopy: FilterCopy;
  noResults: NoResultsCopy;
  helpCta: HelpCtaContent;
  useCases: UseCaseContent[];
};

export function UseCasesClient({
  locale,
  breadcrumb,
  hero,
  categorySummaries,
  filterGroups,
  toolbar,
  cardCopy,
  filterCopy,
  noResults,
  helpCta,
  useCases,
}: UseCasesClientProps) {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>(EMPTY_FILTERS);
  const [sortOption, setSortOption] = useState<SortOption>("relevant");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(searchInput.trim().toLowerCase()), 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const toggleFilterOption = (group: FilterGroupKey, optionId: string) => {
    setSelectedFilters((previous) => {
      const current = previous[group];
      const next = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      return { ...previous, [group]: next };
    });
  };

  const clearAllFilters = () => setSelectedFilters(EMPTY_FILTERS);

  const filteredUseCases = useMemo(() => {
    return useCases.filter((useCase) => {
      const matchesSearch =
        debouncedQuery.length === 0 ||
        useCase.title.toLowerCase().includes(debouncedQuery) ||
        useCase.description.toLowerCase().includes(debouncedQuery);

      const matchesRole =
        selectedFilters.role.length === 0 ||
        useCase.roleIds.some((id) => selectedFilters.role.includes(id));

      const matchesNeed =
        selectedFilters.need.length === 0 ||
        useCase.needIds.some((id) => selectedFilters.need.includes(id));

      const matchesIndustry =
        selectedFilters.industry.length === 0 ||
        useCase.industryIds.some((id) => selectedFilters.industry.includes(id));

      return matchesSearch && matchesRole && matchesNeed && matchesIndustry;
    });
  }, [useCases, debouncedQuery, selectedFilters]);

  const sortedUseCases = useMemo(() => {
    const items = [...filteredUseCases];
    if (sortOption === "az") {
      return items.sort((a, b) => a.title.localeCompare(b.title, locale));
    }
    if (sortOption === "featured") {
      return items.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return items;
  }, [filteredUseCases, sortOption, locale]);

  const showingText = toolbar.showingTemplate
    .replace("%count%", String(sortedUseCases.length))
    .replace("%total%", String(useCases.length));

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumb} />
      </div>

      <HeroHeader
        content={hero}
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        onToggleMobileFilters={() => setIsMobileFilterOpen((open) => !open)}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <CategorySummaryCards items={categorySummaries} />

        <div className="mt-10 grid gap-8 pb-20 lg:grid-cols-[280px_minmax(0,1fr)]">
          <FilterSidebar
            groups={filterGroups}
            selected={selectedFilters}
            onToggleOption={toggleFilterOption}
            onClearAll={clearAllFilters}
            onReset={clearAllFilters}
            copy={filterCopy}
            isMobileOpen={isMobileFilterOpen}
            onCloseMobile={() => setIsMobileFilterOpen(false)}
          />

          <div className="min-w-0">
            <ResultsToolbar
              showingText={showingText}
              toolbar={toolbar}
              sortOption={sortOption}
              onSortChange={setSortOption}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />

            <UseCaseGrid
              items={sortedUseCases}
              viewMode={viewMode}
              cardCopy={cardCopy}
              noResults={noResults}
            />
          </div>
        </div>

        <div className="pb-20">
          <HelpCta content={helpCta} />
        </div>
      </div>
    </div>
  );
}
