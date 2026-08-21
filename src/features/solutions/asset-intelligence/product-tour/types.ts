export type TourAssetInfoRow = {
  label: string;
  value: string;
};

export type TourAssetContent = {
  id: string;
  name: string;
  statusActive: string;
  location: TourAssetInfoRow;
  category: TourAssetInfoRow;
  assetId: TourAssetInfoRow;
  age: TourAssetInfoRow;
  value: TourAssetInfoRow;
};

export type TourSidebarStepContent = {
  title: string;
  description: string;
};

export type TourRealDataPromptContent = {
  title: string;
  description: string;
  ctaButton: string;
};

export type TourSidebarContent = {
  title: string;
  subtitle: string;
  progressLabel: string;
  stepOfLabel: string;
  steps: TourSidebarStepContent[];
  realDataPrompt: TourRealDataPromptContent;
};

export type TourStepHeaderContent = {
  scenarioBadge: string;
  scenarioQuote: string;
  stepOfLabel: string;
  titles: string[];
  descriptions: string[];
};

export type TourStep3PhoneContent = {
  headerTitle: string;
  reportButton: string;
};

export type TourStep3FormContent = {
  title: string;
  issueTypeLabel: string;
  issueTypePlaceholder: string;
  urgencyLabel: string;
  urgencyHigh: string;
  detailsLabel: string;
  detailsPlaceholder: string;
  photosLabel: string;
  addPhotoButton: string;
  infoNote: string;
  successTitle: string;
  successDescription: string;
  successLink: string;
  cancelButton: string;
  submitButton: string;
};

export type TourStep3Content = {
  phone: TourStep3PhoneContent;
  form: TourStep3FormContent;
};

export type TourPlaceholderStepContent = {
  phoneTitle: string;
  phoneDescription: string;
  cardTitle: string;
  cardDescription: string;
  fields: TourAssetInfoRow[];
  actionButton: string;
};

export type TourSummaryPanelContent = {
  title: string;
  whatYouWillSeeTitle: string;
  items: string[];
};

export type TourBottomBarContent = {
  tip: string;
  backButton: string;
  nextButton: string;
  finishButton: string;
};

export type TourMobileTabsContent = {
  stepsTab: string;
  contentTab: string;
  summaryTab: string;
};

export type ProductTourContent = {
  endTour: string;
  asset: TourAssetContent;
  sidebar: TourSidebarContent;
  stepHeader: TourStepHeaderContent;
  steps: {
    step1: TourPlaceholderStepContent;
    step2: TourPlaceholderStepContent;
    step3: TourStep3Content;
    step4: TourPlaceholderStepContent;
    step5: TourPlaceholderStepContent;
    step6: TourPlaceholderStepContent;
  };
  summaryPanel: TourSummaryPanelContent;
  bottomBar: TourBottomBarContent;
  mobileTabs: TourMobileTabsContent;
};

export const TOTAL_TOUR_STEPS = 6;

export type MobilePanel = "steps" | "content" | "summary";

/** Replaces the "{current}"/"{total}" tokens in a translated template string, e.g. "Step {current} of {total}". */
export function formatStepOfLabel(template: string, current: number, total: number): string {
  return template.replace("{current}", String(current)).replace("{total}", String(total));
}
