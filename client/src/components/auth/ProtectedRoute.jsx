import { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import AdminLayout from '../layout/AdminLayout';
import LoadingScreen from '../ui/LoadingScreen';

export default function ProtectedRoute() {
  const { isAuthenticated, token, checkAuth } = useAuthStore();

  useEffect(() => {
    if (token && !isAuthenticated) {
      checkAuth();
    }
  }, [token, isAuthenticated, checkAuth]);

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  if (token && !isAuthenticated) {
    return <LoadingScreen />;
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
