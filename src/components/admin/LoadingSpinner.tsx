/**
 * Loading Spinner Component
 * Display loading state for async operations
 */

import React from 'react';
import { Loader } from 'lucide-react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    message?: string;
    centered?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    message,
    centered = false,
}) => {
    const sizes = {
        sm: 16,
        md: 24,
        lg: 32,
    };

    const iconSize = sizes[size];

    const spinner = (
        <>
            <Loader size={iconSize} className="animate-spin text-ink" />
            {message && <p className="font-mono text-sm text-ink/60 mt-2">{message}</p>}
        </>
    );

    if (centered) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[200px]">
                {spinner}
            </div>
        );
    }

    return <div className="flex items-center gap-2">{spinner}</div>;
};
