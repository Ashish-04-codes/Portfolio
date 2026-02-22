/**
 * 404 Not Found Page
 * Newspaper-styled "Page Not Found" with navigation back to front page
 */

import React from 'react';
import { useAppNavigate } from '../hooks/useAppNavigate';

const NotFoundPage: React.FC = () => {
    const navigate = useAppNavigate();
    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="max-w-2xl w-full text-center">
                {/* Top border */}
                <div className="border-t-4 border-b border-ink pt-6 pb-4 mb-8">
                    <p className="font-mono text-xs tracking-[0.3em] uppercase text-ink/60">
                        — EXTRA! EXTRA! —
                    </p>
                </div>

                {/* Main content */}
                <h1 className="font-masthead text-6xl md:text-8xl mb-4">404</h1>
                <h2 className="font-headline text-2xl md:text-3xl font-bold italic mb-6">
                    Page Not Found in Today's Edition
                </h2>

                <div className="w-24 h-0.5 bg-ink mx-auto my-8" />

                <p className="font-body text-lg text-ink/70 max-w-md mx-auto mb-4 drop-cap">
                    The page you are looking for has either been moved, misplaced during printing,
                    or perhaps never existed in this edition. Our editorial team has been notified.
                </p>

                <p className="font-mono text-xs text-ink/50 mb-8">
                    Requested: <span className="underline">{window.location.pathname}</span>
                </p>

                {/* Bottom border + CTA */}
                <div className="border-t border-b-4 border-ink pt-6 pb-6">
                    <button
                        onClick={() => navigate('front')}
                        className="font-mono text-sm px-8 py-3 border-2 border-ink bg-ink text-newsprint hover:bg-transparent hover:text-ink transition-colors uppercase tracking-wider"
                    >
                        Return to Front Page
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
