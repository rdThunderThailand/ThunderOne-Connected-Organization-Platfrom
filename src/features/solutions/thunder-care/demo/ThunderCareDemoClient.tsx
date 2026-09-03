"use client";

// === Thunder Care "See it in action" demo: a full-screen interactive
// walkthrough (Golden Story Demo) opened from the solution page's hero.
// Covers the whole viewport including the site navbar. Owns all demo state —
// current step, which steps are completed, and the mobile panel toggle.
// Every string arrives pre-translated via `content` from page.tsx. ===

import { useCallback, useEffect, useState } from "react";
import { DemoTopBar } from "./components/DemoTopBar";
import { DemoMobileTabs } from "./components/DemoMobileTabs";
import { DemoStorySidebar } from "./components/DemoStorySidebar";
import { DemoStepper } from "./components/DemoStepper";
import { Step1NewEmployee } from "./components/steps/Step1NewEmployee";
import { Step2SelfOnboard } from "./components/steps/Step2SelfOnboard";
import { Step3ReadyDayOne } from "./components/steps/Step3ReadyDayOne";
import { Step4BusinessAtRisk } from "./components/steps/Step4BusinessAtRisk";
import { Step5ThunderCare } from "./components/steps/Step5ThunderCare";
import { Step6BusinessUptime } from "./components/steps/Step6BusinessUptime";
import { TOTAL_DEMO_STEPS, type DemoMobilePanel, type ThunderCareDemoContent } from "./types";

type ThunderCareDemoClientProps = {
  content: ThunderCareDemoContent;
  onClose: () => void;
};

export function ThunderCareDemoClient({ content, onClose }: ThunderCareDemoClientProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [mobilePanel, setMobilePanel] = useState<DemoMobilePanel>("content");

  // Lock the underlying page from scrolling while the demo is open.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  // Esc closes the demo.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(Math.min(Math.max(step, 1), TOTAL_DEMO_STEPS));
    setMobilePanel("content");
  }, []);

  function handleNext() {
    setCompletedSteps((previous) =>
      previous.includes(currentStep) ? previous : [...previous, currentStep],
    );
    if (currentStep >= TOTAL_DEMO_STEPS) {
      onClose();
      return;
    }
    goToStep(currentStep + 1);
  }

  function handleBack() {
    goToStep(currentStep - 1);
  }

  function renderStep() {
    switch (currentStep) {
      case 1:
        return <Step1NewEmployee content={content.steps.step1} />;
      case 2:
        return <Step2SelfOnboard content={content.steps.step2} />;
      case 3:
        return <Step3ReadyDayOne content={content.steps.step3} note={content.skeletonNote} />;
      case 4:
        return <Step4BusinessAtRisk content={content.steps.step4} note={content.skeletonNote} />;
      case 5:
        return <Step5ThunderCare content={content.steps.step5} note={content.skeletonNote} />;
      case 6:
        return <Step6BusinessUptime content={content.steps.step6} note={content.skeletonNote} />;
      default:
        return null;
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-brand-navy">
      <DemoTopBar content={content.topBar} onClose={onClose} />
      <DemoMobileTabs content={content.mobileTabs} activePanel={mobilePanel} onChange={setMobilePanel} />

      <div className="min-h-0 flex-1 overflow-hidden p-3 sm:p-4 lg:p-5">
        <div className="grid h-full min-h-0 grid-cols-1 grid-rows-1 gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div
            className={`${mobilePanel === "content" ? "block" : "hidden"} h-full min-h-0 min-w-0 lg:block`}
          >
            {renderStep()}
          </div>
          <div
            className={`${mobilePanel === "story" ? "block" : "hidden"} h-full min-h-0 min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white lg:block`}
          >
            <DemoStorySidebar content={content.story} currentStep={currentStep} />
          </div>
        </div>
      </div>

      <DemoStepper
        content={content.stepper}
        currentStep={currentStep}
        completedSteps={completedSteps}
        onSelectStep={goToStep}
        onBack={handleBack}
        onNext={handleNext}
      />
    </div>
  );
}
