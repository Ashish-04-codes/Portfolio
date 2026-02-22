/**
 * Input Validation Utilities
 * Client-side validation for forms and user input
 */

/**
 * Validate email address format
 */
export const isValidEmail = (email: string): boolean => {
  if (!email) return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
  if (!url) return false;

  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Validate password strength
 * Requirements:
 * - At least 12 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export const isValidPassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!password) {
    return { valid: false, errors: ['Password is required'] };
  }

  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validate file type for image uploads
 */
export const isValidImageFile = (file: File): { valid: boolean; error?: string } => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Allowed: JPG, PNG, GIF, WebP',
    };
  }

  return { valid: true };
};

/**
 * Validate file size (default max 5MB)
 */
export const isValidFileSize = (
  file: File,
  maxSizeMB: number = 5
): { valid: boolean; error?: string } => {
  const maxBytes = maxSizeMB * 1024 * 1024;

  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
};

/**
 * Validate year (between 1900 and current year + 10)
 */
export const isValidYear = (year: string | number): boolean => {
  const yearNum = typeof year === 'string' ? parseInt(year, 10) : year;

  if (isNaN(yearNum)) return false;

  const currentYear = new Date().getFullYear();
  return yearNum >= 1900 && yearNum <= currentYear + 10;
};

/**
 * Validate required field
 */
export const isRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

/**
 * Validate minimum length
 */
export const minLength = (value: string, min: number): boolean => {
  if (!value) return false;
  return value.trim().length >= min;
};

/**
 * Validate maximum length
 */
export const maxLength = (value: string, max: number): boolean => {
  if (!value) return true;
  return value.trim().length <= max;
};

/**
 * Validate that value is within range
 */
export const inRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * Validate GitHub URL
 */
export const isValidGithubUrl = (url: string): boolean => {
  if (!url) return false;
  return /^https?:\/\/(www\.)?github\.com\/.+/.test(url);
};

/**
 * Validate LinkedIn URL
 */
export const isValidLinkedInUrl = (url: string): boolean => {
  if (!url) return false;
  return /^https?:\/\/(www\.)?linkedin\.com\/(in|company)\/.+/.test(url);
};

/**
 * Validate Twitter/X URL
 */
export const isValidTwitterUrl = (url: string): boolean => {
  if (!url) return false;
  return /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/.+/.test(url);
};

/**
 * Comprehensive form validation
 */
export interface ValidationRule {
  required?: boolean;
  email?: boolean;
  url?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
}

export const validate = (value: any, rules: ValidationRule): { valid: boolean; error?: string } => {
  if (rules.required && !isRequired(value)) {
    return { valid: false, error: 'This field is required' };
  }

  if (!value) return { valid: true };

  if (rules.email && !isValidEmail(value)) {
    return { valid: false, error: 'Invalid email address' };
  }

  if (rules.url && !isValidUrl(value)) {
    return { valid: false, error: 'Invalid URL format' };
  }

  if (rules.minLength && !minLength(value, rules.minLength)) {
    return { valid: false, error: `Minimum ${rules.minLength} characters required` };
  }

  if (rules.maxLength && !maxLength(value, rules.maxLength)) {
    return { valid: false, error: `Maximum ${rules.maxLength} characters allowed` };
  }

  if (rules.pattern && !rules.pattern.test(value)) {
    return { valid: false, error: 'Invalid format' };
  }

  if (rules.custom && !rules.custom(value)) {
    return { valid: false, error: 'Invalid value' };
  }

  return { valid: true };
};
