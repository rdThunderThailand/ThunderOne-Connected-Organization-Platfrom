import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { UseCasesClient } from "@/features/use-cases/UseCasesClient";
import { USE_CASES } from "@/features/use-cases/data/useCases";
import { TAG_COLOR } from "@/features/use-cases/data/tags";
import { FILTER_GROUPS, CATEGORY_SUMMARIES } from "@/features/use-cases/data/filters";
import type {
  CardCopy,
  CategorySummaryContent,
  FilterCopy,
  FilterGroupContent,
  HelpCtaContent,
  HeroContent,
  NoResultsCopy,
  PaginationCopy,
  SortOption,
  ToolbarContent,
  UseCaseContent,
} from "@/features/use-cases/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "UseCasesPage" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function UseCasesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("UseCasesPage");

  const itemText = t.raw("items") as Record<string, { title: string; description: string }>;
  const tagText = t.raw("tags") as Record<string, string>;
  const filterOptionText = t.raw("filter.groups") as Record<string, { title: string; options: Record<string, string> }>;
  const categoryText = t.raw("categories") as Record<
    string,
    { title: string; subtitle: string; countLabel: string; viewAllLabel: string }
  >;

  const useCases: UseCaseContent[] = USE_CASES.map((useCase) => ({
    id: useCase.id,
    icon: useCase.icon,
    color: useCase.color,
    title: itemText[useCase.id].title,
    description: itemText[useCase.id].description,
    tags: useCase.tagIds.map((tagId) => ({
      id: tagId,
      label: tagText[tagId],
      color: TAG_COLOR[tagId],
    })),
    featured: useCase.featured ?? false,
    roleIds: useCase.roleIds,
    needIds: useCase.needIds,
    industryIds: useCase.industryIds,
    href: useCase.href,
  }));

  const filterGroups: FilterGroupContent[] = FILTER_GROUPS.map((group) => ({
    key: group.key,
    title: filterOptionText[group.key].title,
    visibleCount: group.visibleCount,
    options: group.options.map((option) => ({
      id: option.id,
      label: filterOptionText[group.key].options[option.id],
    })),
  }));

  const categorySummaries: CategorySummaryContent[] = CATEGORY_SUMMARIES.map((summary) => ({
    key: summary.key,
    icon: summary.icon,
    color: summary.color,
    avatarIcons: summary.avatarIcons,
    href: summary.href,
    title: categoryText[summary.key].title,
    subtitle: categoryText[summary.key].subtitle,
    countLabel: categoryText[summary.key].countLabel,
    viewAllLabel: categoryText[summary.key].viewAllLabel,
  }));

  const hero: HeroContent = {
    titleLine1: t("hero.titleLine1"),
    titleHighlight: t("hero.titleHighlight"),
    description: t("hero.description"),
    searchPlaceholder: t("hero.searchPlaceholder"),
    filterButtonLabel: t("hero.filterButtonLabel"),
  };

  const filterCopy: FilterCopy = {
    title: t("filter.title"),
    clearAll: t("filter.clearAll"),
    more: t("filter.more"),
    less: t("filter.less"),
    reset: t("filter.reset"),
  };

  const sortOptions = t.raw("toolbar.sortOptions") as Record<SortOption, string>;
  const toolbar: ToolbarContent = {
    showingTemplate: t("toolbar.showingTemplate"),
    sortByLabel: t("toolbar.sortByLabel"),
    sortOptions,
    viewGridLabel: t("toolbar.viewGridLabel"),
    viewListLabel: t("toolbar.viewListLabel"),
  };

  const cardCopy: CardCopy = {
    featured: t("card.featured"),
    seeDetails: t("card.seeDetails"),
  };

  const noResults: NoResultsCopy = {
    title: t("noResults.title"),
    description: t("noResults.description"),
  };

  const pagination: PaginationCopy = {
    previous: t("pagination.previous"),
    next: t("pagination.next"),
  };

  const helpCta: HelpCtaContent = {
    title: t("helpCta.title"),
    description: t("helpCta.description"),
    button: t("helpCta.button"),
  };

  return (
    <UseCasesClient
      locale={locale}
      breadcrumb={[{ label: t("breadcrumb.home"), href: "/" }, { label: t("breadcrumb.current") }]}
      hero={hero}
      categorySummaries={categorySummaries}
      filterGroups={filterGroups}
      toolbar={toolbar}
      cardCopy={cardCopy}
      filterCopy={filterCopy}
      noResults={noResults}
      pagination={pagination}
      helpCta={helpCta}
      useCases={useCases}
    />
  );
}
