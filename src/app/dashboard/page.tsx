"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Flame, ChevronRight, ScanLine, Search, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/PageShell";
import { TiltCard } from "@/components/TiltCard";
import { HealthScoreRing } from "@/components/HealthScoreRing";
import { Pill } from "@/components/Pill";
import { SkeletonDashboard } from "@/components/Skeleton";

function ratingVariant(rating: string) {
  if (rating === "healthy") return "healthy" as const;
  if (rating === "moderate") return "warning" as const;
  return "harmful" as const;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const { data: dashboard, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard");
      if (!res.ok) throw new Error("Failed to load");
      return res.json();
    },
  });

  const name = session?.user?.name?.split(" ")[0] ?? "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  if (isLoading) {
    return (
      <PageShell title="HealthOX">
        <SkeletonDashboard />
      </PageShell>
    );
  }

  return (
    <PageShell title="HealthOX">
      <div className="stack">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <div>
            <p className="text-sand text-sm">{greeting},</p>
            <h2 className="text-h2 text-cream">{name}</h2>
          </div>
          <div className="row--sm">
            <Flame size={16} className="text-amber" />
            <span className="text-mono text-body font-semibold text-cream">{dashboard?.streak ?? 0}</span>
            <span className="text-xs text-sand">day streak</span>
          </div>
        </div>

        <TiltCard intensity={5} className="card--xl">
          <div className="row--lg">
            <HealthScoreRing score={dashboard?.overallScore ?? 7} size="xl" />
            <div className="flex-1">
              <p className="text-2xs text-sand">Overall health score</p>
              <p className="text-h2 text-cream mt-1">
                {dashboard?.overallScore >= 7 ? "Doing well" : dashboard?.overallScore >= 4 ? "Room to improve" : "Needs attention"}
              </p>
              <p className="text-xs text-sand mt-1">
                Based on your last 30 scans
              </p>
            </div>
          </div>
        </TiltCard>

        <div className="grid-2">
          <button onClick={() => router.push("/scan")} className="stat-card stat-card--clay row--sm">
            <ScanLine size={20} className="text-clay" />
            <span className="text-sm font-semibold text-cream">Scan product</span>
          </button>
          <button onClick={() => router.push("/search")} className="stat-card row--sm">
            <Search size={20} className="text-sand" />
            <span className="text-sm font-semibold text-cream">Search food</span>
          </button>
        </div>

        <div className="mt-section">
          <div className="section-header">
            <span className="section-header__title">Recent scans</span>
            <button className="section-header__action" onClick={() => router.push("/scan-history")}>See all</button>
          </div>
          <div className="stack--md">
            {dashboard?.recentScans?.length > 0 ? (
              dashboard.recentScans.map((item: Record<string, unknown>, i: number) => {
                const product = item.product as { name: string; brand: string } | undefined;
                const analysis = item.analysis as { health_score: number; health_rating: string } | undefined;
                return (
                  <motion.button
                    key={item.id as string ?? i}
                    onClick={() => router.push("/results")}
                    className="card card--sm product-card"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <HealthScoreRing score={analysis?.health_score ?? 5} size="sm" />
                    <div className="product-card__body">
                      <p className="product-card__name truncate">{product?.name ?? "Unknown product"}</p>
                      <p className="product-card__brand">{product?.brand ?? ""}</p>
                      <div className="product-card__tags">
                        <Pill variant={ratingVariant(analysis?.health_rating ?? "moderate")}>
                          {analysis?.health_rating ?? "moderate"}
                        </Pill>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-muted" />
                  </motion.button>
                );
              })
            ) : (
              <div className="empty-state">
                <p className="text-sm" style={{ fontWeight: 600, color: "var(--cream)" }}>No scans yet</p>
                <p className="text-xs text-sand mt-1">Scan your first product to get started</p>
                <button className="btn btn--primary btn--sm" style={{ marginTop: 12 }} onClick={() => router.push("/scan")}>
                  <ScanLine size={16} /> Scan Now
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="alert alert--info mt-section">
          <Heart size={16} />
          <span>Save products you scan often to your favorites for one-tap re-checks.</span>
        </div>
      </div>
    </PageShell>
  );
}
