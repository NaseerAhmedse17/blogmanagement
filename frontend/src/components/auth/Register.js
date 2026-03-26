import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import FormField from '../ui/FormField';
import PasswordInput from '../ui/PasswordInput';
import PasswordStrengthMeter from '../ui/PasswordStrengthMeter';
import LoadingButton from '../ui/LoadingButton';
import AuthIllustrationPanel from './AuthIllustrationPanel';
import { ROUTES, PASSWORD_RULES } from '../../constants';

const ROLE_OPTIONS = [
  { value: 'author', icon: '✍️', label: 'Author', desc: 'Write & publish posts' },
  { value: 'admin',  icon: '⚡', label: 'Admin',  desc: 'Manage all content'   },
];

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, loading, error, clearError } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', role: 'author',
  });
  const [formErrors,      setFormErrors]      = useState({});
  const [passwordFocused, setPasswordFocused] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate(ROUTES.DASHBOARD, { replace: true });
  }, [isAuthenticated, navigate]);

  // Memoised rule results — recomputed only when password changes
  const ruleResults = useMemo(
    () => PASSWORD_RULES.map(r => ({ ...r, passed: r.test(formData.password) })),
    [formData.password]
  );

  const validate = () => {
    const errors = {};
    if (!formData.name.trim())
      errors.name = 'Full name is required';
    else if (formData.name.trim().length < 2)
      errors.name = 'Name must be at least 2 characters';

    if (!formData.email)
      errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = 'Enter a valid email address';

    if (!formData.password) {
      errors.password = 'Password is required';
    } else {
      const failed = ruleResults.filter(r => !r.passed);
      if (failed.length > 0)
        errors.password = `Must include: ${failed.map(r => r.label.toLowerCase()).join(', ')}`;
    }

    if (!formData.confirmPassword)
      errors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = 'Passwords do not match';

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
    const { confirmPassword, ...submitData } = formData;
    const result = await register(submitData);
    if (result?.success) toast.success('Account created! Welcome to BlogMS 🎉');
  };

  const passwordsMatch = formData.confirmPassword && formData.confirmPassword === formData.password;

  return (
    <div className="auth-page">
      <AuthIllustrationPanel variant="register" />

      <div className="auth-form-side">
        <div className="auth-card">
          <div className="auth-logo">BlogMS</div>
          <h1 className="auth-title">Create account ✨</h1>
          <p className="auth-subtitle">Join the community of writers and readers</p>

          {error && (
            <div className="alert alert-error" style={{ animation: 'fadeUp 0.2s ease' }}>
              <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>🚫</span>
              <div>
                <div style={{ fontWeight: 700, marginBottom: '0.15rem' }}>Registration failed</div>
                <div style={{ fontWeight: 400, fontSize: '0.825rem' }}>{error}</div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <FormField label="Full Name" htmlFor="name" error={formErrors.name} required>
              <input
                id="name" name="name" type="text" autoComplete="name"
                value={formData.name} onChange={handleChange}
                className={`form-input ${formErrors.name ? 'error' : ''}`}
                placeholder="John Doe"
              />
            </FormField>

            {/* Email */}
            <FormField label="Email Address" htmlFor="email" error={formErrors.email} required>
              <input
                id="email" name="email" type="email" autoComplete="email"
                value={formData.email} onChange={handleChange}
                className={`form-input ${formErrors.email ? 'error' : ''}`}
                placeholder="you@example.com"
              />
            </FormField>

            {/* Password + strength meter */}
            <FormField label="Password" htmlFor="password" error={formErrors.password} required>
              <PasswordInput
                id="password" name="password" autoComplete="new-password"
                value={formData.password} onChange={handleChange}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                className={formErrors.password ? 'error' : ''}
                placeholder="Create a strong password"
              />
              <PasswordStrengthMeter
                password={formData.password}
                focused={passwordFocused}
                showChecklist={!!formErrors.password}
              />
            </FormField>

            {/* Confirm password */}
            <FormField
              label="Confirm Password"
              htmlFor="confirmPassword"
              error={formErrors.confirmPassword}
              hint={passwordsMatch ? '✓ Passwords match' : undefined}
              required
            >
              <PasswordInput
                id="confirmPassword" name="confirmPassword" autoComplete="new-password"
                value={formData.confirmPassword} onChange={handleChange}
                className={
                  formErrors.confirmPassword ? 'error' :
                  passwordsMatch ? 'success-input' : ''
                }
                placeholder="Repeat your password"
              />
            </FormField>

            {/* Role selector */}
            <FormField label="I want to join as" htmlFor="role">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {ROLE_OPTIONS.map(r => (
                  <label key={r.value} style={{
                    display: 'flex', alignItems: 'center', gap: '0.6rem',
                    padding: '0.7rem 1rem',
                    border: `1.5px solid ${formData.role === r.value ? 'var(--p-500)' : 'var(--gray-200)'}`,
                    borderRadius: 'var(--r-lg)', cursor: 'pointer',
                    background: formData.role === r.value ? 'var(--p-50)' : 'white',
                    transition: 'all 0.2s',
                  }}>
                    <input type="radio" name="role" value={r.value}
                      checked={formData.role === r.value} onChange={handleChange}
                      style={{ accentColor: 'var(--p-600)' }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--gray-800)' }}>
                        {r.icon} {r.label}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)' }}>{r.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </FormField>

            <LoadingButton
              type="submit"
              loading={loading}
              loadingText="Creating account..."
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.25rem' }}
            >
              🚀 Create Account
            </LoadingButton>
          </form>

          <p className="auth-footer-text">
            Already have an account?{' '}
            <Link to={ROUTES.LOGIN} style={{ fontWeight: 700, color: 'var(--p-600)' }}>Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
