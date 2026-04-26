// src/components/results/ProductCard.tsx
"use client"
import Image from 'next/image'
import { Product } from '@/types/scanResult'

const sourceBadge: Record<string, { label: string; className: string }> = {
  cache:           { label: '✅ In our database',     className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  open_food_facts: { label: '🌐 Open Food Facts',    className: 'bg-purple-500/10 text-purple-400 border-purple-500/20'   },
  upc_item_db:     { label: '🔍 UPC Database',        className: 'bg-sky-500/10 text-sky-400 border-sky-500/20'           },
  gemini_vision:   { label: '🇮🇳 Added to Indian DB', className: 'bg-amber-500/10 text-amber-400 border-amber-500/20'     },
  gemini_photo:    { label: '📸 Read from photo',     className: 'bg-sky-500/10 text-sky-400 border-sky-500/20'           },
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
    <div className="bg-[#161a20] border border-[#2a3545] rounded-2xl overflow-hidden mb-4">

      {product.image_url && (
        <div className="relative w-full h-48 bg-[#1e242d]">
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

        <h2 className="text-lg font-bold text-[#f0f4f8] mb-1">{product.name}</h2>
        {product.brand && <p className="text-sm text-[#7a8fa6] mb-4">{product.brand}</p>}

        {/* Photo extras */}
        {product._photo_extras && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {product._photo_extras.mrp && (
              <div className="p-3 bg-[#1e242d] rounded-xl">
                <p className="text-[11px] text-[#7a8fa6]">MRP</p>
                <p className="text-sm font-semibold text-[#f0f4f8]">₹{product._photo_extras.mrp}</p>
              </div>
            )}
            {product._photo_extras.net_weight && (
              <div className="p-3 bg-[#1e242d] rounded-xl">
                <p className="text-[11px] text-[#7a8fa6]">Net Weight</p>
                <p className="text-sm font-semibold text-[#f0f4f8]">{product._photo_extras.net_weight}g</p>
              </div>
            )}
            {product._photo_extras.fssai && (
              <div className="col-span-2 p-3 bg-[#1e242d] rounded-xl">
                <p className="text-[11px] text-[#7a8fa6]">FSSAI License</p>
                <p className="text-xs font-mono text-emerald-400">{product._photo_extras.fssai}</p>
              </div>
            )}
            {product._photo_extras.certifications && product._photo_extras.certifications.length > 0 && (
              <div className="col-span-2 p-3 bg-[#1e242d] rounded-xl">
                <p className="text-[11px] text-[#7a8fa6] mb-2">Certifications</p>
                <div className="flex gap-1.5 flex-wrap">
                  {product._photo_extras.certifications.map((c, i) => (
                    <span key={i} className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] rounded-full">{c}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Macros */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            { label: 'Calories', value: Math.round(product.nutrition?.calories || 0), unit: 'kcal' },
            { label: 'Protein',  value: product.nutrition?.protein ?? 0,              unit: 'g'    },
            { label: 'Carbs',    value: product.nutrition?.carbs   ?? 0,              unit: 'g'    },
            { label: 'Fat',      value: product.nutrition?.fat     ?? 0,              unit: 'g'    },
          ].map(item => (
            <div key={item.label} className="bg-[#1e242d] border border-emerald-500/10 rounded-xl p-2.5 text-center">
              <p className="text-sm font-bold text-emerald-400">{item.value}</p>
              <p className="text-[10px] text-[#7a8fa6]">{item.unit}</p>
              <p className="text-[10px] text-[#7a8fa6]">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Sugar / sodium / fiber */}
        {(product.nutrition?.sugar != null || product.nutrition?.sodium != null || product.nutrition?.fiber != null) && (
          <div className="flex gap-4 mb-4 flex-wrap">
            {product.nutrition?.sugar  != null && <p className="text-xs text-[#7a8fa6]">Sugar <span className="font-semibold text-[#f0f4f8]">{product.nutrition.sugar}g</span></p>}
            {product.nutrition?.sodium != null && <p className="text-xs text-[#7a8fa6]">Sodium <span className="font-semibold text-[#f0f4f8]">{product.nutrition.sodium}mg</span></p>}
            {product.nutrition?.fiber  != null && <p className="text-xs text-[#7a8fa6]">Fiber <span className="font-semibold text-[#f0f4f8]">{product.nutrition.fiber}g</span></p>}
          </div>
        )}

        <p className="text-[11px] text-[#7a8fa6] mb-4">Per 100g · Source: {product.source}</p>

        {/* Quantity */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-[#f0f4f8] mb-2">How much did you eat?</label>
          <div className="flex items-center gap-2">
            <button onClick={() => onQuantityChange(Math.max(10, quantity - 10))}
              className="w-10 h-10 rounded-xl bg-[#1e242d] border border-[#2a3545] hover:border-emerald-500/40 text-lg font-bold text-[#f0f4f8] transition-colors flex items-center justify-center">−</button>
            <input type="number" value={quantity}
              onChange={e => onQuantityChange(Math.max(1, parseInt(e.target.value) || 1))}
              className="flex-1 text-center py-2.5 rounded-xl bg-[#1e242d] border border-[#2a3545] focus:border-emerald-500/60 text-[#f0f4f8] text-sm font-semibold outline-none transition-colors" />
            <button onClick={() => onQuantityChange(Math.min(2000, quantity + 10))}
              className="w-10 h-10 rounded-xl bg-[#1e242d] border border-[#2a3545] hover:border-emerald-500/40 text-lg font-bold text-[#f0f4f8] transition-colors flex items-center justify-center">+</button>
            <span className="text-sm text-[#7a8fa6] font-medium">g</span>
          </div>
          <p className="text-[11px] text-[#7a8fa6] mt-1.5 text-center">
            = {Math.round((product.nutrition?.calories || 0) * quantity / 100)} kcal total
          </p>
        </div>

        {/* Meal log */}
        {loggedMeal ? (
          <div className="p-3 rounded-xl text-center bg-emerald-500/5 border border-emerald-500/20">
            <p className="text-sm font-semibold text-emerald-400">✅ Logged {quantity}g as {loggedMeal}!</p>
            <button onClick={onClearLog} className="text-xs text-[#7a8fa6] underline mt-1">
              Log again with different meal type
            </button>
          </div>
        ) : (
          <div>
            <p className="text-xs font-semibold text-[#f0f4f8] mb-2">Log as:</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { type: 'breakfast', icon: '🌅' },
                { type: 'lunch',     icon: '☀️' },
                { type: 'dinner',    icon: '🌙' },
                { type: 'snack',     icon: '🍎' },
              ].map(m => (
                <button key={m.type} onClick={() => onLogMeal(m.type)}
                  className="py-2.5 rounded-xl text-xs font-semibold capitalize bg-[#1e242d] border border-emerald-500/25 text-emerald-400 hover:border-emerald-500/50 hover:bg-[#252c38] transition-all active:scale-95">
                  {m.icon} {m.type}
                </button>
              ))}
            </div>
            {isGuest && (
              <p className="text-xs text-center text-[#7a8fa6] mt-2">
                <a href="/auth/signin" className="text-emerald-400 underline font-medium">Sign in</a> to save meal logs
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}