/**
 * Admin Layout Component
 * Wrapper layout for admin panel pages with sidebar navigation
 */

import React from 'react';
import { Page } from '../../types';
import { Sidebar } from './Sidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  navigate: (page: Page) => void;
  onLogout: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  currentPage,
  navigate, 
  onLogout,
}) => {
  return (
    <div className="min-h-screen bg-surface">
      {/* Sidebar Navigation */}
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={navigate} 
        onLogout={onLogout} 
      />

      {/* Main Content Area */}
      <div className="lg:ml-64">
        {/* Top Bar - Optional, for spacing on mobile */}
        <div className="h-16 lg:hidden" /> {/* Spacer for mobile menu button */}

        {/* Admin Content */}
        <main className="container mx-auto px-4 lg:px-8 py-8 max-w-7xl">
          {children}
        </main>

        {/* Admin Footer */}
        <footer className="border-t-2 border-ink bg-newsprint mt-16">
          <div className="container mx-auto px-4 py-6 text-center">
            <p className="font-mono text-xs text-ink/60">
              Daily Developer CMS • Manage your portfolio content
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};
