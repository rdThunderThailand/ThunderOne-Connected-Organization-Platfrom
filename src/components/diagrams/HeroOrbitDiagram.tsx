"use client";

// === Shared hero diagram: circle of colored icon nodes around a large
// centered ThunderOne logo mark, with dotted spokes/ring, small fixed dot
// accents, and a caption badge below. Hovering the center mark scales it up
// and spins the orbit ring. Used by both the home page hero and the
// solutions page hero — nodes/caption are passed in as props so each page
// controls its own labels/colors/order. ===

import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";
import thunderOneMark from "@/components/logo/TextBlack.svg";

const RADIUS_PERCENT = 40;

// Math.cos/sin can differ in the last decimal place between the server's
// Node/V8 and the browser's V8, which fails React's exact-string hydration
// check on inline styles. Rounding collapses that last-bit drift so server
// and client always serialize the same string.
function round(value: number) {
  return Math.round(value * 10000) / 10000;
}

export type OrbitNode = {
  key: string;
  label: string;
  icon: LucideIcon;
  badgeClassName: string;
};

type HeroOrbitDiagramProps = {
  nodes: OrbitNode[];
  caption: { title: string; subtitle: string };
};

export function HeroOrbitDiagram({ nodes, caption }: HeroOrbitDiagramProps) {
  const angleStep = 360 / nodes.length;

  return (
    <div className="mx-auto w-full max-w-md scale-120">
      <div className="group relative aspect-square w-full">
        <div className="absolute inset-0 group-has-[.orbit-center:hover]:animate-[spin_6s_linear_infinite]">
          <div className="absolute inset-[10%] rounded-full border border-dashed border-slate-300" />

          {nodes.map((node, i) => {
            const angle = angleStep * i - 90;
            const rad = (angle * Math.PI) / 180;
            const midRad = ((angle - angleStep / 2) * Math.PI) / 180;

            return (
              <div key={`spoke-${node.key}`}>
                <div
                  className="absolute left-1/2 top-1/2 h-px origin-left border-t border-dashed border-slate-300"
                  style={{ width: `${RADIUS_PERCENT}%`, transform: `rotate(${round(angle)}deg)` }}
                />
                <span
                  className="absolute h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/70"
                  style={{
                    left: `${round(50 + (RADIUS_PERCENT / 2) * Math.cos(rad))}%`,
                    top: `${round(50 + (RADIUS_PERCENT / 2) * Math.sin(rad))}%`,
                  }}
                />
                <span
                  className="absolute h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/70"
                  style={{
                    left: `${round(50 + RADIUS_PERCENT * Math.cos(midRad))}%`,
                    top: `${round(50 + RADIUS_PERCENT * Math.sin(midRad))}%`,
                  }}
                />
              </div>
            );
          })}

          {nodes.map((node, i) => {
            const angle = angleStep * i - 90;
            const rad = (angle * Math.PI) / 180;
            const x = round(50 + RADIUS_PERCENT * Math.cos(rad));
            const y = round(50 + RADIUS_PERCENT * Math.sin(rad));
            const Icon = node.icon;

            return (
              <div
                key={node.key}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <div className="flex flex-col items-center gap-1.5 group-has-[.orbit-center:hover]:animate-[spin_6s_linear_infinite_reverse]">
                  <span
                    className={`flex h-14 w-14 items-center justify-center rounded-full text-white shadow-md ${node.badgeClassName}`}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="whitespace-nowrap text-xs font-semibold text-brand-navy">
                    {node.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="orbit-center absolute left-1/2 top-1/2 z-10 flex h-44 w-44 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-slate-100 bg-white shadow-lg transition-transform duration-300 hover:scale-110">
          <Image src={thunderOneMark} alt="ThunderOne" className="h-auto w-24" />
        </div>
      </div>

      <div className="-mt-4 rounded-2xl border border-slate-100 bg-white px-6 py-4 text-center shadow-md">
        <p className="flex items-center justify-center gap-2 text-sm font-bold text-brand-navy">
          <Sparkles className="h-4 w-4 text-brand-blue" />
          {caption.title}
        </p>
        <p className="mt-1 text-xs text-slate-500">{caption.subtitle}</p>
      </div>
    </div>
  );
}
