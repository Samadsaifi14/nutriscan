export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="page px-page" style={{ paddingTop: 'calc(var(--header-offset) + 24px)', paddingBottom: 'calc(var(--footer-offset) + 24px)' }}>
      <a
        href="/dashboard"
        className="row--sm"
        style={{ color: 'var(--clay)', fontSize: 13, fontWeight: 600, marginBottom: 24, textDecoration: 'none' }}
      >
        &larr; Back to Dashboard
      </a>
      {children}
    </div>
  )
}
