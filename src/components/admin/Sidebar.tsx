/**
 * Admin Sidebar Component
 * Navigation menu for admin panel
 */

import React, { useState } from 'react';
import { Page } from '../../types';
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  User,
  Code,
  Settings,
  Home,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from '../../hooks';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

interface NavItem {
  page: Page;
  icon: React.ReactNode;
  label: string;
}

const navItems: NavItem[] = [
  { page: 'admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { page: 'admin-projects', icon: <FolderOpen size={20} />, label: 'Projects' },
  { page: 'admin-blog', icon: <FileText size={20} />, label: 'Blog Posts' },
  { page: 'admin-profile', icon: <User size={20} />, label: 'Profile' },
  { page: 'admin-skills', icon: <Code size={20} />, label: 'Skills' },
  { page: 'admin-config', icon: <Settings size={20} />, label: 'Site Config' },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, onLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  const handleNavigate = (page: Page) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-[calc(100%-4rem)]">
      {/* Navigation Items — scrollable */}
      <nav className="flex-1 py-6 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <li key={item.page}>
                <button
                  onClick={() => handleNavigate(item.page)}
                  className={`w-full flex items-center gap-3 px-6 py-3 font-mono text-sm transition-colors ${isActive ? 'bg-ink text-newsprint' : 'text-ink hover:bg-surface'
                    }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="border-t-2 border-ink">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-6 py-3 font-mono text-sm text-ink hover:bg-surface transition-colors"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <button
          onClick={() => {
            onNavigate('front');
            setMobileOpen(false);
          }}
          className="w-full flex items-center gap-3 px-6 py-3 font-mono text-sm text-ink hover:bg-surface transition-colors"
        >
          <Home size={20} />
          <span>View Site</span>
        </button>
        <button
          onClick={() => {
            onLogout();
            setMobileOpen(false);
          }}
          className="w-full flex items-center gap-3 px-6 py-3 font-mono text-sm text-ink hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-ink text-newsprint border-2 border-ink"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-ink/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:block w-64 bg-newsprint border-r-4 border-ink fixed left-0 top-0 h-full z-30">
        <div className="h-16 flex items-center justify-center border-b-4 border-ink">
          <h1 className="font-sans font-black text-xl uppercase tracking-tight">Admin Panel</h1>
        </div>
        {sidebarContent}
      </aside>

      {/* Sidebar - Mobile */}
      <aside
        className={`lg:hidden fixed left-0 top-0 h-full w-64 bg-newsprint border-r-4 border-ink z-50 transform transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="h-16 flex items-center justify-center border-b-4 border-ink">
          <h1 className="font-sans font-black text-xl uppercase tracking-tight">Admin Panel</h1>
        </div>
        {sidebarContent}
      </aside>
    </>
  );
};
