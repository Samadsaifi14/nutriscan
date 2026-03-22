export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm animate-pulse">
      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded-full w-1/3 mb-4" />
      <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded-full w-2/3 mb-2" />
      <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full w-1/2" />
    </div>
  )
}

export function SkeletonRing() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm flex flex-col items-center animate-pulse">
      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded-full w-1/2 mb-4" />
      <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-slate-700" />
      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded-full w-2/3 mt-4" />
    </div>
  )
}

export function SkeletonMealItem() {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl animate-pulse">
      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-700 flex-shrink-0" />
      <div className="flex-1">
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded-full w-3/4 mb-2" />
        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full w-1/2" />
      </div>
      <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded-full w-16" />
    </div>
  )
}

export function SkeletonDashboard() {
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="h-7 bg-gray-200 dark:bg-slate-700 rounded-full w-40 mb-2 animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded-full w-28 animate-pulse" />
        </div>
        <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded-xl w-20 animate-pulse" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <SkeletonRing />
        <SkeletonCard />
      </div>

      <SkeletonCard />

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded-full w-1/3 animate-pulse" />
        <SkeletonMealItem />
        <SkeletonMealItem />
        <SkeletonMealItem />
      </div>
    </div>
  )
}
