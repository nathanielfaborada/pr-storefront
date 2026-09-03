import React from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { AdminUnauthorizedPage } from '../pages/admin/AdminUnauthorizedPage.tsx';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
}) => {
  const { isAuthenticated, isAdmin } = useAuth();

  // If user is not authenticated or lacks required admin rights, block with Unauthorized Page
  if (!isAuthenticated || (requireAdmin && !isAdmin)) {
    return <AdminUnauthorizedPage />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
