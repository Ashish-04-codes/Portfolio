/**
 * PublicLayout — wraps all public pages with Header, Navigation, Footer.
 * Uses React Router's <Outlet> for nested route rendering.
 * Includes page transition animation when navigating between pages.
 */

import React, { useState, useCallback, useMemo, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Header, Footer, PageTransitionOverlay } from '../components/common';
import { useTheme, useFormattedDate } from '../hooks';
import { pathToPage, pageToPath } from '../config/routes';
import { PAGE_HEADERS, ANIMATION_TIMING } from '../constants';
import { Page } from '../types';

export const PublicLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const currentDate = useFormattedDate();
  const routerNavigate = useNavigate();
  const location = useLocation();
  const currentPage = pathToPage(location.pathname);
  const pendingNavRef = useRef<string | null>(null);

  const getSubHeader = useMemo(() => {
    const header = PAGE_HEADERS[currentPage];
    if (!header) {
      return { left: '', center: '', right: '' };
    }
    return {
      ...header,
      center: currentPage === 'front' ? currentDate || header.center : header.center,
    };
  }, [currentPage, currentDate]);

  const handleNavigate = useCallback(
    (page: Page | string) => {
      const targetPath = pageToPath(page as Page);
      const currentPath = location.pathname;

      // Don't transition if already on the same page
      if (targetPath === currentPath) return;

      setMobileMenuOpen(false);

      // Trigger transition overlay
      setIsTransitioning(true);
      pendingNavRef.current = targetPath;

      // Navigate after 600ms (40% of 1.2s animation — when overlay fully covers screen)
      setTimeout(() => {
        if (pendingNavRef.current) {
          routerNavigate(pendingNavRef.current);
          pendingNavRef.current = null;
        }
      }, ANIMATION_TIMING.pageTransitionDelay);

      // Deactivate overlay after full animation completes
      setTimeout(() => {
        setIsTransitioning(false);
      }, ANIMATION_TIMING.pageTransitionDuration);
    },
    [location.pathname, routerNavigate]
  );

  const handleToggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

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
        onNavigate={handleNavigate}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        subHeader={getSubHeader}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={handleToggleMobileMenu}
      />

      {/* Main Content */}
      <main
        id="main-content"
        className="relative z-10 flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12"
      >
        <div key={location.pathname} className="animate-page-enter">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};
