import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../features/auth/authStore';
import { LoadingScreen } from '../components/shared/LoadingScreen';

export function ProtectedRoute({ children, roles }) {
  const location = useLocation();
  const { isBootstrapping, isAuthenticated, user } = useAuthStore();

  if (isBootstrapping) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return children;
}
