import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="page">
    <div className="container text-center" style={{ paddingTop: '5rem' }}>
      <div className="error-boundary-code">404</div>
      <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--gray-800)', margin: '1rem 0 0.5rem' }}>
        Page not found
      </h2>
      <p style={{ color: 'var(--gray-400)', marginBottom: '2.5rem', fontSize: '1rem' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/" className="btn btn-primary btn-lg">🏠 Back to Home</Link>
        <Link to="/dashboard" className="btn btn-ghost btn-lg">📊 Dashboard</Link>
      </div>
    </div>
  </div>
);

export default NotFound;
