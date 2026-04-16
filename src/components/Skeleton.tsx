// src/components/Skeleton.tsx
export function SkeletonDashboard() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header skeleton */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-500 px-4 pt-14 pb-20">
        <div className="h-4 w-32 bg-white/20 rounded mb-2" />
        <div className="h-7 w-48 bg-white/20 rounded" />
      </div>
      <div className="px-4 -mt-12 space-y-4">
        {/* Calorie ring skeleton */}
        <div className="rounded-2xl p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex flex-col items-center py-4">
            <div className="w-36 h-36 rounded-full border-8 border-gray-100 dark:border-gray-800 animate-pulse" />
            <div className="h-3 w-24 bg-gray-100 dark:bg-gray-800 rounded mt-4 animate-pulse" />
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            {[1, 2, 3].map(i => (
              <div key={i} className="text-center">
                <div className="h-6 w-12 mx-auto bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                <div className="h-3 w-10 mx-auto bg-gray-100 dark:bg-gray-800 rounded mt-1 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
        {/* Card skeletons */}
        {[1, 2, 3].map(i => (
          <div key={i} className="rounded-2xl p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm h-32 animate-pulse" />
        ))}
      </div>
    </div>
  )
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-2xl p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm animate-pulse ${className}`}>
      <div className="h-4 w-1/3 bg-gray-100 dark:bg-gray-800 rounded mb-4" />
      <div className="h-20 bg-gray-50 dark:bg-gray-800 rounded" />
    </div>
  )
}