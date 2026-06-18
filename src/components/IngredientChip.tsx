export type IngredientStatus = 'harmful' | 'safe' | 'unknown'

export function IngredientChip({ label, status }: { label: string; status: IngredientStatus }): JSX.Element {
  const classByStatus: Record<IngredientStatus, string> = {
    harmful: 'chip-bad border',
    safe: 'chip-safe border border-transparent',
    unknown: 'bg-[color-mix(in_oklab,var(--muted-2),transparent_85%)] text-[var(--bark-mid)] dark:text-[var(--cream)] border border-[color-mix(in_oklab,var(--muted-2),transparent_70%)]',
  }
  return (
    <span className={`${classByStatus[status]}`}>
      {label}
    </span>
  )
}

export default IngredientChip
