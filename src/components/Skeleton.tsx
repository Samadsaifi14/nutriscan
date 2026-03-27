export function SkeletonCard() {
  return (
    <div className="bg-[var(--card)] rounded-2xl p-5 border border-[var(--card-border)] animate-pulse">
      <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full w-1/3 mb-4" />
      <div className="h-9 bg-gray-200 dark:bg-slate-700 rounded-full w-2/3 mb-2" />
      <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full w-1/2" />
    </div>
  )
}

export function SkeletonRing() {
  return (
    <div className="bg-[var(--card)] rounded-2xl p-5 border border-[var(--card-border)] flex flex-col items-center animate-pulse">
      <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full w-1/2 mb-5" />
      <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-slate-700" />
      <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full w-2/3 mt-4" />
    </div>
  )
}

export function SkeletonMealItem() {
  return (
    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl animate-pulse">
      <div className="w-11 h-11 rounded-2xl bg-gray-200 dark:bg-slate-700 flex-shrink-0" />
      <div className="flex-1">
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded-full w-3/4 mb-2" />
        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full w-1/2" />
      </div>
      <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded-full w-14" />
    </div>
  )
}

export function SkeletonDashboard() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header skeleton */}
      <div className="px-5 pt-12 pb-8 animate-pulse"
        style={{ background: 'linear-gradient(135deg, #059669 0%, #0ea5e9 100%)' }}>
        <div className="h-4 bg-white/20 rounded-full w-32 mb-2" />
        <div className="h-8 bg-white/20 rounded-full w-40 mb-1" />
        <div className="h-3 bg-white/10 rounded-full w-48 mb-5" />
        <div className="h-16 bg-white/10 rounded-2xl" />
      </div>

      <div className="px-4 py-5 max-w-2xl mx-auto space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {[1,2,3].map(i => (
            <div key={i} className="bg-[var(--card)] rounded-2xl p-4 border border-[var(--card-border)] animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded-full mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full w-2/3 mx-auto" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <SkeletonRing />
          <SkeletonCard />
        </div>
        <SkeletonCard />
        <div className="bg-[var(--card)] rounded-2xl p-5 border border-[var(--card-border)] space-y-3">
          <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded-full w-1/3 animate-pulse" />
          <SkeletonMealItem />
          <SkeletonMealItem />
          <SkeletonMealItem />
        </div>
      </div>
    </div>
  )
}
