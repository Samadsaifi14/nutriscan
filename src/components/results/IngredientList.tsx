"use client"

import { useMemo, useState } from 'react'

interface HarmfulIngredient {
  name: string
  severity: string
  found_in_product?: boolean
}

interface Props {
  ingredients: string
  harmfulIngredients: HarmfulIngredient[]
}

const HARMFUL_ADDITIVES: Record<string, { severity: string; concern: string }> = {
  'sodium benzoate': { severity: 'high', concern: 'Linked to hyperactivity in children' },
  'potassium sorbate': { severity: 'low', concern: 'Generally safe but can cause allergies' },
  'sodium nitrite': { severity: 'critical', concern: 'Forms nitrosamines - probable carcinogen' },
  'sodium nitrate': { severity: 'critical', concern: 'Linked to cancer risk' },
  'bha': { severity: 'high', concern: 'Possible carcinogen' },
  'bht': { severity: 'medium', concern: 'Potential endocrine disruptor' },
  'tbhq': { severity: 'medium', concern: 'High doses linked to vision disturbances' },
  'sodium metabisulfite': { severity: 'medium', concern: 'Can trigger allergic reactions' },
  'sulphites': { severity: 'medium', concern: 'Can trigger allergic reactions' },
  'sulfur dioxide': { severity: 'medium', concern: 'Can trigger allergic reactions' },
  'tartrazine': { severity: 'high', concern: 'Linked to hyperactivity, banned in several countries' },
  'sunset yellow': { severity: 'high', concern: 'Requires warning labels in EU' },
  'allura red': { severity: 'high', concern: 'Linked to hyperactivity in children' },
  'erythrosine': { severity: 'critical', concern: 'Thyroid tumor risk in animals' },
  'carmine': { severity: 'medium', concern: 'May cause allergic reactions' },
  'annatto': { severity: 'low', concern: 'Generally safe but can cause allergies' },
  'aspartame': { severity: 'medium', concern: 'Classified as possibly carcinogenic' },
  'acesulfame': { severity: 'low', concern: 'Some metabolic effects' },
  'sucralose': { severity: 'low', concern: 'May alter gut microbiome' },
  'saccharin': { severity: 'low', concern: 'May cause bladder tumors in rats' },
  'stevia': { severity: 'safe', concern: 'Generally safe natural sweetener' },
  'msg': { severity: 'low', concern: 'Monosodium glutamate - may cause headaches' },
  'monosodium glutamate': { severity: 'low', concern: 'May cause headaches in sensitive people' },
  'disodium inosinate': { severity: 'low', concern: 'Flavor enhancer, generally safe' },
  'disodium guanylate': { severity: 'low', concern: 'Flavor enhancer, generally safe' },
  'carrageenan': { severity: 'medium', concern: 'Degraded form is inflammatory' },
  'polysorbate': { severity: 'medium', concern: 'May disrupt gut microbiota' },
  'xanthan gum': { severity: 'safe', concern: 'Generally safe' },
  'guar gum': { severity: 'safe', concern: 'Generally safe' },
  'lecithin': { severity: 'safe', concern: 'Generally safe' },
  'high fructose corn syrup': { severity: 'high', concern: 'Linked to obesity and fatty liver' },
  'maltodextrin': { severity: 'medium', concern: 'High glycemic, may affect gut health' },
  'dextrose': { severity: 'medium', concern: 'High glycemic' },
  'trans fat': { severity: 'critical', concern: 'Strongly linked to cardiovascular disease' },
  'hydrogenated oil': { severity: 'high', concern: 'Contains trans fats' },
  'palm oil': { severity: 'medium', concern: 'High in saturated fats' },
  'refined flour': { severity: 'medium', concern: 'High glycemic, low fiber' },
  'maida': { severity: 'medium', concern: 'Refined flour - low nutrition' },
  'salt': { severity: 'medium', concern: 'Excess sodium - monitor intake' },
  'sodium chloride': { severity: 'medium', concern: 'Excess sodium - monitor intake' },
  'trisodium phosphate': { severity: 'high', concern: 'High sodium, may affect calcium absorption' },
  'cane sugar': { severity: 'low', concern: 'Natural sugar - monitor intake' },
  'cane syrup': { severity: 'medium', concern: 'High sugar content' },
  'inverted syrup': { severity: 'medium', concern: 'High sugar content' },
  'liquid glucose': { severity: 'medium', concern: 'High sugar content' },
  'modified corn starch': { severity: 'low', concern: 'Generally safe, may contain allergens' },
  'modified tapioca starch': { severity: 'low', concern: 'Generally safe' },
}

export default function IngredientList({ ingredients, harmfulIngredients }: Props) {
  const [expanded, setExpanded] = useState(false)

  const parsedIngredients = useMemo(() => {
    const items = ingredients
      .replace(/\([\d\w\s,]*\)/g, '')
      .split(/[,;•]/)
      .map(i => i.trim().toLowerCase())
      .filter(i => i.length > 0)
      .slice(0, 30)

    return items.map(name => {
      let risk = null
      for (const [additive, info] of Object.entries(HARMFUL_ADDITIVES)) {
        if (name.includes(additive)) { risk = info; break }
      }
      if (!risk) {
        for (const h of harmfulIngredients) {
          if (name.includes(h.name.toLowerCase())) {
            risk = { severity: h.severity, concern: 'Harmful ingredient detected' }
            break
          }
        }
      }
      return { name, risk }
    })
  }, [ingredients, harmfulIngredients])

  const displayItems = expanded ? parsedIngredients : parsedIngredients.slice(0, 8)
  const harmfulCount = parsedIngredients.filter(i => i.risk && (i.risk.severity === 'high' || i.risk.severity === 'critical')).length

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {displayItems.map((item, idx) => {
          const isBad = item.risk?.severity === 'critical' || item.risk?.severity === 'high'
          const isWarn = item.risk?.severity === 'medium'
          const isGood = item.risk?.severity === 'safe' || item.risk === null
          return (
            <span
              key={idx}
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors ${
                isBad ? 'chip-bad border' : isWarn ? 'chip-warn border' : 'chip-safe'
              }`}
              title={item.risk?.concern}
            >
              {item.risk && (isBad || isWarn) && <span className="mr-1">⚠️</span>}
              {item.name.length > 15 ? item.name.slice(0, 15) + '...' : item.name}
            </span>
          )
        })}
      </div>

      {parsedIngredients.length > 8 && (
        <button onClick={() => setExpanded(!expanded)}
          className="mt-2 text-[11px] font-bold transition-colors"
          style={{ color: 'var(--moss)' }}>
          {expanded ? 'Show less' : `+${parsedIngredients.length - 8} more ingredients`}
        </button>
      )}

      {harmfulCount > 0 && (
        <div className="mt-2 pt-2 border-t" style={{ borderColor: 'var(--card-border)' }}>
          <span className="text-[10px] font-bold" style={{ color: 'var(--risk-red)' }}>
            ⚠️ {harmfulCount} harmful ingredient{harmfulCount > 1 ? 's' : ''} found
          </span>
        </div>
      )}
    </div>
  )
}
