import { useState, useEffect } from 'react';
import { safeStorage } from '../utils/storage';

const THEME_STORAGE_KEY = 'dailydev_theme';

/**
 * Custom hook for managing dark mode theme
 * Persists preference in localStorage and respects OS color scheme on first visit
 * @returns {Object} Theme state and toggle function
 */
export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = safeStorage.getItem(THEME_STORAGE_KEY);
    if (saved !== null) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark-mode');
    } else {
      root.classList.remove('dark-mode');
    }
    safeStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  return { isDarkMode, toggleTheme };
};
