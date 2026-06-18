"use client"
import Image from 'next/image'
import { Product } from '@/types/scanResult'

const sourceBadge: Record<string, { label: string; className: string }> = {
  cache:           { label: '✅ In our database',     className: 'chip-safe border' },
  open_food_facts: { label: '🌐 Open Food Facts',    className: 'chip-warn border' },
  upc_item_db:     { label: '🔍 UPC Database',        className: 'text-xs px-2 py-1 rounded-full font-medium border' + ' bg-clay/10 text-clay border-clay/20' },
  gemini_vision:   { label: '🇮🇳 Added to Indian DB', className: 'chip-warn border' },
  gemini_photo:    { label: '📸 Read from photo',     className: 'text-xs px-2 py-1 rounded-full font-medium border' + ' bg-clay/10 text-clay border-clay/20' },
}

interface ProductCardProps {
  product:       Product
  quantity:      number
  loggedMeal:    string | null
  isGuest:       boolean
  onQuantityChange: (q: number) => void
  onLogMeal:     (mealType: string) => void
  onClearLog:    () => void
}

export function ProductCard({
  product, quantity, loggedMeal, isGuest,
  onQuantityChange, onLogMeal, onClearLog,
}: ProductCardProps) {
  return (
    <div className="rounded-2xl overflow-hidden mb-4" style={{ background: 'var(--card)', border: '1px solid var(--card-border)' }}>
      {product.image_url && (
        <div className="relative w-full h-48" style={{ background: 'color-mix(in oklab, var(--card), black 4%)' }}>
          <Image src={product.image_url} alt={product.name} fill
            className="object-contain p-4" sizes="(max-width: 520px) 100vw, 520px" />
        </div>
      )}

      <div className="p-5">
        {product.source && sourceBadge[product.source] && (
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium border mb-3 ${sourceBadge[product.source].className}`}>
            {sourceBadge[product.source].label}
          </span>
        )}

        <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}>{product.name}</h2>
        {product.brand && <p className="text-sm mb-4" style={{ color: 'var(--muted-2)' }}>{product.brand}</p>}

        {product._photo_extras && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {product._photo_extras.mrp && (
              <div className="p-3 rounded-xl" style={{ background: 'color-mix(in oklab, var(--card), black 4%)' }}>
                <p className="text-[11px]" style={{ color: 'var(--muted-2)' }}>MRP</p>
                <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>₹{product._photo_extras.mrp}</p>
              </div>
            )}
            {product._photo_extras.net_weight && (
              <div className="p-3 rounded-xl" style={{ background: 'color-mix(in oklab, var(--card), black 4%)' }}>
                <p className="text-[11px]" style={{ color: 'var(--muted-2)' }}>Net Weight</p>
                <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{product._photo_extras.net_weight}g</p>
              </div>
            )}
            {product._photo_extras.fssai && (
              <div className="col-span-2 p-3 rounded-xl" style={{ background: 'color-mix(in oklab, var(--card), black 4%)' }}>
                <p className="text-[11px]" style={{ color: 'var(--muted-2)' }}>FSSAI License</p>
                <p className="text-xs font-mono" style={{ color: 'var(--moss)' }}>{product._photo_extras.fssai}</p>
              </div>
            )}
            {product._photo_extras.certifications && product._photo_extras.certifications.length > 0 && (
              <div className="col-span-2 p-3 rounded-xl" style={{ background: 'color-mix(in oklab, var(--card), black 4%)' }}>
                <p className="text-[11px] mb-2" style={{ color: 'var(--muted-2)' }}>Certifications</p>
                <div className="flex gap-1.5 flex-wrap">
                  {product._photo_extras.certifications.map((c, i) => (
                    <span key={i} className="chip-safe border">{c}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            { label: 'Calories', value: Math.round(product.nutrition?.calories || 0), unit: 'kcal' },
            { label: 'Protein',  value: product.nutrition?.protein ?? 0,              unit: 'g'    },
            { label: 'Carbs',    value: product.nutrition?.carbs   ?? 0,              unit: 'g'    },
            { label: 'Fat',      value: product.nutrition?.fat     ?? 0,              unit: 'g'    },
          ].map(item => (
            <div key={item.label} className="rounded-xl p-2.5 text-center" style={{ background: 'color-mix(in oklab, var(--card), black 4%)', border: '1px solid rgba(61,92,46,0.08)' }}>
              <p className="text-sm font-bold" style={{ color: 'var(--moss)' }}>{item.value}</p>
              <p className="text-[10px]" style={{ color: 'var(--muted-2)' }}>{item.unit}</p>
              <p className="text-[10px]" style={{ color: 'var(--muted-2)' }}>{item.label}</p>
            </div>
          ))}
        </div>

        {(product.nutrition?.sugar != null || product.nutrition?.sodium != null || product.nutrition?.fiber != null) && (
          <div className="flex gap-4 mb-4 flex-wrap">
            {product.nutrition?.sugar  != null && <p className="text-xs" style={{ color: 'var(--muted-2)' }}>Sugar <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{product.nutrition.sugar}g</span></p>}
            {product.nutrition?.sodium != null && <p className="text-xs" style={{ color: 'var(--muted-2)' }}>Sodium <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{product.nutrition.sodium}mg</span></p>}
            {product.nutrition?.fiber  != null && <p className="text-xs" style={{ color: 'var(--muted-2)' }}>Fiber <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{product.nutrition.fiber}g</span></p>}
          </div>
        )}

        <p className="text-[11px] mb-4" style={{ color: 'var(--muted-2)' }}>Per 100g · Source: {product.source}</p>

        <div className="mb-4">
          <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--foreground)' }}>How much did you eat?</label>
          <div className="flex items-center gap-2">
            <button onClick={() => onQuantityChange(Math.max(10, quantity - 10))}
              className="w-10 h-10 rounded-xl text-lg font-bold flex items-center justify-center transition-colors"
              style={{ background: 'color-mix(in oklab, var(--card), black 4%)', border: '1px solid var(--card-border)', color: 'var(--foreground)' }}>−</button>
            <input type="number" value={quantity}
              onChange={e => onQuantityChange(Math.max(1, parseInt(e.target.value) || 1))}
              className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold outline-none transition-colors"
              style={{ background: 'color-mix(in oklab, var(--card), black 4%)', border: '1px solid var(--card-border)', color: 'var(--foreground)' }} />
            <button onClick={() => onQuantityChange(Math.min(2000, quantity + 10))}
              className="w-10 h-10 rounded-xl text-lg font-bold flex items-center justify-center transition-colors"
              style={{ background: 'color-mix(in oklab, var(--card), black 4%)', border: '1px solid var(--card-border)', color: 'var(--foreground)' }}>+</button>
            <span className="text-sm font-medium" style={{ color: 'var(--muted-2)' }}>g</span>
          </div>
          <p className="text-[11px] mt-1.5 text-center" style={{ color: 'var(--muted-2)' }}>
            = {Math.round((product.nutrition?.calories || 0) * quantity / 100)} kcal total
          </p>
        </div>

        {loggedMeal ? (
          <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(61,92,46,0.04)', border: '1px solid rgba(61,92,46,0.15)' }}>
            <p className="text-sm font-semibold" style={{ color: 'var(--moss)' }}>✅ Logged {quantity}g as {loggedMeal}!</p>
            <button onClick={onClearLog} className="text-xs underline mt-1" style={{ color: 'var(--muted-2)' }}>
              Log again with different meal type
            </button>
          </div>
        ) : (
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Log as:</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { type: 'breakfast', icon: '🌅' },
                { type: 'lunch',     icon: '☀️' },
                { type: 'dinner',    icon: '🌙' },
                { type: 'snack',     icon: '🍎' },
              ].map(m => (
                <button key={m.type} onClick={() => onLogMeal(m.type)}
                  className="py-2.5 rounded-xl text-xs font-semibold capitalize transition-all active:scale-95"
                  style={{ background: 'color-mix(in oklab, var(--card), black 4%)', border: '1px solid rgba(61,92,46,0.2)', color: 'var(--moss)' }}>
                  {m.icon} {m.type}
                </button>
              ))}
            </div>
            {isGuest && (
              <p className="text-xs text-center mt-2" style={{ color: 'var(--muted-2)' }}>
                <a href="/auth/signin" className="underline font-medium" style={{ color: 'var(--moss)' }}>Sign in</a> to save meal logs
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
