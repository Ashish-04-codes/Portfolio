import { Page } from '../types';

/**
 * Navigation links configuration
 */
export const NAV_LINKS: { id: Page; label: string }[] = [
    { id: 'front', label: 'Home' },
    { id: 'about', label: 'Bio' },
    { id: 'classifieds', label: 'Projects' },
    { id: 'editorial', label: 'Blog' },
    { id: 'contact', label: 'Contact' },
];

/**
 * Page sub-header configuration
 */
export const PAGE_HEADERS: Partial<Record<Page, { left: string; center: string; right: string }>> = {
    front: { left: 'Vol. I, No. 1', center: 'Today', right: 'Price: Free' },
    about: { left: 'Section A', center: 'Profile & Bio', right: 'The Developer' },
    classifieds: { left: 'Section C', center: 'Project Catalog', right: 'Works & Case Studies' },
    editorial: { left: 'Section B', center: 'Technical Insights', right: 'Op-Eds' },
    contact: { left: 'Section D', center: 'Inquiries', right: 'Telegraph & Post' },
};

/**
 * Site metadata
 */
export const SITE_CONFIG = {
    title: 'The Daily Developer',
    tagline: 'Building the Web, One Component at a Time',
    location: 'San Francisco, CA',
    copyright: '© 2024 The Daily Developer. All Rights Reserved. Printed in HTML & CSS.',
    social: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
    },
};

/**
 * Animation timing constants (in milliseconds)
 */
export const ANIMATION_TIMING = {
    pageTransitionDelay: 600,
    pageTransitionDuration: 1200,
} as const;
