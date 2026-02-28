import { collection, addDoc, serverTimestamp } from 'firebase/firestore/lite';
import { db } from '../config/firebase.config';
import { logger } from '../utils/logger';

export interface AuditData {
    ip: string;
    city: string;
    region: string;
    country: string;
    deviceId: string;
    userAgent: string;
    language: string;
    visitedAt: any; // Firestore Timestamp
    path: string;
}

const AUDIT_COLLECTION = 'audits';
const SESSION_STORAGE_KEY = 'audit_logged_session';
const LOCAL_STORAGE_DEVICE_ID = 'audit_device_id';

class AuditService {
    /**
     * Get or create a unique device ID that persists across sessions
     */
    private getDeviceId(): string {
        let deviceId = localStorage.getItem(LOCAL_STORAGE_DEVICE_ID);
        if (!deviceId) {
            // Generate a random UUID-like string
            deviceId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
            localStorage.setItem(LOCAL_STORAGE_DEVICE_ID, deviceId);
        }
        return deviceId;
    }

    /**
     * Fetch IP and location data from an external API
     */
    private async getLocationData(): Promise<{ ip: string; city: string; region: string; country_name: string } | null> {
        try {
            // using ipapi.co free tier
            const response = await fetch('https://ipapi.co/json/');
            if (!response.ok) return null;
            return await response.json();
        } catch (error) {
            logger.error('Failed to fetch location data for audit', { error });
            return null;
        }
    }

    /**
     * Log the visitor audit. Will only execute once per session.
     */
    public async logVisitorAudit(): Promise<void> {
        try {
            // 1. Check if already logged this session
            if (sessionStorage.getItem(SESSION_STORAGE_KEY)) {
                return; // Already audited this session
            }

            // 2. Gather data
            const location = await this.getLocationData();
            const deviceId = this.getDeviceId();

            const auditData: Omit<AuditData, 'visitedAt'> = {
                ip: location?.ip || 'unknown',
                city: location?.city || 'unknown',
                region: location?.region || 'unknown',
                country: location?.country_name || 'unknown',
                deviceId: deviceId,
                userAgent: navigator.userAgent,
                language: navigator.language,
                path: window.location.pathname,
            };

            // 3. Save to Firestore
            const auditsRef = collection(db, AUDIT_COLLECTION);
            await addDoc(auditsRef, {
                ...auditData,
                visitedAt: serverTimestamp()
            });

            // 4. Mark session as logged
            sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
            logger.info('Visitor audit logged successfully.');

        } catch (error) {
            logger.error('Failed to run visitor audit', { error });
        }
    }
}

export const auditService = new AuditService();
