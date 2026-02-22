import { useState, useEffect } from 'react';
import { Page } from '../types';

/**
 * Get page from URL pathname
 */
const getPageFromPath = (): Page => {
    const path = window.location.pathname.slice(1); // Remove leading slash

    // Handle empty path (root)
    if (!path) return 'front';

    // Handle admin routes
    if (path === 'admin') return 'admin';
    if (path === 'login') return 'login';

    // All valid routes (public + admin sub-pages)
    const validPages: Page[] = [
        'front', 'about', 'classifieds', 'editorial', 'contact',
        'admin-projects', 'admin-blog', 'admin-profile', 'admin-skills', 'admin-config',
    ];
    return validPages.includes(path as Page) ? (path as Page) : 'not-found';
};

/**
 * Custom hook for managing page navigation with transition animations
 * Syncs with browser URL for direct navigation support
 * @param {Page} initialPage - The fallback initial page
 * @returns {Object} Navigation state and handler functions
 */
export const useNavigation = (initialPage: Page = 'front') => {
    // Initialize from URL, fallback to initialPage
    const [currentPage, setCurrentPage] = useState<Page>(() => getPageFromPath() || initialPage);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Listen for browser back/forward buttons
    useEffect(() => {
        const handlePopState = () => {
            const page = getPageFromPath();
            setCurrentPage(page);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const handleNavigation = (page: Page) => {
        if (page === currentPage || isTransitioning) return;

        setIsTransitioning(true);

        // Update browser URL
        const path = page === 'front' ? '/' : `/${page}`;
        window.history.pushState({}, '', path);

        // Wait for overlay animation
        setTimeout(() => {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'instant' });
        }, 600);

        // Reset transition state
        setTimeout(() => {
            setIsTransitioning(false);
        }, 1200);
    };

    return {
        currentPage,
        isTransitioning,
        navigate: handleNavigation,
    };
};
