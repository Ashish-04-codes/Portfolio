/**
 * Admin Skeleton Components
 * Newspaper-themed loading skeleton UI for admin pages
 */

import React from 'react';

const shimmer = 'animate-pulse bg-ink/10';

/**
 * Skeleton bar — a single pulsing line
 */
const SkeletonBar: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`${shimmer} rounded ${className}`} />
);

/**
 * Stat Card Skeleton — for dashboard stat cards
 */
export const StatCardSkeleton: React.FC = () => (
    <div className="p-6 border-2 border-ink/20 bg-newsprint">
        <div className="flex items-center justify-between mb-3">
            <SkeletonBar className="w-8 h-8" />
            <SkeletonBar className="w-12 h-8" />
        </div>
        <SkeletonBar className="w-20 h-3 mt-2" />
    </div>
);

/**
 * Table Skeleton — for list pages (projects, blogs, skills)
 */
export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
    <div className="border-2 border-ink/20 bg-newsprint">
        {/* Header */}
        <div className="flex gap-6 px-6 py-3 border-b-2 border-ink/10">
            <SkeletonBar className="w-1/3 h-4" />
            <SkeletonBar className="w-1/6 h-4" />
            <SkeletonBar className="w-1/6 h-4" />
            <SkeletonBar className="w-1/6 h-4" />
        </div>
        {/* Rows */}
        {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex gap-6 px-6 py-4 border-b border-ink/5">
                <div className="w-1/3 space-y-2">
                    <SkeletonBar className="w-full h-4" />
                    <SkeletonBar className="w-2/3 h-3" />
                </div>
                <SkeletonBar className="w-1/6 h-4" />
                <SkeletonBar className="w-1/6 h-4" />
                <div className="w-1/6 flex gap-2">
                    <SkeletonBar className="w-8 h-8" />
                    <SkeletonBar className="w-8 h-8" />
                </div>
            </div>
        ))}
    </div>
);

/**
 * Form Skeleton — for profile/config editor pages
 */
export const FormSkeleton: React.FC = () => (
    <div className="space-y-6">
        {/* Card skeleton */}
        {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="border-2 border-ink/20 bg-newsprint p-6 space-y-4">
                <div className="space-y-2 mb-4">
                    <SkeletonBar className="w-40 h-5" />
                    <SkeletonBar className="w-60 h-3" />
                </div>
                <SkeletonBar className="w-full h-10" />
                <SkeletonBar className="w-full h-10" />
                <div className="grid grid-cols-2 gap-4">
                    <SkeletonBar className="w-full h-10" />
                    <SkeletonBar className="w-full h-10" />
                </div>
                <SkeletonBar className="w-full h-24" />
            </div>
        ))}
    </div>
);

/**
 * Dashboard Skeleton — full dashboard skeleton
 */
export const DashboardSkeleton: React.FC = () => (
    <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
            <SkeletonBar className="w-48 h-8" />
            <SkeletonBar className="w-64 h-4" />
        </div>
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <StatCardSkeleton key={i} />
            ))}
        </div>
        {/* Quick Actions */}
        <div className="border-2 border-ink/20 bg-newsprint p-6">
            <SkeletonBar className="w-32 h-5 mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonBar key={i} className="w-full h-10" />
                ))}
            </div>
        </div>
        {/* Activity */}
        <div className="border-2 border-ink/20 bg-newsprint p-6 space-y-3">
            <SkeletonBar className="w-40 h-5 mb-4" />
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                    <SkeletonBar className="w-4 h-4 mt-1" />
                    <div className="flex-1 space-y-2">
                        <SkeletonBar className="w-3/4 h-4" />
                        <SkeletonBar className="w-24 h-3" />
                    </div>
                </div>
            ))}
        </div>
    </div>
);
