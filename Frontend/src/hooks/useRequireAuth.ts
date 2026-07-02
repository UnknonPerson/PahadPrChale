import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function useRequireAuth() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const requireAuth = useCallback(
    (redirectPath?: string) => {
      if (!isAuthenticated) {
        navigate('/login', {
          state: { from: { pathname: redirectPath || location.pathname + location.search } },
          replace: true,
        });
        return false;
      }
      return true;
    },
    [isAuthenticated, navigate, location]
  );

  return { requireAuth, isAuthenticated };
}
