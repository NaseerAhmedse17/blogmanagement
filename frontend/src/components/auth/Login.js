import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import FormField from '../ui/FormField';
import PasswordInput from '../ui/PasswordInput';
import LoadingButton from '../ui/LoadingButton';
import AuthIllustrationPanel from './AuthIllustrationPanel';
import { ROUTES } from '../../constants';

const Login = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login, isAuthenticated, loading, error, clearError } = useAuth();
  const { toast } = useToast();

  const [formData,   setFormData]   = useState({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate(location.state?.from?.pathname || ROUTES.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const validate = () => {
    const errors = {};
    if (!formData.email)
      errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = 'Enter a valid email address';
    if (!formData.password)
      errors.password = 'Password is required';
    else if (formData.password.length < 6)
      errors.password = 'Password must be at least 6 characters';
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (formErrors[name]) setFormErrors(p => ({ ...p, [name]: '' }));
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    const result = await login(formData);
    if (result?.success) toast.success('Welcome back! 👋');
  };

  return (
    <div className="auth-page">
      <AuthIllustrationPanel variant="login" />

      <div className="auth-form-side">
        <div className="auth-card">
          <div className="auth-logo">BlogMS</div>
          <h1 className="auth-title">Welcome back 👋</h1>
          <p className="auth-subtitle">Sign in to continue to your dashboard</p>

          {error && (
            <div className="alert alert-error" style={{ animation: 'fadeUp 0.2s ease' }}>
              <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>🚫</span>
              <div>
                <div style={{ fontWeight: 700, marginBottom: '0.15rem' }}>Incorrect credentials</div>
                <div style={{ fontWeight: 400, fontSize: '0.825rem' }}>{error}</div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <FormField label="Email Address" htmlFor="email" error={formErrors.email} required>
              <input
                id="email" name="email" type="email" autoComplete="email"
                value={formData.email} onChange={handleChange}
                className={`form-input ${formErrors.email || error ? 'error' : ''}`}
                placeholder="you@example.com"
              />
            </FormField>

            <FormField label="Password" htmlFor="password" error={formErrors.password} required>
              <PasswordInput
                id="password" name="password" autoComplete="current-password"
                value={formData.password} onChange={handleChange}
                className={formErrors.password || error ? 'error' : ''}
                placeholder="Your password"
              />
            </FormField>

            <LoadingButton
              type="submit"
              loading={loading}
              loadingText="Signing in..."
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              🔑 Sign In
            </LoadingButton>
          </form>

          <p className="auth-footer-text">
            Don't have an account?{' '}
            <Link to={ROUTES.REGISTER} style={{ fontWeight: 700, color: 'var(--p-600)' }}>
              Create one free →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
