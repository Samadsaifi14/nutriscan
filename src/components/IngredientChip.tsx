export type IngredientStatus = 'safe' | 'caution' | 'danger' | 'neutral'

const statusLabels: Record<IngredientStatus, string> = {
  safe: '\u2713',
  caution: '\u0021',
  danger: '\u2715',
  neutral: '\u00B7',
}

export function IngredientChip({ label, status }: { label: string; status: IngredientStatus }): JSX.Element {
  return (
    <span className={`chip chip-${status}`}>
      <span aria-hidden="true" className="text-[11px] font-bold">{statusLabels[status]}</span>
      {label}
    </span>
  )
}

export default IngredientChip
