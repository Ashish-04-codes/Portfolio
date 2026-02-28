import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './AppRouter';
import { ErrorBoundary } from './components/common';
import { seedService } from './services';
import { auditService } from './services/audit.service';
import { SiteConfigProvider } from './context/SiteConfigContext';

const App: React.FC = () => {
  // Initialize database and log visit on first load
  useEffect(() => {
    seedService.seedDatabase();

    // Log the visit once per session
    auditService.logVisitorAudit();
  }, []);

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <SiteConfigProvider>
          <AppRouter />
        </SiteConfigProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App;

