export type IngredientStatus = 'harmful' | 'safe' | 'unknown'

export function IngredientChip({ label, status }: { label: string; status: IngredientStatus }): JSX.Element {
  const classByStatus: Record<IngredientStatus, string> = {
    harmful: 'bg-red-500/20 text-red-400 border border-red-500/30',
    safe: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
    unknown: 'bg-gray-700/40 text-gray-200 border border-gray-600',
  }
  return (
    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${classByStatus[status]}`}>
      {label}
    </span>
  )
}

export default IngredientChip
