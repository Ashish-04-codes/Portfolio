/**
 * Breadcrumb Component
 * Show current navigation path
 */

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Page } from '../../types';

interface BreadcrumbProps {
  currentPage: Page;
  onNavigate?: (page: Page) => void;
}

interface Breadcrumb {
  label: string;
  page?: Page;
}

const getBreadcrumbs = (currentPage: Page): Breadcrumb[] => {
  const pageMap: Record<string, Breadcrumb[]> = {
    admin: [{ label: 'Dashboard' }],
    'admin-projects': [{ label: 'Dashboard', page: 'admin' }, { label: 'Projects Manager' }],
    'admin-blog': [{ label: 'Dashboard', page: 'admin' }, { label: 'Blog Manager' }],
    'admin-profile': [{ label: 'Dashboard', page: 'admin' }, { label: 'Profile Editor' }],
    'admin-skills': [{ label: 'Dashboard', page: 'admin' }, { label: 'Skills Manager' }],
    'admin-config': [{ label: 'Dashboard', page: 'admin' }, { label: 'Site Configuration' }],
  };

  return pageMap[currentPage] || [{ label: 'Dashboard' }];
};

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ currentPage, onNavigate }) => {
  const breadcrumbs = getBreadcrumbs(currentPage);

  return (
    <nav className="flex items-center gap-2 font-mono text-sm text-ink/60 mb-4">
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;

        return (
          <React.Fragment key={index}>
            {crumb.page && onNavigate ? (
              <button
                onClick={() => onNavigate(crumb.page!)}
                className="hover:text-ink transition-colors"
              >
                {crumb.label}
              </button>
            ) : (
              <span className={isLast ? 'text-ink font-bold' : ''}>{crumb.label}</span>
            )}
            {!isLast && <ChevronRight size={16} />}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
