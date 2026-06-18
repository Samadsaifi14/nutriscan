export function SkeletonCard() {
  return (
    <div className="rounded-2xl p-5 border animate-pulse" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
      <div className="h-3 rounded-full w-1/3 mb-4 shimmer" />
      <div className="h-9 rounded-full w-2/3 mb-2 shimmer" />
      <div className="h-3 rounded-full w-1/2 shimmer" />
    </div>
  )
}

export function SkeletonRing() {
  return (
    <div className="rounded-2xl p-5 border flex flex-col items-center animate-pulse" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
      <div className="h-3 rounded-full w-1/2 mb-5 shimmer" />
      <div className="w-32 h-32 rounded-full shimmer" />
      <div className="h-3 rounded-full w-2/3 mt-4 shimmer" />
    </div>
  )
}

export function SkeletonMealItem() {
  return (
    <div className="flex items-center gap-3 p-4 rounded-2xl animate-pulse" style={{ background: 'color-mix(in oklab, var(--card), transparent 30%)' }}>
      <div className="w-11 h-11 rounded-2xl shimmer flex-shrink-0" />
      <div className="flex-1">
        <div className="h-4 rounded-full w-3/4 mb-2 shimmer" />
        <div className="h-3 rounded-full w-1/2 shimmer" />
      </div>
      <div className="h-5 rounded-full w-14 shimmer" />
    </div>
  )
}

export function SkeletonDashboard() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <div className="px-5 pt-12 pb-8 animate-pulse" style={{ background: 'var(--bark)' }}>
        <div className="h-4 rounded-full w-32 mb-2 shimmer" style={{ background: 'rgba(250,247,242,0.2)' }} />
        <div className="h-8 rounded-full w-40 mb-1 shimmer" style={{ background: 'rgba(250,247,242,0.2)' }} />
        <div className="h-3 rounded-full w-48 mb-5 shimmer" style={{ background: 'rgba(250,247,242,0.1)' }} />
        <div className="h-16 rounded-2xl shimmer" style={{ background: 'rgba(250,247,242,0.1)' }} />
      </div>

      <div className="px-4 py-5 max-w-2xl mx-auto space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {[1,2,3].map(i => (
            <div key={i} className="rounded-2xl p-4 border animate-pulse" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
              <div className="h-8 rounded-full mb-2 shimmer" />
              <div className="h-3 rounded-full w-2/3 mx-auto shimmer" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <SkeletonRing />
          <SkeletonCard />
        </div>
        <SkeletonCard />
        <div className="rounded-2xl p-5 border space-y-3" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
          <div className="h-5 rounded-full w-1/3 animate-pulse shimmer" />
          <SkeletonMealItem />
          <SkeletonMealItem />
          <SkeletonMealItem />
        </div>
      </div>
    </div>
  )
}
