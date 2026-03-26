import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

/**
 * withAuth HOC - Wraps a component and redirects to /login
 * if the user is not authenticated, or to /dashboard if the
 * user's role doesn't match the required role.
 *
 * @param {React.Component} WrappedComponent
 * @param {string|null} requiredRole - 'admin' | 'author' | null (any authenticated user)
 */
const withAuth = (WrappedComponent, requiredRole = null) => {
  const AuthenticatedComponent = (props) => {
    const { isAuthenticated, user, loading } = useAuth();

    // Wait for auth state to initialise before redirecting
    if (loading) {
      return (
        <div className="loading-page">
          <div className="spinner" />
        </div>
      );
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    if (requiredRole && user?.role !== requiredRole) {
      return <Navigate to="/dashboard" replace />;
    }

    return <WrappedComponent {...props} />;
  };

  // Useful display name in React DevTools
  AuthenticatedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AuthenticatedComponent;
};

export default withAuth;
