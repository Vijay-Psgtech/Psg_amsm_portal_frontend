import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as authService from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const requestVersion = useRef(0);

  const refreshUser = useCallback(async () => {
    const version = ++requestVersion.current;
    setStatus('loading');
    setError(null);
    try {
      const currentUser = await authService.getCurrentUser();
      if (version === requestVersion.current) {
        setUser(currentUser);
        setStatus('authenticated');
      }
      return currentUser;
    } catch (requestError) {
      if (version === requestVersion.current) {
        setUser(null);
        if (requestError.status === 401) {
          setStatus('unauthenticated');
          setError(null);
        } else {
          setStatus('error');
          setError(requestError);
        }
      }
      return null;
    }
  }, []);

  const login = useCallback(async (credentials) => {
    const version = ++requestVersion.current;
    setStatus('loading');
    setError(null);
    try {
      const currentUser = await authService.login(credentials);
      if (version === requestVersion.current) {
        setUser(currentUser);
        setStatus('authenticated');
      }
      return currentUser;
    } catch (requestError) {
      if (version === requestVersion.current) {
        setUser(null);
        setStatus('unauthenticated');
        setError(requestError);
      }
      throw requestError;
    }
  }, []);

  const logout = useCallback(async () => {
    const version = ++requestVersion.current;
    setStatus('loading');
    setError(null);
    try {
      await authService.logout();
      if (version === requestVersion.current) {
        setUser(null);
        setStatus('unauthenticated');
      }
    } catch (requestError) {
      if (version === requestVersion.current) {
        setStatus(user ? 'authenticated' : 'error');
        setError(requestError);
      }
      throw requestError;
    }
  }, [user]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const value = useMemo(
    () => ({
      user,
      profile: user?.profile || null,
      status,
      error,
      isLoading: status === 'loading',
      isAuthenticated: status === 'authenticated' && Boolean(user),
      login,
      logout,
      refreshUser,
    }),
    [user, status, error, login, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }
  return context;
}
