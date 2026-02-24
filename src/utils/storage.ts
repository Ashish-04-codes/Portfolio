import { logger } from './logger';

/**
 * A safe wrapper around localStorage that handles QuotaExceededError and SecurityError (e.g., in iframes or restricted modes)
 */
export const safeStorage = {
    getItem: (key: string): string | null => {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                return window.localStorage.getItem(key);
            }
        } catch (error) {
            logger.warn(`Storage access denied for get: ${key}`, { error });
        }
        return null;
    },

    setItem: (key: string, value: string): void => {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.setItem(key, value);
            }
        } catch (error) {
            logger.warn(`Storage access denied for set: ${key}`, { error });
        }
    },

    removeItem: (key: string): void => {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.removeItem(key);
            }
        } catch (error) {
            logger.warn(`Storage access denied for remove: ${key}`, { error });
        }
    },

    clear: (): void => {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.clear();
            }
        } catch (error) {
            logger.warn('Storage access denied for clear', { error });
        }
    }
};
