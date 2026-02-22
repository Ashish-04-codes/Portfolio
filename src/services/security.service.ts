/**
 * Security Service
 * Handle rate limiting, session timeout, and account lockout
 */

const RATE_LIMIT_KEY = 'login_rate_limit';
const LOCKOUT_KEY = 'account_lockout';
const LAST_ACTIVITY_KEY = 'last_activity';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

interface RateLimitData {
  attempts: number;
  firstAttempt: number;
}

interface LockoutData {
  lockedUntil: number;
  attempts: number;
}

class SecurityService {
  /**
   * Check if account is locked out
   */
  isLockedOut(): { locked: boolean; remainingTime?: number } {
    const lockoutDataStr = localStorage.getItem(LOCKOUT_KEY);
    if (!lockoutDataStr) {
      return { locked: false };
    }

    try {
      const lockoutData: LockoutData = JSON.parse(lockoutDataStr);
      const now = Date.now();

      if (now < lockoutData.lockedUntil) {
        const remainingTime = Math.ceil((lockoutData.lockedUntil - now) / 1000);
        return { locked: true, remainingTime };
      }

      // Lockout expired, clear it
      this.clearLockout();
      return { locked: false };
    } catch {
      return { locked: false };
    }
  }

  /**
   * Record a failed login attempt
   * Returns true if account should be locked
   */
  recordFailedLogin(): { shouldLockout: boolean; attemptsRemaining: number } {
    const rateLimitDataStr = localStorage.getItem(RATE_LIMIT_KEY);
    const now = Date.now();

    let rateLimitData: RateLimitData;

    if (rateLimitDataStr) {
      rateLimitData = JSON.parse(rateLimitDataStr);

      // Check if window has expired
      if (now - rateLimitData.firstAttempt > RATE_LIMIT_WINDOW) {
        // Reset window
        rateLimitData = {
          attempts: 1,
          firstAttempt: now,
        };
      } else {
        rateLimitData.attempts += 1;
      }
    } else {
      rateLimitData = {
        attempts: 1,
        firstAttempt: now,
      };
    }

    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(rateLimitData));

    const attemptsRemaining = MAX_LOGIN_ATTEMPTS - rateLimitData.attempts;

    if (rateLimitData.attempts >= MAX_LOGIN_ATTEMPTS) {
      this.lockoutAccount();
      return { shouldLockout: true, attemptsRemaining: 0 };
    }

    return { shouldLockout: false, attemptsRemaining };
  }

  /**
   * Clear failed login attempts (on successful login)
   */
  clearFailedLoginAttempts(): void {
    localStorage.removeItem(RATE_LIMIT_KEY);
    localStorage.removeItem(LOCKOUT_KEY);
  }

  /**
   * Record activity (for session timeout tracking)
   */
  recordActivity(): void {
    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
  }

  /**
   * Check if session has timed out
   * Returns remaining time in seconds, or 0 if timed out
   */
  checkSessionTimeout(): { timedOut: boolean; remainingSeconds: number } {
    const lastActivityStr = localStorage.getItem(LAST_ACTIVITY_KEY);
    if (!lastActivityStr) {
      return { timedOut: false, remainingSeconds: SESSION_TIMEOUT / 1000 };
    }

    const lastActivity = parseInt(lastActivityStr, 10);
    const now = Date.now();
    const elapsed = now - lastActivity;

    if (elapsed >= SESSION_TIMEOUT) {
      return { timedOut: true, remainingSeconds: 0 };
    }

    const remaining = SESSION_TIMEOUT - elapsed;
    return { timedOut: false, remainingSeconds: Math.ceil(remaining / 1000) };
  }

  /**
   * Clear session activity (on logout)
   */
  clearSessionActivity(): void {
    localStorage.removeItem(LAST_ACTIVITY_KEY);
  }

  /**
   * Get time until session times out (in seconds)
   */
  getTimeUntilTimeout(): number {
    const result = this.checkSessionTimeout();
    return result.remainingSeconds;
  }

  /**
   * Check if warning should be shown (2 minutes before timeout)
   */
  shouldShowTimeoutWarning(): boolean {
    const remaining = this.getTimeUntilTimeout();
    return remaining > 0 && remaining <= 120; // Show warning at 2 minutes
  }

  // Private methods

  private lockoutAccount(): void {
    const lockoutData: LockoutData = {
      lockedUntil: Date.now() + LOCKOUT_DURATION,
      attempts: MAX_LOGIN_ATTEMPTS,
    };

    localStorage.setItem(LOCKOUT_KEY, JSON.stringify(lockoutData));
  }

  private clearLockout(): void {
    localStorage.removeItem(LOCKOUT_KEY);
    localStorage.removeItem(RATE_LIMIT_KEY);
  }
}

export const securityService = new SecurityService();

// Constants for external use
export const SECURITY_CONSTANTS = {
  MAX_LOGIN_ATTEMPTS,
  LOCKOUT_DURATION_MINUTES: LOCKOUT_DURATION / 60000,
  SESSION_TIMEOUT_MINUTES: SESSION_TIMEOUT / 60000,
  WARNING_THRESHOLD_SECONDS: 120,
};
