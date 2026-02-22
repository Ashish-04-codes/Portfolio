/**
 * Format date with custom options
 * @param date - Date to format
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export const formatDate = (
    date: Date = new Date(),
    options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
): string => {
    return date.toLocaleDateString('en-US', options);
};

/**
 * Scroll to top of page
 * @param behavior - Scroll behavior ('auto' | 'smooth' | 'instant')
 */
export const scrollToTop = (behavior: ScrollBehavior = 'instant'): void => {
    window.scrollTo({ top: 0, behavior });
};

/**
 * Generate a unique ID
 * Uses crypto.randomUUID() for collision-safe, cryptographically random IDs
 * @returns Unique string ID
 */
export const generateId = (): string => {
    return crypto.randomUUID();
};
