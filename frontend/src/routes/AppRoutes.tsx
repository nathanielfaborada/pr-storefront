import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout.tsx';

// Customer / Public Storefront Pages
import { HomePage } from '../pages/customer/HomePage.tsx';
import { ProductDetailPage } from '../pages/customer/ProductDetailPage.tsx';
import { CheckoutPage } from '../pages/customer/CheckoutPage.tsx';
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
      {/* Standalone Fullscreen Non-Scrollable Admin Login */}
      <Route path="admin/login" element={<AdminLoginPage />} />

      <Route path="/" element={<MainLayout />}>
        {/* Customer / Public Storefront Routes */}
        <Route index element={<HomePage />} />
        <Route path="drops/:id" element={<ProductDetailPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="orders/:orderId" element={<OrderStatusPage />} />
        {/* Disabled Customer Pages (Redirect to Storefront) */}
        <Route path="login" element={<Navigate to="/" replace />} />
        <Route path="account" element={<Navigate to="/" replace />} />

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
          path="admin/supplies"
          element={
            <ProtectedRoute requireAdmin>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/chats"
          element={
            <ProtectedRoute requireAdmin>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/messages"
          element={
            <ProtectedRoute requireAdmin>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/assets"
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
