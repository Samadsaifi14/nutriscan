"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { scoreToRating, ratingColor } from "@/lib/utils";

type Size = "xs" | "sm" | "md" | "lg" | "xl";

const SIZES: Record<Size, number> = { xs: 32, sm: 44, md: 64, lg: 80, xl: 96 };
const FONT: Record<Size, string> = {
  xs: "text-[10px]",
  sm: "text-xs",
  md: "text-body",
  lg: "text-h3",
  xl: "text-h1",
};

interface HealthScoreRingProps {
  score: number;
  size?: Size;
  showLabel?: boolean;
  className?: string;
}

export function HealthScoreRing({ score, size = "md", showLabel = true, className }: HealthScoreRingProps) {
  const diameter = SIZES[size];
  const stroke = Math.max(3, diameter * 0.09);
  const radius = (diameter - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(Math.max(score / 10, 0), 1);
  const rating = scoreToRating(score);
  const color = ratingColor(rating);

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: diameter, height: diameter }}
      role="img"
      aria-label={`Health score ${score} out of 10, ${rating}`}
    >
      <svg width={diameter} height={diameter} className="-rotate-90">
        <circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          fill="none"
          stroke="var(--surface-3)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - pct) }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        />
      </svg>
      {showLabel && (
        <span className={cn("absolute font-bold text-mono", FONT[size])} style={{ color }}>
          {score}
        </span>
      )}
    </div>
  );
}
