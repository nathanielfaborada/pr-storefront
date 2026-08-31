import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout.tsx';

// Customer / Public Storefront Pages
import { HomePage } from '../pages/customer/HomePage.tsx';
import { ProductDetailPage } from '../pages/customer/ProductDetailPage.tsx';
import { OrderStatusPage } from '../pages/customer/OrderStatusPage.tsx';
import { LoginPage } from '../pages/customer/LoginPage.tsx';
import { AccountPage } from '../pages/customer/AccountPage.tsx';
import { NotFoundPage } from '../pages/customer/NotFoundPage.tsx';

// Admin / Seller Studio Pages
import { AdminLoginPage } from '../pages/admin/AdminLoginPage.tsx';
import { AdminPage } from '../pages/admin/AdminPage.tsx';
import { AdminCuratePage } from '../pages/admin/AdminCuratePage.tsx';

import { ProtectedRoute } from './ProtectedRoute.tsx';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Customer / Public Storefront Routes */}
        <Route index element={<HomePage />} />
        <Route path="drops/:id" element={<ProductDetailPage />} />
        <Route path="orders/:orderId" element={<OrderStatusPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="admin/login" element={<AdminLoginPage />} />

        {/* Protected Admin / Seller Studio Routes */}
        <Route
          path="admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/products"
          element={
            <ProtectedRoute requireAdmin>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/orders"
          element={
            <ProtectedRoute requireAdmin>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/dispatch"
          element={
            <ProtectedRoute requireAdmin>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/holds"
          element={
            <ProtectedRoute requireAdmin>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/drops/new"
          element={
            <ProtectedRoute requireAdmin>
              <AdminCuratePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/drops/edit/:id"
          element={
            <ProtectedRoute requireAdmin>
              <AdminCuratePage />
            </ProtectedRoute>
          }
        />

        {/* 404 Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
