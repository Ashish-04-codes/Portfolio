import React from 'react';
import { Menu, X } from 'lucide-react';
import { Page } from '../../types';
import { NAV_LINKS } from '../../constants';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

/**
 * Main navigation component with desktop and mobile views
 */
export const Navigation: React.FC<NavigationProps> = React.memo(
  ({ currentPage, onNavigate, mobileMenuOpen, onToggleMobileMenu }) => {
    const handleNavigate = (page: Page) => {
      onNavigate(page);
      onToggleMobileMenu(); // Close menu after navigation on mobile
    };

    return (
      <div className="relative">
        {/* Mobile Menu Button */}
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 md:hidden p-2 z-50 no-print hover:bg-ink/5 rounded transition-colors"
          onClick={onToggleMobileMenu}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Navigation Strip */}
        <nav className="border-t border-ink py-3 hidden md:flex justify-center gap-8 lg:gap-12 font-bold font-headline uppercase tracking-widest text-sm transition-colors duration-300 no-print">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className={`hover:underline decoration-2 underline-offset-4 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink rounded px-1 ${
                currentPage === link.id ? 'underline' : ''
              }`}
              aria-current={currentPage === link.id ? 'page' : undefined}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-ink bg-newsprint py-4 px-6 pl-16 flex flex-col gap-4 font-bold font-headline uppercase tracking-widest text-lg no-print shadow-lg">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavigate(link.id)}
                className={`text-left hover:text-ink-light transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink rounded px-1 ${
                  currentPage === link.id ? 'underline decoration-2 underline-offset-4' : ''
                }`}
                aria-current={currentPage === link.id ? 'page' : undefined}
              >
                {link.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    );
  }
);
