"use client";

// === Shared hero diagram: circle of colored icon nodes around a large
// centered ThunderOne logo mark, with dashed spokes to the center, dashed
// connectors between neighboring icons, and small dot accents. Hovering the
// center mark scales it up. Used by both the home page hero and the
// solutions page hero — nodes/caption are passed in as props so each page
// controls its own labels/colors/order.
//
// Entrance sequence (replays each time the diagram scrolls into view): icons
// sit static from first paint, then after a short beat the center mark pops
// in, then the icon-to-logo spokes and icon-to-icon connectors draw in
// together — spokes grow outward from the center, connectors grow outward
// from the midpoint between each pair of neighboring icons. ===

import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import thunderOneMark from "@/components/logo/TextBlack.svg";

const RADIUS_PERCENT = 40;
const REVEAL_DELAY_MS = 400;

// Math.cos/sin can differ in the last decimal place between the server's
// Node/V8 and the browser's V8, which fails React's exact-string hydration
// check on inline styles. Rounding collapses that last-bit drift so server
// and client always serialize the same string.
function round(value: number) {
  return Math.round(value * 10000) / 10000;
}

function polarPoint(angleDeg: number, radiusPercent: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: round(50 + radiusPercent * Math.cos(rad)),
    y: round(50 + radiusPercent * Math.sin(rad)),
  };
}

// Single-arc SVG path between two points that sit on the same circle, so the
// icon-to-icon connectors follow the ring's actual curve instead of a
// straight chord. sweep picks the short way around (clockwise vs.
// counter-clockwise) to match the direction "from" -> "to" travels.
function arcPath(
  from: { x: number; y: number },
  to: { x: number; y: number },
  radiusPercent: number,
  sweep: 0 | 1,
) {
  return `M ${from.x} ${from.y} A ${radiusPercent} ${radiusPercent} 0 0 ${sweep} ${to.x} ${to.y}`;
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
  const diagramId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [logoRevealed, setLogoRevealed] = useState(false);
  const [linesVisible, setLinesVisible] = useState(false);

  // Replays the pop-in -> draw-in sequence every time the diagram scrolls
  // back into view, not just on first mount.
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    let revealTimer: ReturnType<typeof setTimeout> | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          revealTimer = setTimeout(() => setLogoRevealed(true), REVEAL_DELAY_MS);
        } else {
          clearTimeout(revealTimer);
          setLogoRevealed(false);
          setLinesVisible(false);
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => {
      clearTimeout(revealTimer);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="mx-auto w-full max-w-md scale-120">
      <div className="relative aspect-square w-full">
        <div className="absolute inset-0">
          {nodes.map((node, i) => {
            const angle = angleStep * i - 90;
            const midAngle = angle - angleStep / 2;

            const iconPoint = polarPoint(angle, RADIUS_PERCENT);
            const prevIconPoint = polarPoint(angle - angleStep, RADIUS_PERCENT);
            const midPoint = polarPoint(midAngle, RADIUS_PERCENT);
            const innerDot = polarPoint(angle, RADIUS_PERCENT / 2);

            // Increasing angle sweeps clockwise in this diagram's coordinate
            // space, so the arc toward the current (later) icon sweeps
            // clockwise and the arc toward the previous icon sweeps back.
            const arcToCurrent = arcPath(midPoint, iconPoint, RADIUS_PERCENT, 1);
            const arcToPrevious = arcPath(midPoint, prevIconPoint, RADIUS_PERCENT, 0);
            const maskIdCurrent = `${diagramId}-arc-cur-${i}`;
            const maskIdPrevious = `${diagramId}-arc-prev-${i}`;

            return (
              <div key={`spoke-${node.key}`}>
                {/* icon-to-logo spoke: grows outward from the center, all together */}
                <div
                  className="absolute left-1/2 top-1/2 h-px origin-left border-t border-dashed border-slate-300 transition-[width,opacity] duration-700 ease-out"
                  style={{
                    width: linesVisible ? `${RADIUS_PERCENT}%` : "0%",
                    transform: `rotate(${round(angle)}deg)`,
                    opacity: linesVisible ? 1 : 0,
                  }}
                />
                <span
                  className="absolute h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/70 transition-opacity duration-500 ease-out"
                  style={{
                    left: `${innerDot.x}%`,
                    top: `${innerDot.y}%`,
                    opacity: linesVisible ? 1 : 0,
                  }}
                />

                {/* icon-to-icon connectors: curved along the icons' circle, drawn outward from the midpoint between this icon and the previous one */}
                <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 100 100">
                  <defs>
                    <mask id={maskIdCurrent}>
                      <path
                        d={arcToCurrent}
                        pathLength={1}
                        fill="none"
                        stroke="white"
                        strokeWidth={3}
                        style={{
                          strokeDasharray: 1,
                          strokeDashoffset: linesVisible ? 0 : 1,
                          transition: "stroke-dashoffset 700ms ease-out",
                        }}
                      />
                    </mask>
                    <mask id={maskIdPrevious}>
                      <path
                        d={arcToPrevious}
                        pathLength={1}
                        fill="none"
                        stroke="white"
                        strokeWidth={3}
                        style={{
                          strokeDasharray: 1,
                          strokeDashoffset: linesVisible ? 0 : 1,
                          transition: "stroke-dashoffset 700ms ease-out",
                        }}
                      />
                    </mask>
                  </defs>
                  <path
                    d={arcToCurrent}
                    fill="none"
                    strokeWidth={0.4}
                    strokeDasharray="2 1.5"
                    className="stroke-slate-300"
                    mask={`url(#${maskIdCurrent})`}
                  />
                  <path
                    d={arcToPrevious}
                    fill="none"
                    strokeWidth={0.4}
                    strokeDasharray="2 1.5"
                    className="stroke-slate-300"
                    mask={`url(#${maskIdPrevious})`}
                  />
                </svg>
                <span
                  className="absolute h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/70 transition-opacity duration-500 ease-out"
                  style={{
                    left: `${midPoint.x}%`,
                    top: `${midPoint.y}%`,
                    opacity: linesVisible ? 1 : 0,
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
                <div className="flex flex-col items-center gap-1.5">
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
          <div
            onAnimationEnd={() => setLinesVisible(true)}
            className={
              logoRevealed
                ? "animate-[pop-in_0.6s_cubic-bezier(0.34,1.56,0.64,1)_forwards]"
                : "scale-0 opacity-0"
            }
          >
            <Image src={thunderOneMark} alt="ThunderOne" className="h-auto w-24" />
          </div>
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
