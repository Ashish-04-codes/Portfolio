import React from 'react';
import { Sun, Moon, Printer } from 'lucide-react';
import { Navigation } from './Navigation';
import { Page } from '../../types';
import { SITE_CONFIG } from '../../constants';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  subHeader: { left: string; center: string; right: string };
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

/**
 * Main header component with masthead and navigation
 */
export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  isDarkMode,
  onToggleTheme,
  subHeader,
  mobileMenuOpen,
  onToggleMobileMenu,
}) => {
  const handlePrint = () => window.print();

  return (
    <header
      className="relative z-10 w-full bg-newsprint border-b-4 border-double border-ink transition-colors duration-300"
      role="banner"
    >
      {/* Top Utility Bar */}
      <div className="w-full bg-newsprint border-b border-ink py-1 px-4 text-[10px] md:text-xs font-mono uppercase tracking-widest flex justify-between items-center transition-colors duration-300 no-print">
        <div className="flex items-center gap-4">
          <span>{SITE_CONFIG.location}</span>
          <button
            onClick={onToggleTheme}
            className="hover:text-ink-light flex items-center gap-1 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink rounded px-1"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <Sun size={12} className="group-hover:rotate-45 transition-transform" />
            ) : (
              <Moon size={12} className="group-hover:-rotate-12 transition-transform" />
            )}
            <span className="hidden xs:inline">
              {isDarkMode ? 'Morning Edition' : 'Evening Edition'}
            </span>
          </button>
          <button
            onClick={handlePrint}
            className="hover:text-ink-light flex items-center gap-1 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink rounded px-1"
            aria-label="Print resume"
          >
            <Printer size={12} />
            <span className="hidden xs:inline">Print Edition</span>
          </button>
        </div>
        <span className="hidden md:inline absolute left-1/2 -translate-x-1/2 font-bold">
          {subHeader.center}
        </span>
        <span>{subHeader.right}</span>
      </div>

      {/* Main Header Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="flex flex-col items-center justify-center relative">
          {/* Logo */}
          <h1
            onClick={() => onNavigate('front')}
            className="font-masthead text-5xl md:text-7xl lg:text-9xl tracking-tight text-center cursor-pointer hover:scale-[1.01] transition-transform duration-300 leading-none mb-2"
          >
            {SITE_CONFIG.title}
          </h1>
          <div className="text-sm font-mono italic mt-2">"{SITE_CONFIG.tagline}"</div>
        </div>
      </div>

      {/* Navigation */}
      <Navigation
        currentPage={currentPage}
        onNavigate={onNavigate}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={onToggleMobileMenu}
      />
    </header>
  );
};
