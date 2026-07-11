"use client";

import { useState, useEffect, useMemo } from "react";
import { AlertTriangle, Info, Heart, ExternalLink } from "lucide-react";
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

  const { product, analysis } = data || {} as any;
  const nutrition = product?.nutrition;

  // Build ingredient severity map for highlighting
  const ingredientSeverityMap = useMemo(() => {
    const map = new Map<string, { status: 'harmful' | 'concern' | 'safe'; reason?: string }>();
    if (!analysis) return map;
    // From harmful_ingredients (additive detection)
    if (analysis.harmful_ingredients) {
      for (const ing of analysis.harmful_ingredients) {
        map.set(ing.name.toLowerCase(), { status: 'harmful', reason: ing.reason });
        if (ing.also_known_as) {
          for (const alias of ing.also_known_as.split(',').map((a: string) => a.trim().toLowerCase())) {
            map.set(alias, { status: 'harmful', reason: ing.reason });
          }
        }
      }
    }
    // From ai_ingredients (Groq analysis)
    const aiIngs = (analysis as any).ai_ingredients;
    if (Array.isArray(aiIngs)) {
      for (const ing of aiIngs) {
        if (!map.has(ing.ingredient?.toLowerCase())) {
          map.set(ing.ingredient?.toLowerCase(), { status: ing.status, reason: ing.concern });
        }
      }
    }
    // From ingredient_warnings
    const warnings = (analysis as any).ingredient_warnings;
    if (Array.isArray(warnings)) {
      for (const w of warnings) {
        if (!map.has(w.ingredient?.toLowerCase())) {
          map.set(w.ingredient?.toLowerCase(), { status: w.severity === 'high' ? 'harmful' : 'concern', reason: w.concern });
        }
      }
    }
    return map;
  }, [analysis]);

  // Parse ingredients text into individual items with severity
  const parsedIngredients = useMemo(() => {
    if (!product?.ingredients_text) return [];
    const raw = product.ingredients_text.split(',').map((s: string) => s.trim()).filter(Boolean);
    return raw.map((item: string) => {
      const lower = item.toLowerCase();
      for (const [key, val] of ingredientSeverityMap) {
        if (lower.includes(key) || key.includes(lower)) {
          return { text: item, status: val.status, reason: val.reason };
        }
      }
      return { text: item, status: 'safe' as const, reason: undefined };
    });
  }, [product?.ingredients_text, ingredientSeverityMap]);

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
              <p className="text-h3 text-cream leading-tight">{product.name}</p>
              <p className="text-xs text-sand mt-1">
                {product.brand ? (
                  <>by <span style={{ color: 'var(--cream)', fontWeight: 600 }}>{product.brand}</span></>
                ) : (
                  <>Brand not listed</>
                )}
              </p>
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
              <div className="card card--sm">
                <p className="text-xs font-bold text-amber mb-2" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  ⚠ {analysis.harmful_ingredients.length} Harmful Ingredient{analysis.harmful_ingredients.length > 1 ? 's' : ''} Detected
                </p>
                <div className="stack--sm">
                  {analysis.harmful_ingredients.map((ing: any) => (
                    <div key={ing.name} className="flex items-start gap-2 p-2 rounded-lg" style={{ background: 'rgba(192,64,40,0.08)' }}>
                      <AlertTriangle size={14} className="text-amber shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--risk-red, #c0392b)' }}>{ing.name}</p>
                        <p className="text-xs text-sand mt-0.5">{ing.reason}</p>
                        {ing.severity === 'high' && (
                          <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold" style={{ background: 'rgba(192,64,40,0.15)', color: 'var(--risk-red, #c0392b)' }}>
                            HIGH RISK
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="card card--healthy">
                <p className="text-sm text-moss font-semibold">✓ No harmful ingredients detected</p>
              </div>
            )}
            {parsedIngredients.length > 0 && (
              <div className="card">
                <p className="text-2xs text-sand mb-2" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Ingredients List</p>
                <div className="flex flex-wrap gap-1.5">
                  {parsedIngredients.map((ing: any, i: number) => (
                    <span key={i} className={`inline-block px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                      ing.status === 'harmful'
                        ? 'border'
                        : ing.status === 'concern'
                        ? 'border'
                        : ''
                    }`} style={{
                      ...(ing.status === 'harmful' ? { background: 'rgba(192,64,40,0.12)', borderColor: 'rgba(192,64,40,0.3)', color: 'var(--risk-red, #c0392b)' } : {}),
                      ...(ing.status === 'concern' ? { background: 'rgba(196,113,74,0.1)', borderColor: 'rgba(196,113,74,0.25)', color: 'var(--clay, #c1714a)' } : {}),
                      ...(ing.status === 'safe' ? { background: 'rgba(61,92,46,0.08)', color: 'var(--moss, #3d5c2e)' } : {}),
                    }}>
                      {ing.status === 'harmful' && <span className="mr-1">⚠</span>}
                      {ing.status === 'concern' && <span className="mr-1">●</span>}
                      {ing.text}
                    </span>
                  ))}
                </div>
                <p className="text-[10px] text-sand mt-3 flex gap-3">
                  <span><span className="inline-block w-2 h-2 rounded mr-1" style={{ background: 'rgba(192,64,40,0.4)' }} />Harmful</span>
                  <span><span className="inline-block w-2 h-2 rounded mr-1" style={{ background: 'rgba(196,113,74,0.4)' }} />Concern</span>
                  <span><span className="inline-block w-2 h-2 rounded mr-1" style={{ background: 'rgba(61,92,46,0.3)' }} />Safe</span>
                </p>
              </div>
            )}
          </div>
        )}

        {tab === "Alternatives" && (
          <div className="stack--md">
            {data.alternatives && data.alternatives.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-sand" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                    {data.alternatives.length} Healthier Alternative{data.alternatives.length > 1 ? 's' : ''} Found
                  </p>
                  <p className="text-[10px] text-sand">vs current score: {analysis.health_score}/10</p>
                </div>
                {data.alternatives.map((alt, idx) => (
                  <div key={idx} className="card card--sm" style={{ borderLeft: '3px solid var(--moss)' }}>
                    <div className="flex items-start gap-3">
                      <HealthScoreRing score={alt.health_score} size="sm" />
                      <div className="flex-1">
                        <p className="text-sm font-bold" style={{ color: 'var(--cream)' }}>{alt.name}</p>
                        {alt.brand && <p className="text-xs text-sand mt-0.5">{alt.brand}</p>}
                        <div className="flex items-center gap-2 mt-1">
                          {alt.grade && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ background: 'rgba(61,92,46,0.12)', color: 'var(--moss)' }}>
                              Grade {alt.grade}
                            </span>
                          )}
                          {alt.health_score > analysis.health_score && (
                            <span className="text-[10px]" style={{ color: 'var(--moss)' }}>
                              +{(alt.health_score - analysis.health_score).toFixed(1)} better
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {alt.reason && (
                      <p className="text-xs mt-2" style={{ color: 'var(--clay)' }}>{alt.reason}</p>
                    )}
                    {alt.nutrition_comparison && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {alt.nutrition_comparison.sugar && (
                          <span className="text-[10px] px-2 py-0.5 rounded" style={{ background: 'rgba(61,92,46,0.08)' }}>
                            Sugar {alt.nutrition_comparison.sugar.reduction}
                          </span>
                        )}
                        {alt.nutrition_comparison.sodium && (
                          <span className="text-[10px] px-2 py-0.5 rounded" style={{ background: 'rgba(61,92,46,0.08)' }}>
                            Sodium {alt.nutrition_comparison.sodium.reduction}
                          </span>
                        )}
                        {alt.nutrition_comparison.calories && (
                          <span className="text-[10px] px-2 py-0.5 rounded" style={{ background: 'rgba(61,92,46,0.08)' }}>
                            Calories {alt.nutrition_comparison.calories.reduction}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {alt.availability && (
                        <span className="text-[10px] text-sand">{alt.availability}</span>
                      )}
                      {alt.shopping_url && (
                        <a href={alt.shopping_url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-all"
                          style={{ background: 'rgba(61,92,46,0.1)', color: 'var(--moss)', border: '1px solid rgba(61,92,46,0.2)' }}>
                          <ExternalLink size={10} />
                          Buy on Amazon
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="empty-state">
                <p className="text-sm text-sand">No alternatives found</p>
                <p className="text-xs text-sand mt-1">Try scanning a different product</p>
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
