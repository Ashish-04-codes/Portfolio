/**
 * Authentication Service with Firebase
 * Secure authentication using Firebase Auth
 * Integrated with security and activity logging
 */

import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User
} from 'firebase/auth';
import { auth } from '../config/firebase.config';
import { securityService } from './security.service';
import { activityService } from './activity.service';
import { logger } from '../utils/logger';

class AuthService {
    private currentUser: User | null = null;

    constructor() {
        // Listen for auth state changes
        onAuthStateChanged(auth, (user) => {
            this.currentUser = user;
            if (user) {
                securityService.recordActivity();
            }
        });
    }

    /**
     * Sign in with email and password
     */
    async login(email: string, password: string): Promise<boolean> {
        // Check if account is locked out
        const lockoutStatus = securityService.isLockedOut();
        if (lockoutStatus.locked) {
            const minutes = Math.ceil(lockoutStatus.remainingTime! / 60);
            activityService.log({
                action: 'login_failed',
                entityType: 'auth',
                userEmail: email,
                details: `Account locked - ${minutes} minutes remaining`,
            });
            throw new Error(
                `Account locked due to too many failed attempts. Try again in ${minutes} ${minutes === 1 ? 'minute' : 'minutes'
                }.`
            );
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            this.currentUser = userCredential.user;

            // Clear failed attempts on successful login
            securityService.clearFailedLoginAttempts();
            securityService.recordActivity();

            // Log successful login
            activityService.log({
                action: 'login',
                entityType: 'auth',
                userEmail: userCredential.user.email,
                details: 'Successfully logged in',
            });

            return true;
        } catch (error: any) {
            logger.error('Login error', { error });

            // Record failed login attempt
            const rateLimitResult = securityService.recordFailedLogin();

            // Log failed login
            activityService.log({
                action: 'login_failed',
                entityType: 'auth',
                userEmail: email,
                details: `Failed login: ${error.code || 'unknown error'}`,
            });

            // Provide user-friendly error messages
            let errorMessage: string;
            switch (error.code) {
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email address';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'This account has been disabled';
                    break;
                case 'auth/user-not-found':
                    errorMessage = 'No account found with this email';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Incorrect password';
                    break;
                case 'auth/invalid-credential':
                    errorMessage = 'Invalid email or password';
                    break;
                default:
                    errorMessage = 'Login failed. Please try again.';
            }

            // Add attempts remaining to error message
            if (!rateLimitResult.shouldLockout && rateLimitResult.attemptsRemaining > 0) {
                errorMessage += ` (${rateLimitResult.attemptsRemaining} ${rateLimitResult.attemptsRemaining === 1 ? 'attempt' : 'attempts'
                    } remaining)`;
            }

            throw new Error(errorMessage);
        }
    }

    /**
     * Sign out current user
     */
    async logout(): Promise<void> {
        try {
            const userEmail = this.getUserEmail();

            await signOut(auth);
            this.currentUser = null;

            // Clear session activity
            securityService.clearSessionActivity();

            // Log logout
            activityService.log({
                action: 'logout',
                entityType: 'auth',
                userEmail,
                details: 'Successfully logged out',
            });
        } catch (error) {
            logger.error('Logout error', { error });
            throw new Error('Logout failed');
        }
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return this.currentUser !== null && auth.currentUser !== null;
    }

    /**
     * Get current user
     */
    getCurrentUser(): User | null {
        return this.currentUser || auth.currentUser;
    }

    /**
     * Get user email
     */
    getUserEmail(): string | null {
        return this.currentUser?.email || auth.currentUser?.email || null;
    }

    /**
     * Wait for auth to initialize
     */
    async waitForAuth(): Promise<User | null> {
        return new Promise((resolve) => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                unsubscribe();
                resolve(user);
            });
        });
    }

    /**
     * Record user activity (for session timeout)
     */
    recordActivity(): void {
        if (this.isAuthenticated()) {
            securityService.recordActivity();
        }
    }
}

export const authService = new AuthService();
