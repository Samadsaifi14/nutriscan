"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, Search, Clock, User } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "home", label: "Home", icon: Home, href: "/dashboard", match: ["/dashboard", "/insights", "/leaderboard"] },
  { key: "search", label: "Search", icon: Search, href: "/search", match: ["/search"] },
  { key: "scan", label: "Scan", icon: null, href: "/scan", match: ["/scan"] },
  { key: "history", label: "History", icon: Clock, href: "/scan-history", match: ["/scan-history", "/history", "/favorites"] },
  { key: "profile", label: "Profile", icon: User, href: "/profile", match: ["/profile", "/profile-setup", "/settings"] },
];

const HIDDEN_PREFIXES = ["/auth", "/signin", "/legal"];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/" || HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) {
    return null;
  }

  const activeKey = TABS.find((t) => t.match.some((m) => pathname.startsWith(m)))?.key ?? "home";

  return (
    <nav className="bottom-nav" aria-label="Primary">
      {TABS.map((tab) => {
        const isActive = tab.key === activeKey;
        const Icon = tab.icon;

        if (tab.key === "scan") {
          return <div key="scan-spacer" className="bottom-nav__slot" aria-hidden="true" />;
        }

        return (
          <button
            key={tab.key}
            onClick={() => router.push(tab.href)}
            className={cn("bottom-nav__slot relative", isActive && "bottom-nav__slot--active")}
            aria-current={isActive ? "page" : undefined}
          >
            {isActive && (
              <motion.span
                layoutId="nav-indicator"
                className="bottom-nav__indicator"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            {Icon && <Icon className="bottom-nav__icon" strokeWidth={isActive ? 2.4 : 2} />}
            <span className="bottom-nav__label">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
