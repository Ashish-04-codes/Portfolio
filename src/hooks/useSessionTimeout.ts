/**
 * Session Timeout Hook
 * Monitor user activity and handle session timeout
 * Shows warning at 2 minutes, auto-logout at 30 minutes
 */

import { useEffect, useState, useCallback } from 'react';
import { securityService } from '../services';

interface UseSessionTimeoutParams {
    onTimeout: () => void;
    onWarning?: () => void;
    isAuthenticated: boolean;
}

export const useSessionTimeout = ({ onTimeout, onWarning, isAuthenticated }: UseSessionTimeoutParams) => {
    const [showWarning, setShowWarning] = useState(false);
    const [remainingSeconds, setRemainingSeconds] = useState(0);

    const checkTimeout = useCallback(() => {
        if (!isAuthenticated) {
            setShowWarning(false);
            return;
        }

        const { timedOut, remainingSeconds } = securityService.checkSessionTimeout();

        if (timedOut) {
            setShowWarning(false);
            onTimeout();
            return;
        }

        setRemainingSeconds(remainingSeconds);

        const shouldWarn = securityService.shouldShowTimeoutWarning();
        if (shouldWarn && !showWarning) {
            setShowWarning(true);
            onWarning?.();
        } else if (!shouldWarn && showWarning) {
            setShowWarning(false);
        }
    }, [isAuthenticated, showWarning, onTimeout, onWarning]);

    const resetTimeout = useCallback(() => {
        if (isAuthenticated) {
            securityService.recordActivity();
            setShowWarning(false);
        }
    }, [isAuthenticated]);

    // Check timeout every 5 seconds
    useEffect(() => {
        if (!isAuthenticated) return;

        const interval = setInterval(checkTimeout, 5000);
        return () => clearInterval(interval);
    }, [checkTimeout, isAuthenticated]);

    // Record activity on user interaction
    useEffect(() => {
        if (!isAuthenticated) return;

        const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];

        const handleActivity = () => {
            resetTimeout();
        };

        events.forEach((event) => {
            window.addEventListener(event, handleActivity);
        });

        return () => {
            events.forEach((event) => {
                window.removeEventListener(event, handleActivity);
            });
        };
    }, [isAuthenticated, resetTimeout]);

    const extendSession = useCallback(() => {
        resetTimeout();
        setShowWarning(false);
    }, [resetTimeout]);

    return {
        showWarning,
        remainingSeconds,
        extendSession,
    };
};
