import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Contexts
import { AuthProvider }  from './context/AuthContext';
import { PostProvider }  from './context/PostContext';
import { ToastProvider } from './context/ToastContext';

// Always-loaded layout & guards (tiny, needed immediately)
import Navbar         from './components/layout/Navbar';
import ErrorBoundary  from './components/common/ErrorBoundary';
import ProtectedRoute from './components/common/ProtectedRoute';
import ToastContainer from './components/common/Toast';

// ── Lazy-loaded pages (code splitting per route) ─────────────
const Home       = lazy(() => import('./pages/Home'));
const Dashboard  = lazy(() => import('./pages/Dashboard'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const NotFound   = lazy(() => import('./pages/NotFound'));
const Login      = lazy(() => import('./components/auth/Login'));
const Register   = lazy(() => import('./components/auth/Register'));
const PostDetail = lazy(() => import('./components/posts/PostDetail'));
const PostEditor = lazy(() => import('./components/posts/PostEditor'));

// Shared fallback while a lazy chunk loads
const PageFallback = () => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', minHeight: 'calc(100vh - 70px)', gap: '1rem',
  }}>
    <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
    <span style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>Loading…</span>
  </div>
);

const App = () => (
  <ErrorBoundary>
    <ToastProvider>
      <AuthProvider>
        <PostProvider>
          <Router>
            <Navbar />
            <ToastContainer />

            {/* Each route gets its own error boundary so one crash doesn't break the whole app */}
            <ErrorBoundary>
              <Suspense fallback={<PageFallback />}>
                <Routes>
                  {/* ── Public ── */}
                  <Route path="/"          element={<Home />} />
                  <Route path="/login"     element={<Login />} />
                  <Route path="/register"  element={<Register />} />
                  <Route path="/posts/:id" element={<PostDetail />} />

                  {/* ── Authenticated ── */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute><Dashboard /></ProtectedRoute>
                  } />
                  <Route path="/posts/new" element={
                    <ProtectedRoute><PostEditor /></ProtectedRoute>
                  } />
                  <Route path="/posts/:id/edit" element={
                    <ProtectedRoute><PostEditor /></ProtectedRoute>
                  } />

                  {/* ── Admin only ── */}
                  <Route path="/admin" element={
                    <ProtectedRoute requiredRole="admin"><AdminPanel /></ProtectedRoute>
                  } />

                  {/* ── Fallback ── */}
                  <Route path="/404" element={<NotFound />} />
                  <Route path="*"    element={<Navigate to="/404" replace />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </Router>
        </PostProvider>
      </AuthProvider>
    </ToastProvider>
  </ErrorBoundary>
);

export default App;
