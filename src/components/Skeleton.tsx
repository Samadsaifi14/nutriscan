export function SkeletonCard() {
  return (
    <div className="card-3d p-5 space-y-4">
      <div className="skeleton h-5 w-2/3" />
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-4/5" />
      <div className="flex gap-2 pt-1">
        <div className="skeleton h-7 w-16 rounded-pill" />
        <div className="skeleton h-7 w-20 rounded-pill" />
      </div>
    </div>
  )
}

export function SkeletonRing() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="skeleton rounded-full" style={{ width: 120, height: 120 }} />
      <div className="skeleton h-4 w-24 rounded-md" />
    </div>
  )
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-4 pb-nav">
      <div className="skeleton h-32 rounded-xl" />
      <div className="grid grid-cols-2 gap-3">
        <div className="skeleton h-24 rounded-xl" />
        <div className="skeleton h-24 rounded-xl" />
      </div>
      <div className="skeleton h-48 rounded-xl" />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  )
}

export function SkeletonMealItem() {
  return (
    <div className="flex items-center gap-3 p-4">
      <div className="skeleton rounded-lg flex-shrink-0" style={{ width: 48, height: 48 }} />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-1/2" />
      </div>
      <div className="skeleton h-8 w-16 rounded-pill" />
    </div>
  )
}
