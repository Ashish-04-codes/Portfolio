/**
 * Site Config Context
 * Provides site configuration (from Firebase) to all public-facing pages.
 * Falls back to hardcoded SITE_CONFIG defaults when Firebase data is not available.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SiteConfig } from '../models';
import { siteConfigService } from '../services';
import { SITE_CONFIG } from '../constants';

interface SiteConfigContextType {
    // Header
    siteTitle: string;
    tagline: string;
    location: string;
    logoUrl: string;
    // Favicon
    favicon: string;
    // Hero
    heroTitle: string;
    heroSubtitle: string;
    heroImage: string;
    // Availability
    availableForWork: boolean;
    availabilityMessage: string;
    // Footer
    copyright: string;
    social: {
        github: string;
        linkedin: string;
        twitter: string;
        email: string;
    };
    // Loading state
    loading: boolean;
    // Raw config for advanced use
    rawConfig: SiteConfig | null;
}

const defaultValues: SiteConfigContextType = {
    siteTitle: SITE_CONFIG.title,
    tagline: SITE_CONFIG.tagline,
    location: SITE_CONFIG.location,
    logoUrl: '',
    favicon: '',
    heroTitle: 'Full-Stack Engineer Redefines User Experience',
    heroSubtitle: 'Portfolio Launched',
    heroImage: '',
    availableForWork: true,
    availabilityMessage: 'Available for Full-time Roles & Freelance Commissions',
    copyright: SITE_CONFIG.copyright,
    social: {
        github: SITE_CONFIG.social.github,
        linkedin: SITE_CONFIG.social.linkedin,
        twitter: SITE_CONFIG.social.twitter,
        email: '',
    },
    loading: true,
    rawConfig: null,
};

const SiteConfigContext = createContext<SiteConfigContextType>(defaultValues);

interface SiteConfigProviderProps {
    children: ReactNode;
}

export const SiteConfigProvider: React.FC<SiteConfigProviderProps> = ({ children }) => {
    const [config, setConfig] = useState<SiteConfigContextType>(defaultValues);

    useEffect(() => {
        loadConfig();
    }, []);

    // Listen for config updates from admin panel
    useEffect(() => {
        const handleUpdate = () => {
            loadConfig();
        };
        window.addEventListener('storage', handleUpdate);
        window.addEventListener('dataUpdated', handleUpdate);
        return () => {
            window.removeEventListener('storage', handleUpdate);
            window.removeEventListener('dataUpdated', handleUpdate);
        };
    }, []);

    const loadConfig = async () => {
        try {
            const data = await siteConfigService.get();
            if (data) {
                setConfig({
                    siteTitle: data.siteTitle || data.siteName || SITE_CONFIG.title,
                    tagline: data.tagline || SITE_CONFIG.tagline,
                    location: data.location || SITE_CONFIG.location,
                    logoUrl: data.logo || '',
                    favicon: data.favicon || '',
                    heroTitle: data.heroTitle || 'Full-Stack Engineer Redefines User Experience',
                    heroSubtitle: data.heroSubtitle || 'Portfolio Launched',
                    heroImage: data.heroImage || '',
                    availableForWork: data.availableForWork ?? true,
                    availabilityMessage:
                        data.availabilityMessage ||
                        'Available for Full-time Roles & Freelance Commissions',
                    copyright:
                        data.footer?.copyright || SITE_CONFIG.copyright,
                    social: {
                        github: data.social?.github || data.github || SITE_CONFIG.social.github,
                        linkedin: data.social?.linkedin || data.linkedin || SITE_CONFIG.social.linkedin,
                        twitter: data.social?.twitter || data.twitter || SITE_CONFIG.social.twitter,
                        email: data.social?.email || data.email || '',
                    },
                    loading: false,
                    rawConfig: data,
                });
            } else {
                setConfig((prev) => ({ ...prev, loading: false }));
            }
        } catch {
            setConfig((prev) => ({ ...prev, loading: false }));
        }
    };

    // Dynamically update favicon when config changes
    useEffect(() => {
        if (config.favicon) {
            const link = document.querySelector("link[rel='icon']") as HTMLLinkElement;
            if (link) {
                link.href = config.favicon;
            }
        }
    }, [config.favicon]);

    return (
        <SiteConfigContext.Provider value={config}>{children}</SiteConfigContext.Provider>
    );
};

/**
 * Hook to access site configuration
 */
export const useSiteConfig = (): SiteConfigContextType => {
    return useContext(SiteConfigContext);
};
