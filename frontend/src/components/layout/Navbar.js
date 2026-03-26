import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // Add shadow on scroll
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <>
      <nav className="navbar" style={scrolled ? { boxShadow: '0 4px 24px rgba(0,0,0,0.1)' } : {}}>
        <div className="navbar-inner">
          {/* Brand */}
          <Link to="/" className="navbar-brand">
            <span className="navbar-logo-dot" />
            BlogMS
          </Link>

          {/* Desktop nav */}
          <div className="navbar-nav">
            <NavLink to="/" className="nav-link" end>Blog</NavLink>

            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
                <NavLink to="/posts/new" className="nav-link">
                  <span style={{ marginRight: '2px' }}>+</span> New Post
                </NavLink>
                {isAdmin && (
                  <NavLink to="/admin" className="nav-link">Stats</NavLink>
                )}

                {/* User pill */}
                <div className="nav-user-pill">
                  <div className="nav-avatar">{initials}</div>
                  <span className="nav-user-name">{user?.name}</span>
                  <span className={`badge ${isAdmin ? 'badge-admin' : 'badge-author'}`}>
                    {user?.role}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="btn btn-ghost btn-sm"
                    style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <NavLink to="/login" className="nav-link">Sign In</NavLink>
                <Link to="/register" className="btn btn-primary btn-sm" style={{ marginLeft: '0.25rem' }}>
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className={`navbar-toggle ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/" className="mobile-nav-link" end>🏠 Blog</NavLink>

          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className="mobile-nav-link">📊 Dashboard</NavLink>
              <NavLink to="/posts/new" className="mobile-nav-link">✏️ New Post</NavLink>
              {isAdmin && <NavLink to="/admin" className="mobile-nav-link">📈 Statistics</NavLink>}

              <div style={{ borderTop: '1px solid var(--gray-100)', marginTop: '0.5rem', paddingTop: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem', marginBottom: '0.5rem' }}>
                  <div className="nav-avatar" style={{ width: 36, height: 36, fontSize: '0.85rem' }}>{initials}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--gray-800)' }}>{user?.name}</div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--gray-400)' }}>{user?.email}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="mobile-nav-link w-full"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', textAlign: 'left', width: '100%' }}
                >
                  🚪 Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <NavLink to="/login" className="mobile-nav-link">🔑 Sign In</NavLink>
              <NavLink to="/register" className="mobile-nav-link">🚀 Get Started</NavLink>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
