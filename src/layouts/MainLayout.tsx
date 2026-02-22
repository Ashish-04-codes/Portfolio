import React, { ReactNode } from 'react';
import { Header, Footer, PageTransitionOverlay } from '../components/common';
import { Page } from '../types';

interface MainLayoutProps {
    children: ReactNode;
    currentPage: Page;
    onNavigate: (page: Page) => void;
    isDarkMode: boolean;
    onToggleTheme: () => void;
    isTransitioning: boolean;
    subHeader: { left: string; center: string; right: string };
    mobileMenuOpen: boolean;
    onToggleMobileMenu: () => void;
}

/**
 * Main layout wrapper for all pages
 */
export const MainLayout: React.FC<MainLayoutProps> = ({
    children,
    currentPage,
    onNavigate,
    isDarkMode,
    onToggleTheme,
    isTransitioning,
    subHeader,
    mobileMenuOpen,
    onToggleMobileMenu
}) => {
    return (
        <div className="min-h-screen flex flex-col font-body bg-newsprint text-ink selection:bg-ink selection:text-newsprint transition-colors duration-300">
            {/* Skip to Content - Accessibility */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:bg-ink focus:text-newsprint focus:px-4 focus:py-2 focus:rounded focus:font-mono focus:text-sm"
            >
                Skip to main content
            </a>

            {/* Page Transition Overlay */}
            <PageTransitionOverlay isActive={isTransitioning} />

            {/* Noise Overlay */}
            <div className="noise-overlay" />

            {/* Texture Overlay */}
            <div className="texture-overlay" />

            {/* Header */}
            <Header
                currentPage={currentPage}
                onNavigate={onNavigate}
                isDarkMode={isDarkMode}
                onToggleTheme={onToggleTheme}
                subHeader={subHeader}
                mobileMenuOpen={mobileMenuOpen}
                onToggleMobileMenu={onToggleMobileMenu}
            />

            {/* Main Content */}
            <main id="main-content" className="relative z-10 flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div key={currentPage} className="animate-page-enter">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <Footer onNavigate={onNavigate} />
        </div>
    );
};
