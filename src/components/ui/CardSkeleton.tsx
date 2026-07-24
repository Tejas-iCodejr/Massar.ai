import React from 'react';

export function CardSkeleton() {
  return (
    <div className="bg-white/80 backdrop-blur-md border border-white/90 rounded-[32px] p-6 shadow-sm animate-pulse space-y-4">
      {/* Top Emblem & Badge Skeleton */}
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 rounded-2xl bg-stone-200/80" />
        <div className="w-20 h-6 rounded-full bg-stone-200/60" />
      </div>

      {/* Title & Subtitle Skeleton */}
      <div className="space-y-2 pt-2">
        <div className="h-6 bg-stone-200/90 rounded-md w-3/4" />
        <div className="h-4 bg-stone-200/60 rounded-md w-1/2" />
      </div>

      {/* Details Meta Lines Skeleton */}
      <div className="space-y-1.5 pt-2">
        <div className="h-3.5 bg-stone-200/60 rounded w-full" />
        <div className="h-3.5 bg-stone-200/50 rounded w-4/5" />
      </div>

      {/* Bottom Button Skeleton */}
      <div className="pt-4 border-t border-hairline-mist/50 flex items-center justify-between">
        <div className="w-24 h-4 bg-stone-200/60 rounded" />
        <div className="w-28 h-9 bg-stone-200/80 rounded-full" />
      </div>
    </div>
  );
}

export function GridSkeletonList({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
}
