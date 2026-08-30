import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout.tsx';
import { HomePage } from '../pages/HomePage.tsx';
import { ProductDetailPage } from '../pages/ProductDetailPage.tsx';
import { OrderStatusPage } from '../pages/OrderStatusPage.tsx';
import { LoginPage } from '../pages/LoginPage.tsx';
import { AccountPage } from '../pages/AccountPage.tsx';
import { AdminLoginPage } from '../pages/AdminLoginPage.tsx';
import { AdminPage } from '../pages/AdminPage.tsx';
import { NotFoundPage } from '../pages/NotFoundPage.tsx';
import { ProtectedRoute } from './ProtectedRoute.tsx';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Public Storefront Routes */}
        <Route index element={<HomePage />} />
        <Route path="drops/:id" element={<ProductDetailPage />} />
        <Route path="orders/:orderId" element={<OrderStatusPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="admin/login" element={<AdminLoginPage />} />

        {/* Protected Admin / Vault Manager Route */}
        <Route
          path="admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        {/* 404 Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
