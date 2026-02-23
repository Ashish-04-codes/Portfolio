/**
 * AdminLayoutWrapper — wraps admin pages with the AdminLayout (sidebar + header).
 * Uses React Router's <Outlet> for nested route rendering.
 */

import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AdminLayout } from '../components/admin';
import { Toast } from '../components/admin';
import { useAppNavigate } from '../hooks/useAppNavigate';
import { useToast, useSessionTimeout } from '../hooks';
import { authService } from '../services';
import { pathToPage } from '../config/routes';
import { Modal, Button } from '../components/admin';
import { Clock } from 'lucide-react';
import { AdminDataProvider } from '../context/AdminDataContext';

export const AdminLayoutWrapper: React.FC = () => {
  const navigate = useAppNavigate();
  const location = useLocation();
  const currentPage = pathToPage(location.pathname);
  const { toast, hideToast, warning, success, error, info } = useToast();

  const handleLogout = async () => {
    await authService.logout();
    navigate('front');
  };

  // Session timeout handling
  const {
    showWarning: showTimeoutWarning,
    remainingSeconds,
    extendSession,
  } = useSessionTimeout({
    isAuthenticated: true,
    onTimeout: async () => {
      warning('Session expired. Please login again.');
      await handleLogout();
    },
    onWarning: () => {
      // Warning is shown via modal below
    },
  });

  const toastActions = { success, error, warning, info };

  return (
    <AdminDataProvider>
      <AdminLayout currentPage={currentPage} navigate={navigate} onLogout={handleLogout}>
        <Outlet context={toastActions} />
      </AdminLayout>

      {/* Session Timeout Warning Modal */}
      {showTimeoutWarning && (
        <Modal isOpen={showTimeoutWarning} onClose={extendSession} title="Session Expiring Soon">
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-yellow-50 border-l-4 border-yellow-500">
              <Clock className="text-yellow-600" size={32} />
              <div>
                <p className="font-mono text-sm font-bold text-yellow-800">
                  Your session will expire in {Math.ceil(remainingSeconds / 60)} minute
                  {Math.ceil(remainingSeconds / 60) !== 1 ? 's' : ''}
                </p>
                <p className="font-mono text-xs text-yellow-700 mt-1">
                  You'll be automatically logged out due to inactivity
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={handleLogout}>
                Logout Now
              </Button>
              <Button variant="primary" onClick={extendSession}>
                Stay Logged In
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Toast Notifications for Admin */}
      {toast.show && <Toast type={toast.type} message={toast.message} onClose={hideToast} />}
    </AdminDataProvider>
  );
};

