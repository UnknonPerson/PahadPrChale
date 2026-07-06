import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
// @ts-expect-error - JS module
import authService from '../services/authService.js';

interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'user';
  avatar?: string;
  profileImage?: string;
  isEmailVerified?: boolean;
}

interface LoginResult {
  success: boolean;
  message?: string;
  user?: User;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  register: (name: string, email: string, phone: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; message?: string }>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Extract user object from any API response shape.
// Backend sends: { success, message, data: { user, token } }
// api.js interceptor returns response.data (the full body above).
function extractUser(payload: any): User | null {
  if (!payload) return null;
  // Prefer the nested data.user path (our backend's shape)
  const u = payload?.data?.user ?? payload?.user ?? payload;
  // Sanity-check: must have an email to be a real user object
  if (u && typeof u === 'object' && u.email) return u as User;
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // Guard against calling checkAuth more than once on mount
  const initialized = useRef(false);

  // Restore session on mount — single call, never repeated
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    authService.getCurrentUser()
      .then((payload: any) => {
        const u = extractUser(payload);
        setUser(u);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string): Promise<LoginResult> => {
    try {
      const payload = await authService.login(email, password);
      const u = extractUser(payload);
      if (!u) throw new Error('No user returned from server');
      setUser(u);
      return { success: true, user: u };
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Invalid email or password';
      return { success: false, message };
    }
  };

  const register = async (
    name: string,
    email: string,
    phone: string,
    password: string,
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const payload = await authService.register(name, email, phone, password);
      const u = extractUser(payload);
      if (u) setUser(u);
      return { success: true, message: 'Registration successful' };
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Registration failed';
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore — still clear local state
    } finally {
      setUser(null);
    }
  };

  const updateProfile = async (
    data: Partial<User>,
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const payload = await authService.updateProfile(data);
      const u = extractUser(payload);
      if (u) setUser(u);
      return { success: true, message: 'Profile updated successfully' };
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to update profile';
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
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
