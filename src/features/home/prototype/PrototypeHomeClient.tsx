"use client";

// PROTOTYPE — throwaway, not production
// Mounted by src/app/[locale]/page.tsx only when ?variant=A|B|C is present.
// `variant` is resolved server-side and passed in as a prop, so this
// component never needs useSearchParams (and therefore no Suspense
// boundary) just to know which variant to render.

import { PrototypeSwitcher } from "./PrototypeSwitcher";
import { VariantA } from "./VariantA";
import { VariantB } from "./VariantB";
import { VariantC } from "./VariantC";
import type {
  CtaContent,
  HeroContent,
  IntegrationContent,
  PersonaContent,
  PerspectiveContent,
  ProblemContent,
  ShowcaseContent,
  SolutionsContent,
} from "../types";

type PrototypeHomeClientProps = {
  variant: string;
  hero: HeroContent;
  problem: ProblemContent;
  persona: PersonaContent;
  perspective: PerspectiveContent;
  solutions: SolutionsContent;
  showcase: ShowcaseContent;
  integration: IntegrationContent;
  cta: CtaContent;
};

const VARIANTS = [
  { key: "A", name: "Guided Narrative" },
  { key: "B", name: "Persona-First" },
  { key: "C", name: "Bento Grid" },
];

export function PrototypeHomeClient({ variant, ...content }: PrototypeHomeClientProps) {
  return (
    <>
      {variant === "B" ? (
        <VariantB {...content} />
      ) : variant === "C" ? (
        <VariantC {...content} />
      ) : (
        <VariantA {...content} />
      )}
      <PrototypeSwitcher current={variant} variants={VARIANTS} />
    </>
  );
}
