"use client";

import { cn } from "@/lib/utils";

export function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={cn("skeleton", className)} style={style} />;
}

export function SkeletonCard() {
  return (
    <div className="card stack--sm">
      <div className="row--md">
        <Skeleton className="rounded-md" style={{ width: 52, height: 52 }} />
        <div className="flex-1 stack--sm">
          <Skeleton className="h-3.5 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonRing({ size = 64 }: { size?: number }) {
  return <Skeleton className="rounded-full" style={{ width: size, height: size }} />;
}

export function SkeletonDashboard() {
  return (
    <div className="stack">
      <div className="row--lg">
        <SkeletonRing size={80} />
        <div className="flex-1 stack--sm">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <div className="grid-2">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}

export function SkeletonMealItem() {
  return (
    <div className="row--md">
      <Skeleton className="rounded-md" style={{ width: 44, height: 44 } as React.CSSProperties} />
      <div className="flex-1 stack--sm">
        <Skeleton className="h-3.5 w-2/3" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  );
}
