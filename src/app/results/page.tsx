"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Info, Heart } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { TiltCard } from "@/components/TiltCard";
import { HealthScoreRing } from "@/components/HealthScoreRing";
import { Pill } from "@/components/Pill";
import { ShoppingLinks } from "@/components/ShoppingLinks";
import OverviewTab from "@/components/results/OverviewTab";
import { cn } from "@/lib/utils";
import type { ScanResultPayload } from "@/types/scanResult";
import { writeScanResult } from "@/types/scanResult";
import toast from "react-hot-toast";

const TABS = ["Overview", "Nutrition", "Ingredients", "Alternatives"] as const;
type Tab = (typeof TABS)[number];

function loadFromStorage(): ScanResultPayload | null {
  try {
    const raw = localStorage.getItem("hox_scan_result_v1") || sessionStorage.getItem("hox_scan_result_v1");
    if (raw) {
      const parsed = JSON.parse(raw) as ScanResultPayload;
      if (parsed.version === 1 && parsed.product && parsed.analysis) return parsed;
    }
  } catch {
    // silent
  }
  return null;
}

function ratingVariant(rating: string) {
  if (rating === "healthy") return "healthy" as const;
  if (rating === "moderate") return "warning" as const;
  return "harmful" as const;
}

function cnCard(rating: string) {
  if (rating === "healthy") return "card--healthy";
  if (rating === "moderate") return "card--warning";
  return "card--harmful";
}

export default function ResultsPage() {
  const [tab, setTab] = useState<Tab>("Overview");
  const [data, setData] = useState<ScanResultPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = loadFromStorage();
    if (stored) {
      setData(stored);
      setLoading(false);
      return;
    }
    const barcode = new URLSearchParams(window.location.search).get("barcode");
    if (barcode) {
      setLoading(true);
      fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barcode }),
      })
        .then((r) => r.json())
        .then((d) => {
          if (d?.product && d?.analysis) {
            writeScanResult({ product: d.product, analysis: d.analysis, quantity: 1, alternatives: d.alternatives });
            setData({
              version: 1,
              timestamp: new Date().toISOString(),
              product: d.product,
              analysis: d.analysis,
              quantity: 1,
              alternatives: d.alternatives,
            });
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
      return;
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <PageShell title="Scan result" showBack>
        <div className="empty-state" style={{ minHeight: "60dvh", justifyContent: "center" }}>
          <p className="text-body" style={{ fontWeight: 600 }}>Loading…</p>
        </div>
      </PageShell>
    );
  }

  if (!data) {
    return (
      <PageShell title="Scan result" showBack>
        <div className="empty-state" style={{ minHeight: "60dvh", justifyContent: "center" }}>
          <Info size={24} className="empty-state__icon" />
          <p className="text-body" style={{ fontWeight: 600 }}>No scan result found</p>
          <p className="text-xs text-sand">Scan a product to see results here</p>
        </div>
      </PageShell>
    );
  }

  const { product, analysis } = data;
  const nutrition = product.nutrition;

  async function saveFavorite() {
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_name: product.name,
          barcode: product.barcode,
          calories_per_100g: nutrition.calories,
          protein_per_100g: nutrition.protein,
          carbs_per_100g: nutrition.carbs,
          fat_per_100g: nutrition.fat,
          sodium_per_100g: nutrition.sodium,
        }),
      });
      if (res.ok) {
        setSaved(true);
        toast.success("Saved to favorites");
      } else {
        toast.error("Could not save");
      }
    } catch {
      toast.error("Could not save");
    }
  }

  return (
    <PageShell
      variant="default"
      title={product.name}
      showBack
      topBarRight={
        <button
          onClick={saveFavorite}
          aria-label="Save to favorites"
          className="icon-btn glass rounded-full"
          style={{ color: saved ? "var(--clay)" : "var(--cream)" }}
        >
          <Heart size={18} fill={saved ? "var(--clay)" : "none"} />
        </button>
      }
    >
      <div className="stack">
        <TiltCard intensity={5} className={cnCard(analysis.health_rating)}>
          <div className="row--lg">
            <HealthScoreRing score={analysis.health_score} size="xl" />
            <div className="flex-1">
              <p className="text-h3 text-cream">{product.name}</p>
              <p className="text-xs text-sand">{product.brand}</p>
              <Pill variant={ratingVariant(analysis.health_rating)} className="mt-2">
                {analysis.health_rating}
              </Pill>
            </div>
          </div>
          <p className="text-sm text-sand mt-4">{analysis.summary}</p>
        </TiltCard>

        <div className="tab-bar">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn("tab-bar__item", tab === t && "tab-bar__item--active")}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "Overview" && <OverviewTab analysis={analysis} />}

        {tab === "Nutrition" && (
          <div className="card stack--sm">
            {[
              { label: "Calories", value: nutrition.calories, unit: "kcal" },
              { label: "Protein", value: nutrition.protein, unit: "g" },
              { label: "Carbs", value: nutrition.carbs, unit: "g" },
              { label: "Fat", value: nutrition.fat, unit: "g" },
              ...(nutrition.saturated_fat != null ? [{ label: "Saturated Fat", value: nutrition.saturated_fat, unit: "g" }] : []),
              ...(nutrition.sugar != null ? [{ label: "Sugar", value: nutrition.sugar, unit: "g" }] : []),
              ...(nutrition.sodium != null ? [{ label: "Sodium", value: nutrition.sodium, unit: "mg" }] : []),
              ...(nutrition.fiber != null ? [{ label: "Fiber", value: nutrition.fiber, unit: "g" }] : []),
            ].map((item) => (
              <div key={item.label} className="row" style={{ justifyContent: "space-between" }}>
                <span className="text-sm text-sand capitalize">{item.label}</span>
                <span className="text-mono text-sm text-cream">{item.value}<span className="text-muted text-xs"> {item.unit}</span></span>
              </div>
            ))}
          </div>
        )}

        {tab === "Ingredients" && (
          <div className="stack--md">
            {analysis.harmful_ingredients && analysis.harmful_ingredients.length > 0 ? (
              analysis.harmful_ingredients.map((ing) => (
                <div key={ing.name} className="card card--sm row--md">
                  <AlertTriangle size={18} className="text-amber shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-cream">{ing.name}</p>
                    <p className="text-xs text-sand mt-1">{ing.reason}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="card card--healthy">
                <p className="text-sm text-moss font-semibold">No harmful ingredients detected</p>
              </div>
            )}
            {product.ingredients_text && (
              <div className="card">
                <p className="text-2xs text-sand mb-2">Full ingredients list</p>
                <p className="text-xs text-sand" style={{ lineHeight: 1.6 }}>{product.ingredients_text}</p>
              </div>
            )}
          </div>
        )}

        {tab === "Alternatives" && (
          <div className="stack--md">
            {data.alternatives && data.alternatives.length > 0 ? (
              data.alternatives.map((alt) => (
                <div key={alt.name} className="card card--sm product-card">
                  <HealthScoreRing score={alt.health_score} size="sm" />
                  <div className="product-card__body">
                    <p className="product-card__name">{alt.name}</p>
                    {alt.brand && <p className="product-card__brand">{alt.brand}</p>}
                    {alt.reason && <p className="text-xs text-clay mt-1">{alt.reason}</p>}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p className="text-sm text-sand">No alternatives found</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-section">
          <div className="section-header">
            <span className="section-header__title">Where to buy</span>
          </div>
          <div className="filter-row">
            <ShoppingLinks productName={product.name} variant="compact" />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
