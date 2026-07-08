"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { TopBar } from "./TopBar";
import { cn } from "@/lib/utils";

interface PageShellProps {
  children: ReactNode;
  variant?: "default" | "bare" | "no-header" | "fullscreen";
  title?: string;
  topBarLeft?: ReactNode;
  topBarRight?: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
  showBack?: boolean;
  transparentTopBar?: boolean;
  transparentTop?: boolean;
  noBorder?: boolean;
  className?: string;
}

export function PageShell({
  children,
  variant = "default",
  title,
  topBarLeft,
  topBarRight,
  left,
  right,
  showBack,
  transparentTopBar,
  transparentTop,
  noBorder,
  className,
}: PageShellProps) {
  if (variant === "fullscreen") {
    return <div className="scan-overlay">{children}</div>;
  }

  return (
    <>
      {variant === "default" && (
        <TopBar
          title={title}
          left={topBarLeft ?? left}
          right={topBarRight ?? right}
          showBack={showBack}
          noBorder={noBorder}
          transparent={transparentTopBar ?? transparentTop}
        />
      )}
      <motion.main
        className={cn(
          "page px-page",
          variant === "no-header" && "pt-0",
          className
        )}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.main>
    </>
  );
}
