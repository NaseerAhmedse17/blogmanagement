// ── Avatar colours ──────────────────────────────────────────
export const AVATAR_GRADIENTS = [
  'linear-gradient(135deg,#6366f1,#4338ca)',
  'linear-gradient(135deg,#06b6d4,#0891b2)',
  'linear-gradient(135deg,#10b981,#059669)',
  'linear-gradient(135deg,#f59e0b,#d97706)',
  'linear-gradient(135deg,#ef4444,#dc2626)',
  'linear-gradient(135deg,#8b5cf6,#7c3aed)',
];

/** Pick a deterministic gradient from a string (e.g. author name). */
export const getAvatarGradient = (str = '') =>
  AVATAR_GRADIENTS[(str.charCodeAt(0) || 0) % AVATAR_GRADIENTS.length];

// ── Roles ────────────────────────────────────────────────────
export const ROLES = { ADMIN: 'admin', AUTHOR: 'author' };

// ── Post statuses ────────────────────────────────────────────
export const POST_STATUS = { DRAFT: 'draft', PUBLISHED: 'published' };

// ── Password rules (shared between Register UI + backend-matching logic) ──
export const PASSWORD_RULES = [
  { id: 'length',    test: p => p.length >= 8,   label: 'At least 8 characters'  },
  { id: 'uppercase', test: p => /[A-Z]/.test(p), label: 'One uppercase letter'   },
  { id: 'lowercase', test: p => /[a-z]/.test(p), label: 'One lowercase letter'   },
  { id: 'number',    test: p => /[0-9]/.test(p), label: 'One number'             },
];

export const getPasswordStrength = (password) => {
  if (!password) return { label: '', color: 'var(--gray-200)', width: '0%', score: 0 };
  const passed = PASSWORD_RULES.filter(r => r.test(password)).length;
  if (passed === 1) return { label: 'Weak',   color: 'var(--danger)',  width: '25%',  score: 1 };
  if (passed === 2) return { label: 'Fair',   color: 'var(--warning)', width: '50%',  score: 2 };
  if (passed === 3) return { label: 'Good',   color: '#84cc16',        width: '75%',  score: 3 };
  if (passed === 4) return { label: 'Strong', color: 'var(--success)', width: '100%', score: 4 };
  return { label: '', color: 'var(--gray-200)', width: '0%', score: 0 };
};

// ── Routes ───────────────────────────────────────────────────
export const ROUTES = {
  HOME:      '/',
  LOGIN:     '/login',
  REGISTER:  '/register',
  DASHBOARD: '/dashboard',
  ADMIN:     '/admin',
  NEW_POST:  '/posts/new',
  POST:      (id) => `/posts/${id}`,
  EDIT_POST: (id) => `/posts/${id}/edit`,
};
