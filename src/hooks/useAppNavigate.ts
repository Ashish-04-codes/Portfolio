/**
 * useAppNavigate — drop-in replacement for the old `navigate(page: Page)` pattern.
 * Wraps React Router's useNavigate so existing components can keep calling
 * navigate('about') or navigate('admin-projects') and have it Just Work™.
 */

import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { Page } from '../types';
import { pageToPath } from '../config/routes';

export const useAppNavigate = () => {
  const nav = useNavigate();

  const navigate = useCallback(
    (page: Page | string) => {
      nav(pageToPath(page as Page));
    },
    [nav]
  );

  return navigate;
};
