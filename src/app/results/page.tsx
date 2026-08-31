"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { AlertTriangle, Info, Heart, ExternalLink, ClipboardCheck, RefreshCw, Search, Activity, Shield, Leaf, ArrowRight, CheckCircle2 } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { HealthScoreRing } from "@/components/HealthScoreRing";
import { ShoppingLinks } from "@/components/ShoppingLinks";
import OverviewTab from "@/components/results/OverviewTab";
import { cn } from "@/lib/utils";
import type { ScanResultPayload } from "@/types/scanResult";
import { writeScanResult } from "@/types/scanResult";
import toast from "react-hot-toast";

const TABS = ["Overview", "Nutrition", "Ingredients", "Alternatives"] as const;
type Tab = (typeof TABS)[number];

function defaultMealType(): "breakfast" | "lunch" | "dinner" | "snack" {
  const h = new Date().getHours();
  if (h >= 5 && h < 11) return "breakfast";
  if (h >= 11 && h < 16) return "lunch";
  if (h >= 16 && h < 21) return "dinner";
  return "snack";
}

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

function productSourceLabel(source: string | undefined) {
  if (!source) return 'Product label data'
  if (source.includes('open_food_facts')) return 'Open Food Facts'
  if (source.includes('community')) return 'NutriScan community'
  if (source.includes('ai') || source.includes('estimated')) return 'Estimated data — verify the pack'
  return 'NutriScan product database'
}

export default function ResultsPage() {
  const [tab, setTab] = useState<Tab>("Overview");
  const [data, setData] = useState<ScanResultPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [logged, setLogged] = useState(false);
  const [mealType, setMealType] = useState<"breakfast" | "lunch" | "dinner" | "snack">(defaultMealType());
  const [quantityG, setQuantityG] = useState(100);
  const [logging, setLogging] = useState(false);
  const [ingredientResearch, setIngredientResearch] = useState<Array<{ ingredient: string; matchedName: string; description: string; sourceName: string; sourceUrl: string }>>([]);
  const [researchingIngredients, setResearchingIngredients] = useState(false);
  const researchRequestedRef = useRef(false);

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

  const product = data?.product;
  const analysis = data?.analysis;
  const nutrition = product?.nutrition ?? {} as Record<string, number | null | undefined>;

  // Build ingredient severity map for highlighting
  const ingredientSeverityMap = useMemo(() => {
    const map = new Map<string, { status: 'harmful' | 'concern' | 'safe'; reason?: string }>();
    if (!analysis) return map;
    // From harmful_ingredients (additive detection)
    if (analysis.harmful_ingredients) {
      for (const ing of analysis.harmful_ingredients) {
        const status = ing.severity === 'high' ? 'harmful' : 'concern';
        map.set(ing.name.toLowerCase(), { status, reason: ing.reason });
        if (ing.also_known_as) {
          const aliases = Array.isArray(ing.also_known_as) ? ing.also_known_as : ing.also_known_as.split(',');
          for (const alias of aliases.map((a: string) => a.trim().toLowerCase())) {
            map.set(alias, { status, reason: ing.reason });
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
      return { text: item, status: 'information' as const, reason: undefined };
    });
  }, [product?.ingredients_text, ingredientSeverityMap]);

  useEffect(() => {
    if (tab !== 'Ingredients' || researchRequestedRef.current || !analysis?.ingredient_report?.length) return;
    const candidates = analysis.ingredient_report
      .filter((item) => !item.sourceUrl && item.evidence === 'label')
      .map((item) => item.name)
      .slice(0, 8);
    if (!candidates.length) return;
    researchRequestedRef.current = true;
    setResearchingIngredients(true);
    fetch('/api/ingredients/research', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredients: candidates }),
    })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body?.error || 'Ingredient research failed');
        setIngredientResearch(body?.results || []);
      })
      .catch(() => setIngredientResearch([]))
      .finally(() => setResearchingIngredients(false));
  }, [tab, analysis?.ingredient_report]);

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

  if (!product || !analysis) {
    return (
      <PageShell title="Scan result" showBack>
        <div className="empty-state" style={{ minHeight: "60dvh", justifyContent: "center" }}>
          <Info size={24} className="empty-state__icon" />
          <p className="text-body" style={{ fontWeight: 600 }}>Incomplete scan data</p>
          <p className="text-xs text-sand">Try scanning the product again</p>
        </div>
      </PageShell>
    );
  }

  const primaryConcern = analysis.harmful_ingredients?.[0];
  const remainingConcerns = analysis.harmful_ingredients?.slice(1) ?? [];

  async function saveFavorite() {
    if (!product || !nutrition) return;
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

  async function logMeal() {
    if (!product || !nutrition) return;
    setLogging(true);
    try {
      const res = await fetch("/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_name: product.name,
          barcode: product.barcode || undefined,
          quantity_g: quantityG,
          calories_per_100g: nutrition.calories ?? 0,
          protein_per_100g: nutrition.protein ?? 0,
          carbs_per_100g: nutrition.carbs ?? 0,
          fat_per_100g: nutrition.fat ?? 0,
          sodium_per_100g: nutrition.sodium ?? undefined,
          meal_type: mealType,
        }),
      });
      if (res.ok) {
        setLogged(true);
        setLogOpen(false);
        toast.success("Logged");
      } else {
        const d = await res.json().catch(() => null);
        toast.error(d?.error || "Could not log this");
      }
    } catch {
      toast.error("Could not log this");
    } finally {
      setLogging(false);
    }
  }

  return (
    <PageShell
      variant="default"
      title="NutriScan"
      showBack
      topBarRight={
        <div className="row" style={{ gap: 8 }}>
          <button
            onClick={() => setLogOpen(true)}
            aria-label="Log this meal"
            className="icon-btn"
            style={{ color: logged ? "var(--clay)" : "var(--cream)" }}
          >
            <ClipboardCheck size={18} />
          </button>
          <button
            onClick={saveFavorite}
            aria-label="Save to favorites"
            className="icon-btn"
            style={{ color: saved ? "var(--clay)" : "var(--cream)" }}
          >
            <Heart size={18} fill={saved ? "var(--clay)" : "none"} />
          </button>
        </div>
      }
    >
      <div className="stack">
        <section className="result-hero" aria-labelledby="result-product-name">
          <div className="result-hero__grid">
            <HealthScoreRing score={analysis.health_score} size="xl" />
            <div className="result-hero__product">
              <h2 id="result-product-name" className="text-h1 text-cream leading-tight">{product.name}</h2>
              <p className="text-body text-sand mt-2">
                {product.brand ? <>by <span className="text-cream font-semibold">{product.brand}</span></> : <>Brand not listed</>}
              </p>
              <div className="result-verdict">
                <AlertTriangle size={18} />
                {analysis.health_rating === "healthy" ? "Lower concern" : analysis.health_rating === "moderate" ? "Review this choice" : "High concern"}
              </div>
              <p className="text-sm text-sand mt-3">
                <strong className="text-clay">{analysis.harmful_ingredients?.length ?? 0}</strong>{" "}
                ingredient{analysis.harmful_ingredients?.length === 1 ? "" : "s"} to review
              </p>
            </div>
          </div>
          <p className="result-hero__summary">{analysis.summary}</p>
          <p className="result-hero__source">Data source: {productSourceLabel(product.source)}</p>
        </section>

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

        {tab === "Nutrition" && nutrition && (
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
        {tab === "Nutrition" && !nutrition && (
          <div className="empty-state">
            <p className="text-sm text-sand">Nutrition data not available</p>
          </div>
        )}

        {tab === "Ingredients" && (
          <div className="stack--md">
            {primaryConcern ? (
              <>
                <section className="result-panel" aria-labelledby="primary-concern-title">
                  <div className="result-panel__header">
                    <span className="chip chip--harmful">Highest concern</span>
                    <h2 id="primary-concern-title" className="text-h1 mt-3">{primaryConcern.name}</h2>
                  </div>
                  <div className="evidence-row">
                    <div className="evidence-row__icon"><Activity size={20} /></div>
                    <div>
                      <p className="text-sm font-semibold text-cream">Why it matters</p>
                      <p className="text-sm text-sand mt-1 evidence-row__summary">{primaryConcern.reason}</p>
                    </div>
                  </div>
                  <div className="evidence-row">
                    <div className="evidence-row__icon"><Info size={20} /></div>
                    <div>
                      <p className="text-sm font-semibold text-cream">Amount in this product</p>
                      <p className="text-sm text-clay mt-1">{primaryConcern.amount_in_this_product || "Not declared on the product label"}</p>
                      {primaryConcern.global_safe_limit && <p className="text-xs text-sand mt-2"><strong className="text-cream">Reference limit:</strong> {primaryConcern.global_safe_limit}</p>}
                    </div>
                  </div>
                  {primaryConcern.source_url && (
                    <div className="evidence-row evidence-row--source">
                      <div className="evidence-row__icon"><ExternalLink size={20} /></div>
                      <div>
                        <p className="text-sm font-semibold text-cream">Evidence</p>
                        <p className="text-xs text-sand mt-1">Regulatory and toxicology reference</p>
                        <a className="inline-flex items-center gap-1 text-xs mt-2" style={{ color: 'var(--cobalt)' }} href={primaryConcern.source_url} target="_blank" rel="noopener noreferrer">
                          {primaryConcern.scientific_source || "View evidence"} <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  )}
                </section>
                {remainingConcerns.length > 0 && (
                  <details className="ingredient-more">
                    <summary>{remainingConcerns.length} more ingredient{remainingConcerns.length === 1 ? "" : "s"} to review</summary>
                    <div className="stack--sm mt-3">
                      {remainingConcerns.map((ingredient) => (
                        <div key={ingredient.name} className="ingredient-more__row">
                          <AlertTriangle size={15} />
                          <div>
                            <p className="text-sm font-semibold text-cream">{ingredient.name}</p>
                            <p className="text-xs text-sand mt-1">{ingredient.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </>
            ) : (
              <div className="card card--healthy">
                <p className="text-sm text-moss font-semibold inline-flex items-center gap-2"><CheckCircle2 size={16} /> No high-concern additives matched</p>
                <p className="text-xs text-sand mt-1">This is not a guarantee that every ingredient is suitable for every person.</p>
              </div>
            )}
            {analysis.ingredient_report && analysis.ingredient_report.length > 0 && (
              <div className="card stack--sm">
                <div>
                  <p className="text-2xs text-sand" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Plain-language ingredient guide</p>
                  <p className="text-xs text-sand mt-1">Each item is kept as written on the label, then explained without guessing missing details.</p>
                </div>
                {analysis.ingredient_report.map((item, index) => {
                  const colors = item.status === 'high_concern'
                    ? { background: 'var(--rust-bg)', border: 'var(--rust)', text: 'var(--rust)' }
                    : item.status === 'watch'
                    ? { background: 'var(--clay-bg)', border: 'var(--clay)', text: 'var(--clay)' }
                    : { background: 'var(--moss-bg)', border: 'var(--moss)', text: 'var(--moss)' };
                  return (
                    <div key={`${item.name}-${index}`} className="rounded-lg p-3" style={{ background: colors.background, border: `1px solid ${colors.border}` }}>
                      <div className="row" style={{ justifyContent: 'space-between', gap: 8 }}>
                        <p className="text-sm font-semibold" style={{ color: colors.text }}>{item.name}</p>
                        <span className="text-[10px] text-sand">{item.evidence === 'additive_database' ? 'Additive reference' : 'Label explanation'}</span>
                      </div>
                      <p className="text-xs text-cream mt-1">{item.plainLanguage}</p>
                      <p className="text-xs text-sand mt-1">{item.note}</p>
                      {item.safeLimit && <p className="text-xs text-cream mt-1"><strong>Reference limit:</strong> {item.safeLimit}</p>}
                      {item.sourceUrl && (
                        <a className="inline-flex items-center gap-1 text-[10px] mt-1" style={{ color: 'var(--clay)' }} href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
                          {item.sourceName || 'Official source'} <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  );
                })}
                <p className="text-[10px] text-sand">Reference framework: the product label and linked public toxicology sources. A numerical ADI is a lifetime population-level reference, not a per-product guarantee or personal prescription.</p>
              </div>
            )}
            {(researchingIngredients || ingredientResearch.length > 0) && (
              <div className="card stack--sm">
                <div className="row" style={{ gap: 8 }}>
                  {researchingIngredients ? <RefreshCw size={16} className="animate-spin text-clay" /> : <Search size={16} className="text-moss" />}
                  <div>
                    <p className="text-sm text-cream font-semibold">Live ingredient identity research</p>
                    <p className="text-[10px] text-sand">Official NIH PubChem lookup for label terms without a toxicology match.</p>
                  </div>
                </div>
                {ingredientResearch.map((item) => (
                  <div key={item.ingredient} className="rounded-lg p-3" style={{ background: 'var(--surface-2)' }}>
                    <p className="text-xs text-cream font-semibold">{item.ingredient} <span className="text-sand">· matched to {item.matchedName}</span></p>
                    <p className="text-xs text-sand mt-1">{item.description}</p>
                    <a className="inline-flex items-center gap-1 text-[10px] mt-1" style={{ color: 'var(--clay)' }} href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
                      {item.sourceName} <ExternalLink size={10} />
                    </a>
                  </div>
                ))}
                {!researchingIngredients && <p className="text-[10px] text-sand">Identity information does not establish harm at the amount used in this product.</p>}
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
                      ...(ing.status === 'harmful' ? { background: 'var(--rust-bg)', borderColor: 'var(--rust)', color: 'var(--rust)' } : {}),
                      ...(ing.status === 'concern' ? { background: 'var(--clay-bg)', borderColor: 'var(--clay)', color: 'var(--clay)' } : {}),
                      ...(ing.status === 'information' ? { background: 'var(--surface-2)', color: 'var(--sand)' } : {}),
                    }}>
                      {ing.text}
                    </span>
                  ))}
                </div>
                <p className="text-[10px] text-sand mt-3 flex gap-3">
                  <span><span className="inline-block w-2 h-2 rounded mr-1" style={{ background: 'var(--rust)' }} />High concern</span>
                  <span><span className="inline-block w-2 h-2 rounded mr-1" style={{ background: 'var(--clay)' }} />Watch</span>
                  <span><span className="inline-block w-2 h-2 rounded mr-1" style={{ background: 'var(--muted)' }} />Not assessed</span>
                </p>
              </div>
            )}
            <button className="safer-cta" onClick={() => setTab("Alternatives")}>
              <Leaf size={20} />
              Compare {data.alternatives?.length || 5} safer choices
              <ArrowRight size={20} />
            </button>
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
              <div className="card stack--md">
                <div className="row" style={{ gap: 10, alignItems: 'flex-start' }}>
                  <Shield size={20} className="text-moss shrink-0" />
                  <div>
                    <p className="text-sm text-cream font-semibold">No verified like-for-like match yet</p>
                    <p className="text-xs text-sand mt-1">We will not label unrelated foods as direct alternatives. Use these checks when comparing the same product category.</p>
                  </div>
                </div>
                <div className="stack--sm">
                  <div className="row text-xs text-sand" style={{ gap: 8 }}><Activity size={14} className="text-clay" /> Compare per 100 g/ml, not package totals.</div>
                  <div className="row text-xs text-sand" style={{ gap: 8 }}><Search size={14} className="text-clay" /> Prefer lower sugar, sodium and saturated fat with more fibre or protein.</div>
                </div>
                <div>
                  <p className="text-[10px] text-sand mb-2">Search marketplaces for comparable products</p>
                  <ShoppingLinks productName={`${product.category || product.name} healthier`} variant="compact" />
                </div>
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

      {logOpen && (
        <div className="fixed inset-0 z-20 flex items-end bg-black/60" onClick={() => setLogOpen(false)}>
          <div className="glass w-full rounded-t-2xl p-page pb-8" onClick={(e) => e.stopPropagation()}>
            <p className="text-h3 text-cream mb-4">Log this meal</p>

            <p className="text-xs text-sand mb-2">Meal</p>
            <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
              {(["breakfast", "lunch", "dinner", "snack"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMealType(m)}
                  className={cn("chip", mealType === m && "chip--active")}
                  style={{ textTransform: "capitalize" }}
                >
                  {m}
                </button>
              ))}
            </div>

            <p className="text-xs text-sand mt-4 mb-2">Amount (g)</p>
            <input
              className="input"
              type="number"
              min={1}
              max={5000}
              value={quantityG}
              onChange={(e) => setQuantityG(Number(e.target.value) || 100)}
            />

            <button
              onClick={logMeal}
              disabled={logging}
              className="btn btn--primary w-full mt-4"
            >
              {logging ? "Logging…" : "Confirm"}
            </button>
          </div>
        </div>
      )}
    </PageShell>
  );
}
