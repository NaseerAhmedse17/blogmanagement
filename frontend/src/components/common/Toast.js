import React, { useEffect, useState } from 'react';
import { useToast } from '../../context/ToastContext';

const ICONS = {
  success: '✅',
  error:   '❌',
  warning: '⚠️',
  info:    'ℹ️',
};

const COLORS = {
  success: { bg: '#f0fdf4', border: '#86efac', bar: '#22c55e', text: '#166534' },
  error:   { bg: '#fef2f2', border: '#fca5a5', bar: '#ef4444', text: '#991b1b' },
  warning: { bg: '#fffbeb', border: '#fcd34d', bar: '#f59e0b', text: '#78350f' },
  info:    { bg: '#eff6ff', border: '#93c5fd', bar: '#3b82f6', text: '#1e40af' },
};

const ToastItem = ({ toast, onRemove }) => {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const c = COLORS[toast.type] || COLORS.info;

  useEffect(() => {
    // Trigger enter animation
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setLeaving(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderLeft: `4px solid ${c.bar}`,
        borderRadius: '12px',
        padding: '0.9rem 1rem',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        minWidth: 300,
        maxWidth: 420,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        opacity: visible && !leaving ? 1 : 0,
        transform: visible && !leaving ? 'translateX(0) scale(1)' : 'translateX(40px) scale(0.95)',
      }}
    >
      <span style={{ fontSize: '1.1rem', flexShrink: 0, marginTop: '0.05rem' }}>
        {ICONS[toast.type]}
      </span>
      <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: 500, color: c.text, lineHeight: 1.5 }}>
        {toast.message}
      </span>
      <button
        onClick={handleClose}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: c.text, opacity: 0.5, fontSize: '1rem', padding: '0 0.1rem',
          lineHeight: 1, flexShrink: 0, transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => e.target.style.opacity = 1}
        onMouseLeave={e => e.target.style.opacity = 0.5}
      >
        ×
      </button>

      {/* Progress bar */}
      {toast.duration > 0 && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, height: '3px',
          background: c.bar, borderRadius: '0 0 0 12px',
          animation: `toastProgress ${toast.duration}ms linear forwards`,
        }} />
      )}
    </div>
  );
};

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      right: '1.25rem',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.6rem',
      pointerEvents: 'none',
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{ pointerEvents: 'all' }}>
          <ToastItem toast={t} onRemove={removeToast} />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
