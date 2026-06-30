import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import authService from '../services/authService';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'user';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, phone: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; message?: string }>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const response = await authService.getCurrentUser();
      const userData = response.data || response;
      setUser(userData);
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      const userData = response.data || response.user || response;
      setUser(userData);
      return { success: true, message: 'Login successful' };
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, phone: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    try {
      const response = await authService.register(name, email, password, phone);
      const userData = response.data || response.user || response;
      setUser(userData);
      return { success: true, message: 'Registration successful' };
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Registration failed';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await authService.updateProfile(data);
      const userData = response.data || response;
      setUser(userData);
      return { success: true, message: 'Profile updated successfully' };
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to update profile';
      return { success: false, message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateProfile,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
