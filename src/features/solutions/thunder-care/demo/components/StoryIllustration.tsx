// === StoryIllustration: lightweight per-step illustration for the Golden
// Story panel — a large tinted icon "hero" with a few small floating icons
// around it. Placeholder art built from line icons.
// TODO: replace with real illustrations once design assets are available. ===

import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  BarChart3,
  Building2,
  CheckCircle2,
  FileText,
  Gift,
  Headset,
  Laptop,
  MessageSquare,
  PartyPopper,
  Shield,
  ShieldCheck,
  TrendingUp,
  Truck,
  UserPlus,
  Users,
  WifiOff,
} from "lucide-react";

type IllustrationSpec = {
  hero: LucideIcon;
  satellites: LucideIcon[];
};

const SPECS: Record<number, IllustrationSpec> = {
  1: { hero: UserPlus, satellites: [Shield, Gift, Laptop] },
  2: { hero: Laptop, satellites: [FileText, ShieldCheck, Users] },
  3: { hero: PartyPopper, satellites: [Laptop, Building2, Users] },
  4: { hero: WifiOff, satellites: [AlertTriangle, BarChart3, CheckCircle2] },
  5: { hero: Headset, satellites: [Truck, MessageSquare, ShieldCheck] },
  6: { hero: Building2, satellites: [Users, Laptop, TrendingUp] },
};

const SATELLITE_POSITIONS = ["left-2 top-3", "right-3 top-6", "bottom-3 right-8"];

type StoryIllustrationProps = {
  step: number;
};

export function StoryIllustration({ step }: StoryIllustrationProps) {
  const spec = SPECS[step] ?? SPECS[1];
  const Hero = spec.hero;

  return (
    <div
      role="img"
      aria-hidden="true"
      className="relative mx-auto flex h-32 w-full max-w-60 items-center justify-center rounded-2xl bg-linear-to-br from-blue-50 to-indigo-50"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-brand-blue shadow-sm">
        <Hero className="h-8 w-8" />
      </span>
      {spec.satellites.map((Icon, index) => (
        <span
          key={index}
          className={`absolute ${SATELLITE_POSITIONS[index]} flex h-8 w-8 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm`}
        >
          <Icon className="h-4 w-4" />
        </span>
      ))}
    </div>
  );
}
