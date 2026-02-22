/**
 * AppRouter — defines the full route tree for the application.
 * Public routes use MainLayout, admin routes use AdminLayout with auth guards.
 */

import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { PageSkeleton } from './components/common';
import { PublicLayout } from './layouts/PublicLayout';
import { AdminLayoutWrapper } from './layouts/AdminLayoutWrapper';

// --- Lazy-loaded pages (code splitting) ---
const FrontPage = lazy(() => import('./pages/FrontPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ClassifiedsPage = lazy(() => import('./pages/ClassifiedsPage'));
const EditorialPage = lazy(() => import('./pages/EditorialPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const LoginPage = lazy(() => import('./pages/admin/LoginPage'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects'));
const AdminBlog = lazy(() => import('./pages/admin/AdminBlog'));
const AdminProfile = lazy(() => import('./pages/admin/AdminProfile'));
const AdminSkills = lazy(() => import('./pages/admin/AdminSkills'));
const AdminConfig = lazy(() => import('./pages/admin/AdminConfig'));

const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        {/* --- Public routes (wrapped in MainLayout) --- */}
        <Route element={<PublicLayout />}>
          <Route index element={<FrontPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="classifieds" element={<ClassifiedsPage />} />
          <Route path="editorial" element={<EditorialPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* --- Login (no layout wrapper) --- */}
        <Route
          path="login"
          element={
            <Suspense fallback={<PageSkeleton />}>
              <LoginPage />
            </Suspense>
          }
        />

        {/* --- Admin routes (protected + AdminLayout) --- */}
        <Route path="admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayoutWrapper />}>
            <Route index element={<AdminDashboard />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="skills" element={<AdminSkills />} />
            <Route path="config" element={<AdminConfig />} />
          </Route>
        </Route>

        {/* --- Redirects from old flat admin paths --- */}
        <Route path="admin-projects" element={<Navigate to="/admin/projects" replace />} />
        <Route path="admin-blog" element={<Navigate to="/admin/blog" replace />} />
        <Route path="admin-profile" element={<Navigate to="/admin/profile" replace />} />
        <Route path="admin-skills" element={<Navigate to="/admin/skills" replace />} />
        <Route path="admin-config" element={<Navigate to="/admin/config" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
