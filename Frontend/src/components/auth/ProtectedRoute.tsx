import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PageLoader } from '../ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location }, replace: true });
    } else if (adminOnly && !isAdmin) {
      navigate('/', { replace: true });
    }
  }, [loading, isAuthenticated, isAdmin, adminOnly, navigate, location]);

  if (loading) return <PageLoader />;
  if (!isAuthenticated) return null;
  if (adminOnly && !isAdmin) return null;

  return <>{children}</>;
}
