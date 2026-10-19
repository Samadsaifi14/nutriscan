"use client";

import { useRouter } from "next/navigation";
import { Flame, ChevronRight, ScanLine, Search, Heart, Activity, Trophy, Plus } from "lucide-react";
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
  const router = useRouter();

  const { data: dashboard, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard");
      if (!res.ok) throw new Error("Failed to load");
      return res.json();
    },
  });

  const name = "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  if (isLoading) {
    return (
      <PageShell title="NutriScan">
        <SkeletonDashboard />
      </PageShell>
    );
  }

  const hasScans = dashboard?.recentScans && dashboard.recentScans.length > 0;

  return (
    <PageShell title="NutriScan">
      <div className="stack">
        <div className="relative min-h-[400px] overflow-hidden bg-black/50">
          {hasScans && (
            <Option1ImmersiveLanding
              splineUrl="https://cdn.spline.build/scene/health-journey/scores-trend.splinescenefile"
            />
          )}
          {hasScans || !hasScans && (
            <div className="relative z-10 max-w-4xl mx-auto px-4 py-20 text-white">

        <TiltCard intensity={3} className="card--xl dashboard-score">
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

        <div className="grid-3">
          <button onClick={() => router.push("/insights")} className="stat-card row--sm">
            <Activity size={18} className="text-sand" />
            <span className="text-xs font-semibold text-cream">Insights</span>
          </button>
          <button onClick={() => router.push("/leaderboard")} className="stat-card row--sm">
            <Trophy size={18} className="text-sand" />
            <span className="text-xs font-semibold text-cream">Leaderboard</span>
          </button>
          <button onClick={() => router.push("/contribute")} className="stat-card row--sm">
            <Plus size={18} className="text-sand" />
            <span className="text-xs font-semibold text-cream">Contribute</span>
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
                    key={(item.product as { barcode?: string })?.barcode ?? i}
                    onClick={() => router.push(`/results?barcode=${(item.product as { barcode?: string })?.barcode ?? ""}`)}
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

        {/* Competitor feature toggles */}
        <div className="mt-section">
          <div className="section-header">
            <span className="section-header__title">Competitor features</span>
          </div>
          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={dashboard?.yuka_enabled ?? true}
                onChange={(e) => {
                  // Toggle Yuka feature
                  console.log('Yuka enabled:', e.target.checked)
                }}
              />
              <span>Yuka health scoring</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={dashboard?.nova_enabled ?? true}
                onChange={(e) => {
                  // Toggle Open Food Facts NOVA
                  console.log('NOVA enabled:', e.target.checked)
                }}
              />
              <span>NOVA processing group</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={dashboard?.foodswitch_enabled ?? true}
                onChange={(e) => {
                  // Toggle FoodSwitch
                  console.log('FoodSwitch enabled:', e.target.checked)
                }}
              />
              <span>FoodSwitch ratings</span>
            </label>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
