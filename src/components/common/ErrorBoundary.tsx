/**
 * Error Boundary Component
 * Catches React rendering errors and displays a newspaper-styled fallback UI
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '../../utils/logger';

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    declare state: ErrorBoundaryState;

    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        logger.error('[ErrorBoundary] Caught error', { error: error.message, componentStack: errorInfo.componentStack });
    }

    render(): React.ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-[60vh] flex items-center justify-center px-4">
                    <div className="max-w-lg w-full text-center border-t-4 border-b-4 border-ink py-12 px-6">
                        <p className="font-mono text-xs tracking-[0.3em] uppercase text-ink/60 mb-4">
                            — STOP THE PRESSES —
                        </p>
                        <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4">
                            Something Went Wrong
                        </h1>
                        <div className="w-16 h-0.5 bg-ink mx-auto my-6" />
                        <p className="font-body text-lg text-ink/70 mb-2">
                            An unexpected error has occurred while rendering this section.
                        </p>
                        {this.state.error && (
                            <p className="font-mono text-xs text-ink/50 mt-4 mb-8 break-all">
                                {this.state.error.message}
                            </p>
                        )}
                        <div className="flex gap-4 justify-center mt-8">
                            <button
                                onClick={() => this.setState({ hasError: false, error: null })}
                                className="font-mono text-sm px-6 py-2 border-2 border-ink bg-transparent hover:bg-ink hover:text-newsprint transition-colors"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => { window.location.href = '/'; }}
                                className="font-mono text-sm px-6 py-2 border-2 border-ink bg-ink text-newsprint hover:bg-transparent hover:text-ink transition-colors"
                            >
                                Go to Front Page
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
