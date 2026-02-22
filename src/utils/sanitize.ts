/**
 * Input Sanitization Utilities
 * Protect against XSS and injection attacks
 */

/**
 * Sanitize HTML string to prevent XSS attacks
 * Removes script tags and dangerous attributes
 */
export const sanitizeHtml = (html: string): string => {
    if (!html) return '';

    // Remove script tags and their content
    let cleaned = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Remove dangerous event handlers
    cleaned = cleaned.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
    cleaned = cleaned.replace(/on\w+\s*=\s*[^\s>]*/gi, '');

    // Remove javascript: protocol
    cleaned = cleaned.replace(/javascript:/gi, '');

    // Remove data: protocol (can be used for XSS)
    cleaned = cleaned.replace(/data:text\/html/gi, '');

    return cleaned.trim();
};

/**
 * Sanitize plain text input
 * Escapes HTML characters
 */
export const sanitizeText = (text: string): string => {
    if (!text) return '';

    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};

/**
 * Sanitize URL to prevent javascript: protocol attacks
 */
export const sanitizeUrl = (url: string): string => {
    if (!url) return '';

    const trimmed = url.trim();

    // Block dangerous protocols
    const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
    const lowerUrl = trimmed.toLowerCase();

    for (const protocol of dangerousProtocols) {
        if (lowerUrl.startsWith(protocol)) {
            return '';
        }
    }

    return trimmed;
};

/**
 * Sanitize filename for safe storage
 * Removes special characters and spaces
 */
export const sanitizeFilename = (filename: string): string => {
    if (!filename) return '';

    // Remove path traversal attempts
    let cleaned = filename.replace(/\.\./g, '');

    // Remove special characters except dot, dash, underscore
    cleaned = cleaned.replace(/[^a-zA-Z0-9._-]/g, '_');

    // Limit length
    if (cleaned.length > 255) {
        const ext = cleaned.split('.').pop();
        cleaned = cleaned.substring(0, 250) + '.' + ext;
    }

    return cleaned;
};

/**
 * Strip all HTML tags from string
 */
export const stripHtml = (html: string): string => {
    if (!html) return '';

    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
};

/**
 * Truncate text to specified length
 */
export const truncate = (text: string, maxLength: number): string => {
    if (!text || text.length <= maxLength) return text;

    return text.substring(0, maxLength).trim() + '...';
};

/**
 * Sanitize object by removing potentially dangerous properties
 */
export const sanitizeObject = <T extends Record<string, any>>(obj: T): T => {
    const dangerous = ['__proto__', 'constructor', 'prototype'];
    const cleaned = { ...obj };

    for (const key of dangerous) {
        if (key in cleaned) {
            delete cleaned[key];
        }
    }

    return cleaned;
};
