import React from 'react';

interface SkeletonProps {
    /** Visual variant of the skeleton */
    variant?: 'text' | 'headline' | 'image' | 'card' | 'circle';
    /** Width (CSS value) — defaults to 100% */
    width?: string;
    /** Height (CSS value) — auto-calculated per variant if not set */
    height?: string;
    /** Number of text lines to render (only for 'text' variant) */
    lines?: number;
    /** Additional CSS classes */
    className?: string;
}

/**
 * Newspaper-themed loading skeleton with shimmer animation.
 * Provides visual feedback while content is loading.
 */
export const Skeleton: React.FC<SkeletonProps> = ({
    variant = 'text',
    width,
    height,
    lines = 3,
    className = '',
}) => {
    const baseClasses =
        'animate-pulse bg-gradient-to-r from-newsprint-dark/30 via-newsprint-dark/50 to-newsprint-dark/30 bg-[length:200%_100%] rounded';

    const variantStyles: Record<string, string> = {
        text: 'h-4 rounded-sm',
        headline: 'h-8 rounded-sm',
        image: 'h-48 rounded-none border border-ink/10',
        card: 'h-64 rounded-none border border-ink/10 p-4',
        circle: 'rounded-full',
    };

    const style: React.CSSProperties = {
        width: width || '100%',
        ...(height ? { height } : {}),
    };

    if (variant === 'circle') {
        const size = width || '48px';
        style.width = size;
        style.height = size;
    }

    // Render multiple lines for text variant
    if (variant === 'text' && lines > 1) {
        return (
            <div className={`space-y-2 ${className}`} role="status" aria-label="Loading content">
                {Array.from({ length: lines }).map((_, i) => (
                    <div
                        key={i}
                        className={`${baseClasses} ${variantStyles.text}`}
                        style={{
                            ...style,
                            // Make last line shorter for a natural text look
                            width: i === lines - 1 ? '60%' : style.width,
                        }}
                    />
                ))}
                <span className="sr-only">Loading...</span>
            </div>
        );
    }

    return (
        <div
            className={`${baseClasses} ${variantStyles[variant] || ''} ${className}`}
            style={style}
            role="status"
            aria-label="Loading content"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
};

/**
 * Pre-built skeleton layout for a newspaper article card.
 * Use this in FrontPage, EditorialPage, etc.
 */
export const ArticleCardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`space-y-3 p-4 border border-ink/10 ${className}`} role="status" aria-label="Loading article">
        <Skeleton variant="image" height="180px" />
        <Skeleton variant="headline" width="80%" />
        <Skeleton variant="text" lines={3} />
        <div className="flex gap-2 items-center pt-2">
            <Skeleton variant="circle" width="24px" />
            <Skeleton variant="text" lines={1} width="40%" />
        </div>
        <span className="sr-only">Loading article...</span>
    </div>
);

/**
 * Pre-built skeleton layout for a page with a headline + body.
 */
export const PageSkeleton: React.FC = () => (
    <div className="max-w-4xl mx-auto p-6 space-y-6" role="status" aria-label="Loading page">
        <Skeleton variant="headline" width="60%" />
        <Skeleton variant="text" lines={2} width="40%" />
        <div className="border-t border-b border-ink/20 py-4 my-4">
            <Skeleton variant="text" lines={6} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ArticleCardSkeleton />
            <ArticleCardSkeleton />
        </div>
        <span className="sr-only">Loading page...</span>
    </div>
);
