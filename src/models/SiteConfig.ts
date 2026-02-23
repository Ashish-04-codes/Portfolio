/**
 * Site Configuration Data Model
 * Defines the structure for site-wide settings
 */

export interface SiteConfigSeo {
  metaDescription: string;
  keywords: string[];
  ogImage: string;
}

export interface SiteConfigAnalytics {
  googleAnalyticsId: string;
  enableTracking: boolean;
}

export interface SiteConfigSocial {
  github: string;
  linkedin: string;
  twitter: string;
  email: string;
}

export interface SiteConfigFooter {
  text: string;
  copyright: string;
  links: string[];
}

export interface SiteConfig {
  id: string;
  siteName: string;
  siteTitle?: string;
  tagline: string;
  description: string;
  author: string;
  location: string;
  logo?: string;
  favicon?: string;
  email?: string;
  phone?: string;
  // Hero Section
  heroTitle: string;
  heroSubtitle: string;
  heroImage?: string;
  // Social Links (flat - backward compatible)
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  // Nested config sections (used by AdminConfig)
  seo?: SiteConfigSeo;
  analytics?: SiteConfigAnalytics;
  social?: SiteConfigSocial;
  footer?: SiteConfigFooter;
  // Availability
  availableForWork: boolean;
  availabilityMessage?: string;
  // Metadata
  updatedAt?: string;
}

export interface UpdateSiteConfigDTO extends Partial<Omit<SiteConfig, 'id'>> {
  id: string;
}
