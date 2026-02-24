import React from 'react';

const shimmer = 'animate-pulse bg-ink/10';

export const SkeletonBar: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`${shimmer} rounded ${className}`} />
);

export const FrontPageSkeleton: React.FC = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 animate-pulse">
        {/* Left Sidebar */}
        <aside className="lg:col-span-3 space-y-8 lg:border-r border-ink lg:pr-8">
            <div className="border border-ink p-4 bg-surface shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] dark:shadow-[4px_4px_0px_0px_rgba(244,241,234,0.5)]">
                <SkeletonBar className="w-full h-4 mb-4" />
                <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex justify-between items-center">
                            <SkeletonBar className="w-1/2 h-4" />
                            <SkeletonBar className="w-1/4 h-4" />
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <SkeletonBar className="w-1/3 h-4 mb-3" />
                <div className="space-y-2">
                    {[...Array(4)].map((_, i) => (
                        <SkeletonBar key={i} className="w-full h-5" />
                    ))}
                </div>
            </div>
        </aside>

        {/* Main Feature Story */}
        <article className="col-span-full lg:col-span-6 border-r-0 lg:border-r border-ink p-8 md:p-12">
            <div className="text-center max-w-4xl mx-auto mb-8">
                <SkeletonBar className="w-32 h-4 mx-auto mb-4" />
                <SkeletonBar className="w-full h-16 mx-auto mb-4" />
                <SkeletonBar className="w-3/4 h-16 mx-auto mb-6" />
                <SkeletonBar className="w-1/2 h-3 mx-auto" />
            </div>
            <div className="mb-8 border border-ink p-1 bg-surface">
                <SkeletonBar className="w-full h-64 md:h-80" />
            </div>
            <div className="space-y-4">
                <SkeletonBar className="w-full h-4" />
                <SkeletonBar className="w-full h-4" />
                <SkeletonBar className="w-3/4 h-4" />
                <SkeletonBar className="w-full h-4 mt-4" />
                <SkeletonBar className="w-5/6 h-4" />
            </div>
        </article>

        {/* Right Sidebar */}
        <aside className="lg:col-span-3 space-y-8 lg:border-l border-ink lg:pl-8">
            <div className="border-b border-ink pb-6">
                <SkeletonBar className="w-full h-8 mb-4" />
                <SkeletonBar className="w-full h-4" />
                <SkeletonBar className="w-2/3 h-4 mt-2" />
            </div>
            <div className="bg-ink p-4">
                <SkeletonBar className="w-full h-8 mb-4 bg-newsprint/20" />
                <div className="space-y-4">
                    {[...Array(2)].map((_, i) => (
                        <div key={i}>
                            <SkeletonBar className="w-3/4 h-4 mb-2 bg-newsprint/20" />
                            <SkeletonBar className="w-full h-3 mb-1 bg-newsprint/20" />
                            <SkeletonBar className="w-1/4 h-3 bg-newsprint/20" />
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    </div>
);

export const AboutPageSkeleton: React.FC = () => (
    <article className="bg-surface p-4 md:p-8 shadow-sm border border-ink/10 animate-pulse">
        {/* Header */}
        <header className="mb-8 border-b-2 border-ink pb-6 text-center">
            <SkeletonBar className="w-24 h-4 mx-auto mb-4" />
            <SkeletonBar className="w-3/4 md:w-1/2 h-16 mx-auto mb-4" />
            <SkeletonBar className="w-2/3 md:w-1/3 h-12 mx-auto mb-6" />
            <div className="flex justify-between max-w-4xl mx-auto pt-4 border-t border-ink/30">
                <SkeletonBar className="w-1/4 h-4" />
                <SkeletonBar className="w-1/4 h-4" />
                <SkeletonBar className="w-1/4 h-4" />
            </div>
        </header>

        {/* Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            {/* Left Column */}
            <div className="md:col-span-4 space-y-6 md:border-r border-ink/20 md:pr-8">
                <div className="border border-ink p-1 bg-surface">
                    <SkeletonBar className="w-full h-[400px]" />
                </div>
                <div className="space-y-3 mt-6">
                    <SkeletonBar className="w-full h-4" />
                    <SkeletonBar className="w-full h-4" />
                    <SkeletonBar className="w-3/4 h-4" />
                </div>
            </div>

            {/* Middle Column */}
            <div className="md:col-span-5 space-y-8">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-3">
                        <SkeletonBar className="w-32 h-5 mb-2" />
                        <SkeletonBar className="w-3/4 h-6 mb-4" />
                        <SkeletonBar className="w-full h-4" />
                        <SkeletonBar className="w-full h-4" />
                        <SkeletonBar className="w-5/6 h-4" />
                    </div>
                ))}
            </div>

            {/* Right Column */}
            <div className="md:col-span-3 border-l border-ink/20 pl-0 md:pl-8 flex flex-col gap-8">
                <div className="border-2 border-ink p-4 bg-newsprint relative">
                    <SkeletonBar className="w-16 h-4 absolute -top-2 left-1/2 -translate-x-1/2" />
                    <div className="space-y-4 mt-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex justify-between">
                                <SkeletonBar className="w-1/3 h-4" />
                                <SkeletonBar className="w-1/3 h-4" />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="space-y-2 mt-4 text-center">
                    <SkeletonBar className="w-24 h-5 mx-auto mb-4" />
                    <div className="flex flex-wrap justify-center gap-2">
                        {[...Array(8)].map((_, i) => (
                            <SkeletonBar key={i} className="w-16 h-6" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </article>
);

export const ClassifiedsPageSkeleton: React.FC = () => (
    <div>
        <div className="border-b-4 border-ink mb-2 pb-2 flex flex-col md:flex-row justify-between items-end gap-4 animate-pulse">
            <div className="w-full">
                <SkeletonBar className="w-3/4 md:w-1/3 h-16 mb-4" />
                <SkeletonBar className="w-1/2 md:w-1/4 h-4" />
            </div>
        </div>
        <div className="flex border-b border-ink mb-0 py-2 gap-4 animate-pulse">
            <SkeletonBar className="w-16 h-4" />
            <SkeletonBar className="w-20 h-4" />
            <SkeletonBar className="w-20 h-4" />
            <SkeletonBar className="w-24 h-4" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-newsprint shadow-sm border-l border-ink border-t border-ink animate-pulse">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="border-r border-b border-ink p-6 aspect-square flex flex-col justify-between">
                    <div className="space-y-2">
                        <SkeletonBar className="w-3/4 h-8" />
                        <SkeletonBar className="w-full h-4 mt-4" />
                        <SkeletonBar className="w-2/3 h-4" />
                    </div>
                    <div className="flex gap-2">
                        <SkeletonBar className="w-12 h-6" />
                        <SkeletonBar className="w-16 h-6" />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export const EditorialPageSkeleton: React.FC = () => (
    <div className="animate-pulse">
        <div className="border-b-2 border-ink mb-8 pb-4 text-center">
            <SkeletonBar className="w-64 h-10 mx-auto mb-4" />
            <SkeletonBar className="w-48 h-5 mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Main Article */}
            <div className="lg:col-span-8 lg:border-r border-ink lg:pr-12">
                <div className="mb-6 space-y-4">
                    <SkeletonBar className="w-32 h-4 mb-4" />
                    <SkeletonBar className="w-full h-16" />
                    <SkeletonBar className="w-3/4 h-16 mb-4" />
                    <SkeletonBar className="w-full h-6" />
                    <div className="flex justify-between py-2 mt-8">
                        <SkeletonBar className="w-1/4 h-4" />
                        <SkeletonBar className="w-1/4 h-4" />
                        <SkeletonBar className="w-1/4 h-4" />
                    </div>
                </div>
                <SkeletonBar className="w-full h-64 md:h-80 mb-8" />
                <div className="space-y-4">
                    <SkeletonBar className="w-full h-5" />
                    <SkeletonBar className="w-full h-5" />
                    <SkeletonBar className="w-5/6 h-5" />
                    <SkeletonBar className="w-full h-5 mt-6" />
                    <SkeletonBar className="w-4/5 h-5" />
                </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-8">
                <div className="bg-surface p-6 border border-ink">
                    <SkeletonBar className="w-1/2 h-6 mb-6" />
                    <div className="space-y-6">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="space-y-2 pb-4">
                                <SkeletonBar className="w-3/4 h-5" />
                                <SkeletonBar className="w-full h-4" />
                                <SkeletonBar className="w-1/3 h-3 ml-auto" />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="border-4 border-double border-ink p-4 text-center bg-surface">
                    <SkeletonBar className="w-24 h-4 mx-auto mb-4" />
                    <SkeletonBar className="w-32 h-8 mx-auto mb-4" />
                    <SkeletonBar className="w-16 h-16 rounded-full mx-auto" />
                </div>
            </div>
        </div>
    </div>
);

export const ContactPageSkeleton: React.FC = () => (
    <div className="flex items-center justify-center py-8 min-h-[60vh] animate-pulse">
        <div className="w-full max-w-2xl mx-auto bg-surface p-8 sm:p-12 border-[3px] border-dashed border-ink/40 relative">
            <div className="space-y-8">
                <div className="text-center space-y-4 border-b-2 border-ink pb-6">
                    <SkeletonBar className="w-64 h-12 mx-auto mb-4" />
                    <SkeletonBar className="w-full max-w-lg h-16 mx-auto mb-4" />
                    <div className="flex flex-wrap justify-center gap-4 pt-4 border-t border-dashed border-ink mt-4">
                        {[...Array(4)].map((_, i) => (
                            <SkeletonBar key={i} className="w-20 h-6" />
                        ))}
                    </div>
                </div>
                <div className="space-y-8 mt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        <div>
                            <SkeletonBar className="w-24 h-4 mb-2" />
                            <SkeletonBar className="w-full h-10 border-b border-ink/20" />
                        </div>
                        <div>
                            <SkeletonBar className="w-48 h-4 mb-2" />
                            <SkeletonBar className="w-full h-10 border-b border-ink/20" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <SkeletonBar className="w-40 h-4 mb-4" />
                        <div className="flex gap-6">
                            {[...Array(3)].map((_, i) => (
                                <SkeletonBar key={i} className="w-32 h-4" />
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <SkeletonBar className="w-48 h-4 mb-4" />
                        <SkeletonBar className="w-full h-32" />
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
                        <SkeletonBar className="w-24 h-28" />
                        <SkeletonBar className="w-48 h-12" />
                    </div>
                </div>
            </div>
        </div>
    </div>
);
