"use client";

// === Product Tour overlay: interactive 6-step wizard shown on top of the
// Asset Intelligence solution page when "See it in action" is clicked.
// Renders below the site's existing sticky Navbar (does not touch it) and
// owns all tour state — current step, completed steps, the mock Step 3
// report-issue form, and which panel is active on mobile. No props here
// call useTranslations: everything comes in pre-translated via `content`,
// fetched server-side by page.tsx. ===

import { useEffect, useState } from "react";
import { TourTopBar } from "./components/TourTopBar";
import { TourSidebar } from "./components/TourSidebar";
import { TourStepHeader } from "./components/TourStepHeader";
import { TourSummaryPanel } from "./components/TourSummaryPanel";
import { TourBottomBar } from "./components/TourBottomBar";
import { MobileTabSwitcher } from "./components/MobileTabSwitcher";
import { Step1ScanQrCode } from "./components/steps/Step1ScanQrCode";
import { Step2ViewAssetInfo } from "./components/steps/Step2ViewAssetInfo";
import { Step3ReportIssue, type Step3FormState } from "./components/steps/Step3ReportIssue";
import { Step4AssignWork } from "./components/steps/Step4AssignWork";
import { Step5ExecuteAndClose } from "./components/steps/Step5ExecuteAndClose";
import { Step6HistoryAndReports } from "./components/steps/Step6HistoryAndReports";
import { TOTAL_TOUR_STEPS, type MobilePanel, type ProductTourContent } from "./types";

type ProductTourClientProps = {
  content: ProductTourContent;
  onClose: () => void;
};

export function ProductTourClient({ content, onClose }: ProductTourClientProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>("content");
  const [step3Form, setStep3Form] = useState<Step3FormState>({
    issueType: content.steps.step3.form.issueTypePlaceholder,
    urgency: content.steps.step3.form.urgencyHigh,
    details: content.steps.step3.form.detailsPlaceholder,
    photoCount: 3,
    submitted: false,
  });

  // Lock the page behind the overlay from scrolling while the tour is open.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  function markCurrentStepCompleted() {
    setCompletedSteps((previous) => (previous.includes(currentStep) ? previous : [...previous, currentStep]));
  }

  function handleNext() {
    markCurrentStepCompleted();
    if (currentStep >= TOTAL_TOUR_STEPS) {
      onClose();
      return;
    }
    setCurrentStep((step) => step + 1);
    setMobilePanel("content");
  }

  function handleBack() {
    setCurrentStep((step) => Math.max(step - 1, 1));
    setMobilePanel("content");
  }

  function handleSelectStep(step: number) {
    setCurrentStep(step);
    setMobilePanel("content");
  }

  function renderStepBody() {
    switch (currentStep) {
      case 1:
        return <Step1ScanQrCode content={content.steps.step1} />;
      case 2:
        return <Step2ViewAssetInfo content={content.steps.step2} asset={content.asset} />;
      case 3:
        return (
          <Step3ReportIssue
            content={content.steps.step3}
            asset={content.asset}
            formState={step3Form}
            onIssueTypeChange={(value) => setStep3Form((prev) => ({ ...prev, issueType: value }))}
            onUrgencyChange={(value) => setStep3Form((prev) => ({ ...prev, urgency: value }))}
            onDetailsChange={(value) => setStep3Form((prev) => ({ ...prev, details: value }))}
            onAddPhoto={() => setStep3Form((prev) => ({ ...prev, photoCount: prev.photoCount + 1 }))}
            onSubmit={() => setStep3Form((prev) => ({ ...prev, submitted: true }))}
            onCancel={() =>
              setStep3Form({
                issueType: content.steps.step3.form.issueTypePlaceholder,
                urgency: content.steps.step3.form.urgencyHigh,
                details: content.steps.step3.form.detailsPlaceholder,
                photoCount: 3,
                submitted: false,
              })
            }
          />
        );
      case 4:
        return <Step4AssignWork content={content.steps.step4} />;
      case 5:
        return <Step5ExecuteAndClose content={content.steps.step5} />;
      case 6:
        return <Step6HistoryAndReports content={content.steps.step6} />;
      default:
        return null;
    }
  }

  return (
    // Full-viewport dim scrim; the tour panel itself is capped at max-w-7xl
    // and centered, so on wide screens the scrim shows in the side gutters.
    <div className="fixed inset-0 z-40">
      <div className="fixed inset-x-0 top-20 bottom-0 mx-auto flex max-w-7xl flex-col bg-white">
        <TourTopBar endTourLabel={content.endTour} onClose={onClose} />

        <MobileTabSwitcher content={content.mobileTabs} activePanel={mobilePanel} onChange={setMobilePanel} />

        <div className="grid flex-1 min-h-0 overflow-hidden lg:grid-cols-[280px_1fr_320px]">
          <div
            className={`${mobilePanel === "steps" ? "block" : "hidden"} overflow-y-auto border-slate-100 lg:block lg:border-r`}
          >
            <TourSidebar
              content={content.sidebar}
              currentStep={currentStep}
              completedSteps={completedSteps}
              onSelectStep={handleSelectStep}
            />
          </div>

          <div className={`${mobilePanel === "content" ? "flex" : "hidden"} min-h-0 min-w-0 flex-col lg:flex`}>
            <div className="min-h-0 flex-1 p-6 overflow-y-auto">
              <TourStepHeader content={content.stepHeader} currentStep={currentStep} />
              <div className="mt-6">{renderStepBody()}</div>
            </div>
            <TourBottomBar
              content={content.bottomBar}
              currentStep={currentStep}
              onBack={handleBack}
              onNext={handleNext}
            />
          </div>

          <div
            className={`${mobilePanel === "summary" ? "block" : "hidden"} overflow-y-auto border-slate-100 bg-white lg:block lg:border-l`}
          >
            <TourSummaryPanel content={content.summaryPanel} asset={content.asset} />
          </div>
        </div>
      </div>
    </div>
  );
}
