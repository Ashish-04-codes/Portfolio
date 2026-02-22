/**
 * Activity Logging Service
 * Track admin actions for security audit trail
 * Logs stored in localStorage
 */

import { generateId } from '../utils/helpers';
import { logger } from '../utils/logger';

export interface ActivityLog {
  id: string;
  action: ActivityAction;
  entityType: EntityType;
  entityId?: string;
  entityName?: string;
  userEmail: string | null;
  timestamp: string;
  details?: string;
  ipAddress?: string;
}

export type ActivityAction =
  | 'login'
  | 'logout'
  | 'login_failed'
  | 'create'
  | 'update'
  | 'delete'
  | 'publish'
  | 'unpublish';

export type EntityType = 'auth' | 'project' | 'blog' | 'profile' | 'skill' | 'config';

const STORAGE_KEY = 'admin_activity_logs';
const MAX_LOGS = 1000; // Keep last 1000 logs

class ActivityService {
  /**
   * Log an activity
   */
  log(params: {
    action: ActivityAction;
    entityType: EntityType;
    entityId?: string;
    entityName?: string;
    userEmail: string | null;
    details?: string;
  }): void {
    const log: ActivityLog = {
      id: generateId(),
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      entityName: params.entityName,
      userEmail: params.userEmail,
      timestamp: new Date().toISOString(),
      details: params.details,
    };

    const logs = this.getAllLogs();
    logs.unshift(log); // Add to beginning

    // Keep only MAX_LOGS most recent logs
    const trimmedLogs = logs.slice(0, MAX_LOGS);

    this.saveLogs(trimmedLogs);
  }

  /**
   * Get all activity logs
   */
  getAllLogs(): ActivityLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];

      return JSON.parse(data);
    } catch (error) {
      logger.error('Error reading activity logs', { error });
      return [];
    }
  }

  /**
   * Get recent activity logs (last N days)
   */
  getRecentLogs(days: number = 7): ActivityLog[] {
    const logs = this.getAllLogs();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return logs.filter((log) => new Date(log.timestamp) >= cutoffDate);
  }

  /**
   * Get logs by entity type
   */
  getLogsByEntity(entityType: EntityType): ActivityLog[] {
    return this.getAllLogs().filter((log) => log.entityType === entityType);
  }

  /**
   * Get logs by action
   */
  getLogsByAction(action: ActivityAction): ActivityLog[] {
    return this.getAllLogs().filter((log) => log.action === action);
  }

  /**
   * Get failed login attempts
   */
  getFailedLoginAttempts(hours: number = 1): ActivityLog[] {
    const logs = this.getAllLogs();
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - hours);

    return logs.filter(
      (log) =>
        log.action === 'login_failed' &&
        log.entityType === 'auth' &&
        new Date(log.timestamp) >= cutoffDate
    );
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  /**
   * Export logs as CSV
   */
  exportToCSV(): string {
    const logs = this.getAllLogs();

    const headers = ['Timestamp', 'Action', 'Entity Type', 'Entity Name', 'User Email', 'Details'];
    const rows = logs.map((log) => [
      new Date(log.timestamp).toLocaleString(),
      log.action,
      log.entityType,
      log.entityName || '-',
      log.userEmail || 'Unknown',
      log.details || '-',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    return csvContent;
  }

  /**
   * Download logs as CSV file
   */
  downloadLogsAsCSV(): void {
    const csv = this.exportToCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-logs-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Get activity summary statistics
   */
  getStats(days: number = 7): {
    totalActions: number;
    logins: number;
    failedLogins: number;
    creates: number;
    updates: number;
    deletes: number;
  } {
    const logs = this.getRecentLogs(days);

    return {
      totalActions: logs.length,
      logins: logs.filter((l) => l.action === 'login').length,
      failedLogins: logs.filter((l) => l.action === 'login_failed').length,
      creates: logs.filter((l) => l.action === 'create').length,
      updates: logs.filter((l) => l.action === 'update').length,
      deletes: logs.filter((l) => l.action === 'delete').length,
    };
  }

  // Private methods

  private saveLogs(logs: ActivityLog[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    } catch (error) {
      logger.error('Error saving activity logs', { error });
    }
  }

  // ID generation now uses the shared generateId() utility
}

export const activityService = new ActivityService();
