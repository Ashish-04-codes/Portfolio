import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './AppRouter';
import { ErrorBoundary } from './components/common';
import { seedService } from './services';
import { SiteConfigProvider } from './context/SiteConfigContext';

const App: React.FC = () => {
  // Initialize database on first load
  useEffect(() => {
    seedService.seedDatabase();
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

