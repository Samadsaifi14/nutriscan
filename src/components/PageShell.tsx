import TopBar from './TopBar'

type PageVariant = 'default' | 'bare' | 'fullscreen' | 'no-header'

interface PageShellProps {
  children:     React.ReactNode
  variant?:     PageVariant
  title?:       string
  left?:        React.ReactNode
  right?:       React.ReactNode
  showBack?:    boolean
  noBorder?:    boolean
  className?:   string
  noMaxWidth?:  boolean
}

export default function PageShell({
  children,
  variant    = 'default',
  title,
  left,
  right,
  showBack   = false,
  noBorder   = false,
  className  = '',
  noMaxWidth = false,
}: PageShellProps) {

  if (variant === 'fullscreen') {
    return <div className="scan-overlay">{children}</div>
  }

  if (variant === 'bare') {
    return (
      <main className="page--bare" style={{ paddingBottom: 'var(--safe-bottom)' }}>
        <div className={`page-content ${noMaxWidth ? 'max-w-none' : ''} ${className}`}>
          {children}
        </div>
      </main>
    )
  }

  if (variant === 'no-header') {
    return (
      <main className="page--no-header">
        <div className={`page-content ${noMaxWidth ? 'max-w-none' : ''} ${className}`}>
          {children}
        </div>
      </main>
    )
  }

  return (
    <>
      <TopBar title={title} left={left} right={right} showBack={showBack} noBorder={noBorder} />
      <main className={`page ${className}`}>
        <div className={`page-content ${noMaxWidth ? 'max-w-none' : ''}`}>
          {children}
        </div>
      </main>
    </>
  )
}
