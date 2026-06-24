interface PillProps {
  label: string
  active?: boolean
  color?: string
  bg?: string
  className?: string
}

export default function Pill({ label, active, color, bg, className = '' }: PillProps) {
  return (
    <span style={{
      padding: '2px 7px',
      borderRadius: 20,
      background: bg || (active ? 'var(--clay)' : 'var(--surface-3)'),
      color: color || (active ? '#fff' : 'var(--sand)'),
      fontSize: 6.5,
      fontWeight: active ? 700 : 500,
      border: '0.5px solid var(--border-2)',
      whiteSpace: 'nowrap',
      display: 'inline-flex',
      alignItems: 'center',
    }} className={className}>
      {label}
    </span>
  )
}
