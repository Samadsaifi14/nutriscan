export function SkeletonCard() {
  return (
    <div className="product-card">
      <div className="skeleton" style={{ width: 56, height: 56, borderRadius: 12 }} />
      <div className="stack--sm flex-1">
        <div className="skeleton" style={{ height: 14, width: '70%' }} />
        <div className="skeleton" style={{ height: 11, width: '40%' }} />
      </div>
    </div>
  )
}

export function SkeletonRing({ size = 64 }: { size?: number }) {
  return <div className="skeleton" style={{ width: size, height: size, borderRadius: '9999px' }} />
}

export function SkeletonDashboard() {
  return (
    <div className="stack--md">
      <div className="row--md">
        <SkeletonRing size={80} />
        <div className="stack--sm flex-1">
          <div className="skeleton" style={{ height: 16, width: '60%' }} />
          <div className="skeleton" style={{ height: 12, width: '40%' }} />
        </div>
      </div>
      <div className="grid-2">
        <div className="skeleton" style={{ height: 80, borderRadius: 14 }} />
        <div className="skeleton" style={{ height: 80, borderRadius: 14 }} />
      </div>
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  )
}

export function SkeletonMealItem() {
  return (
    <div className="row--md">
      <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 12 }} />
      <div className="stack--sm flex-1">
        <div className="skeleton" style={{ height: 12, width: '55%' }} />
        <div className="skeleton" style={{ height: 10, width: '30%' }} />
      </div>
    </div>
  )
}
