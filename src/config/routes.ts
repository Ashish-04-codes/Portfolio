/**
 * Route configuration and utilities for React Router integration.
 * Maps between legacy Page type strings and URL paths.
 */

import { Page } from '../types';

/** Map from Page type → URL path */
export const PAGE_TO_PATH: Record<Page, string> = {
  front: '/',
  about: '/about',
  classifieds: '/classifieds',
  editorial: '/editorial',
  contact: '/contact',
  login: '/login',
  admin: '/admin',
  'admin-projects': '/admin/projects',
  'admin-blog': '/admin/blog',
  'admin-profile': '/admin/profile',
  'admin-skills': '/admin/skills',
  'admin-config': '/admin/config',
  'not-found': '/not-found',
};

/** Map from URL path → Page type */
const PATH_TO_PAGE: Record<string, Page> = Object.fromEntries(
  Object.entries(PAGE_TO_PATH).map(([page, path]) => [path, page as Page])
) as Record<string, Page>;

/** Convert a Page string to a URL path */
export const pageToPath = (page: Page | string): string => {
  return PAGE_TO_PATH[page as Page] || `/${page}`;
};

/** Convert a URL path to a Page string */
export const pathToPage = (path: string): Page => {
  return PATH_TO_PAGE[path] || 'not-found';
};
