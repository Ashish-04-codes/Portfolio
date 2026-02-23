import React from 'react';
import { useSiteConfig } from '../../context/SiteConfigContext';

interface PageTransitionOverlayProps {
  isActive: boolean;
}

/**
 * Page transition overlay component with animation
 */
export const PageTransitionOverlay: React.FC<PageTransitionOverlayProps> = ({ isActive }) => {
  const { siteTitle } = useSiteConfig();

  return (
    <div className={`transition-overlay ${isActive ? 'active' : ''}`}>
      <div className="transition-content flex flex-col items-center">
        <h2 className="font-masthead text-5xl md:text-7xl mb-2">{siteTitle}</h2>
        <span className="font-mono text-sm uppercase tracking-widest border-t border-b border-newsprint/30 py-1 px-4">
          Redirecting...
        </span>
      </div>
    </div>
  );
};

