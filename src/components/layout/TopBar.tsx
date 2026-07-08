"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TopBarProps {
  title?: string;
  left?: ReactNode;
  right?: ReactNode;
  showBack?: boolean;
  noBorder?: boolean;
  transparent?: boolean;
}

export function TopBar({
  title,
  left,
  right,
  showBack,
  noBorder,
  transparent,
}: TopBarProps) {
  const router = useRouter();

  return (
    <header
      className={cn(
        "topbar px-page",
        transparent ? "topbar--transparent glass" : undefined,
        noBorder && "border-b-0"
      )}
    >
      <div className="row" style={{ height: "var(--topbar-h)", justifyContent: "space-between" }}>
        <div className="topbar__left">
          {showBack ? (
            <button
              aria-label="Go back"
              onClick={() => router.back()}
              className="icon-btn -ml-2"
            >
              <ArrowLeft size={20} />
            </button>
          ) : (
            left
          )}
        </div>

        {title && <h1 className="topbar__title truncate">{title}</h1>}

        <div className="topbar__right">{right}</div>
      </div>
    </header>
  );
}
