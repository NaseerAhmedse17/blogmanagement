import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { authAPI } from '../utils/api';
import { getErrorMessage } from '../utils/helpers';

// ── State shape ─────────────────────────────────────────────
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true, // true while we verify stored tokens on mount
  error: null,
};

// ── Reducer ─────────────────────────────────────────────────
const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      // Keep existing error visible during loading so it doesn't flash away on re-submit
      return { ...state, loading: true };
    case 'AUTH_SUCCESS':
      return { ...state, loading: false, user: action.payload, isAuthenticated: true, error: null };
    case 'AUTH_FAIL':
      return { ...state, loading: false, error: action.payload, isAuthenticated: false, user: null };
    case 'AUTH_LOGOUT':
      return { ...state, loading: false, user: null, isAuthenticated: false, error: null };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'INIT_DONE':
      return { ...state, loading: false };
    default:
      return state;
  }
};

// ── Context ─────────────────────────────────────────────────
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // On mount: check if we have valid tokens and restore the session
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        dispatch({ type: 'INIT_DONE' });
        return;
      }
      try {
        const { data } = await authAPI.getMe();
        dispatch({ type: 'AUTH_SUCCESS', payload: data.user });
      } catch {
        // Token invalid or expired - the axios interceptor will attempt refresh
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        dispatch({ type: 'INIT_DONE' });
      }
    };
    initAuth();
  }, []);

  // ── Actions ────────────────────────────────────────────────

  const register = useCallback(async (formData) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const { data } = await authAPI.register(formData);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      dispatch({ type: 'AUTH_SUCCESS', payload: data.user });
      return { success: true };
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch({ type: 'AUTH_FAIL', payload: message });
      return { success: false, error: message };
    }
  }, []);

  const login = useCallback(async (formData) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const { data } = await authAPI.login(formData);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      dispatch({ type: 'AUTH_SUCCESS', payload: data.user });
      return { success: true };
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch({ type: 'AUTH_FAIL', payload: message });
      return { success: false, error: message };
    }
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      await authAPI.logout(refreshToken);
    } catch {
      // Silently ignore logout errors
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    dispatch({ type: 'AUTH_LOGOUT' });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value = {
    ...state,
    register,
    login,
    logout,
    clearError,
    isAdmin: state.user?.role === 'admin',
    isAuthor: state.user?.role === 'author',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Named export for the hook - consumed by useAuth custom hook
export { AuthContext };
export default AuthContext;
