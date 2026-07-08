"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "active" | "healthy" | "warning" | "harmful";

interface PillProps {
  children: ReactNode;
  variant?: Variant;
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
}

const VARIANT_CLASS: Record<Variant, string> = {
  default: "chip",
  active: "chip chip--active",
  healthy: "chip chip--healthy",
  warning: "chip chip--warning",
  harmful: "chip chip--harmful",
};

export function Pill({ children, variant = "default", icon, onClick, className }: PillProps) {
  const Tag = onClick ? "button" : "span";
  return (
    <Tag onClick={onClick} className={cn(VARIANT_CLASS[variant], className)}>
      {icon}
      {children}
    </Tag>
  );
}
