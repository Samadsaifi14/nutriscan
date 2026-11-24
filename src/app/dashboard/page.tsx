"use client";

import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowRight,
  ChevronRight,
  Flame,
  Heart,
  Plus,
  ScanLine,
  Search,
  Trophy,
} from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/PageShell";
import { HealthScoreRing } from "@/components/HealthScoreRing";
import { Pill } from "@/components/Pill";
import { SkeletonDashboard } from "@/components/Skeleton";

type DashboardScan = {
  product?: { name?: string; brand?: string; barcode?: string };
  analysis?: { health_score?: number; health_rating?: string };
};

type DashboardData = {
  overallScore: number;
  streak: number;
  totalScans: number;
  thisWeek: number;
  trend: string;
  monthLabel: string;
  recentScans: DashboardScan[];
};

function ratingVariant(rating: string) {
  if (rating === "healthy") return "healthy" as const;
  if (rating === "moderate") return "warning" as const;
  return "harmful" as const;
}

export default function DashboardPage() {
  const router = useRouter();

  const {
    data: dashboard,
    isLoading,
    isError,
    refetch,
  } = useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/dashboard", { cache: "no-store" });
      if (!response.ok) throw new Error("Unable to load your dashboard");
      const payload = await response.json();
      if (!payload?.success) throw new Error(payload?.error || "Unable to load your dashboard");
      return payload;
    },
  });

  const hasScans = (dashboard?.totalScans ?? 0) > 0;
  const score = dashboard?.overallScore ?? 0;

  if (isLoading) {
    return (
      <PageShell title="NutriScan">
        <SkeletonDashboard />
      </PageShell>
    );
  }

  return (
    <PageShell title="NutriScan">
      <div className="stack">
        {isError ? (
          <section className="card card--xl stack--md" role="alert">
            <p className="text-sm font-semibold text-cream">Your dashboard could not be loaded</p>
            <p className="text-xs text-sand">Your scans are safe. Check your connection and try again.</p>
            <button className="btn btn--primary btn--sm w-fit" onClick={() => refetch()}>
              Try again
            </button>
          </section>
        ) : (
          <>
            <section className="card card--xl relative overflow-hidden">
              <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-clay/10 blur-3xl" />
              <div className="relative z-10 grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
                <div className="stack--md">
                  <p className="text-2xs uppercase tracking-[0.18em] text-sand">
                    {hasScans ? "Your food journey" : "A better way to understand food"}
                  </p>
                  <div>
                    <h2 className="text-h2 text-cream">
                      {hasScans ? "Small choices add up." : "Make every food choice count."}
                    </h2>
                    <p className="mt-2 max-w-xl text-sm text-sand">
                      {hasScans
                        ? "Your recent scans are building a clearer picture of the products you choose."
                        : "Scan a packaged product to understand its nutrition, ingredients and health signals."}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button className="btn btn--primary btn--sm" onClick={() => router.push("/scan")}>
                      <ScanLine size={16} /> Scan a product
                    </button>
                    <button className="btn btn--secondary btn--sm" onClick={() => router.push("/search")}>
                      <Search size={16} /> Explore foods
                    </button>
                  </div>
                </div>
                {hasScans ? (
                  <div className="flex items-center gap-4 md:pr-2">
                    <HealthScoreRing score={score} size="xl" />
                    <div>
                      <p className="text-2xs text-sand">Average health score</p>
                      <p className="text-h2 text-cream">{score.toFixed(1)}<span className="text-sm text-sand">/10</span></p>
                      <p className="text-xs text-sand">
                        {score >= 7 ? "Looking good" : score >= 4 ? "Room to improve" : "Worth reviewing"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="hidden h-28 w-28 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] md:flex">
                    <Heart size={38} className="text-clay" />
                  </div>
                )}
              </div>
            </section>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              <div className="stat-card">
                <div className="row--sm items-center text-sand"><ScanLine size={16} /><span className="text-xs">Total scans</span></div>
                <p className="mt-2 text-h2 text-cream">{dashboard?.totalScans ?? 0}</p>
              </div>
              <div className="stat-card">
                <div className="row--sm items-center text-sand"><Flame size={16} /><span className="text-xs">Day streak</span></div>
                <p className="mt-2 text-h2 text-cream">{dashboard?.streak ?? 0}</p>
              </div>
              <div className="stat-card col-span-2 md:col-span-1">
                <div className="row--sm items-center text-sand"><Activity size={16} /><span className="text-xs">Scans this week</span></div>
                <p className="mt-2 text-h2 text-cream">{dashboard?.thisWeek ?? 0}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
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

            <section className="mt-section">
              <div className="section-header">
                <span className="section-header__title">Recent scans</span>
                <button className="section-header__action" onClick={() => router.push("/scan-history")}>
                  View history <ArrowRight size={14} />
                </button>
              </div>
              <div className="stack--md">
                {dashboard?.recentScans?.length ? (
                  dashboard.recentScans.map((item, index) => {
                    const product = item.product;
                    const analysis = item.analysis;
                    const barcode = product?.barcode;
                    const rating = analysis?.health_rating ?? "moderate";
                    return (
                      <motion.button
                        key={barcode ?? `${product?.name ?? "scan"}-${index}`}
                        onClick={() => barcode && router.push(`/results?barcode=${encodeURIComponent(barcode)}`)}
                        disabled={!barcode}
                        className="card card--sm product-card text-left disabled:cursor-default"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.04 * index, duration: 0.2 }}
                      >
                        <HealthScoreRing score={analysis?.health_score ?? 5} size="sm" />
                        <div className="product-card__body">
                          <p className="product-card__name truncate">{product?.name ?? "Unknown product"}</p>
                          <p className="product-card__brand">{product?.brand ?? ""}</p>
                          <div className="product-card__tags">
                            <Pill variant={ratingVariant(rating)}>{rating}</Pill>
                          </div>
                        </div>
                        <ChevronRight size={18} className="text-muted" />
                      </motion.button>
                    );
                  })
                ) : (
                  <div className="empty-state">
                    <p className="text-sm font-semibold text-cream">No scans yet</p>
                    <p className="mt-1 text-xs text-sand">Your product history will appear here after your first scan.</p>
                    <button className="btn btn--primary btn--sm mt-3" onClick={() => router.push("/scan")}>
                      <ScanLine size={16} /> Scan your first product
                    </button>
                  </div>
                )}
              </div>
            </section>

            <div className="alert alert--info mt-section">
              <Heart size={16} />
              <span>Save products you buy often to compare them again whenever you need.</span>
            </div>
          </>
        )}
      </div>
    </PageShell>
  );
}
