import React, { useEffect, memo } from 'react';

/**
 * ConfirmDialog — animated modal overlay for destructive confirmations.
 *
 * Props:
 *   isOpen       {boolean}
 *   title        {string}
 *   message      {string}
 *   confirmText  {string}   — default "Delete"
 *   cancelText   {string}   — default "Cancel"
 *   variant      {string}   — "danger" | "warning"  (default "danger")
 *   loading      {boolean}  — disables buttons + shows spinner on confirm
 *   onConfirm    {function}
 *   onCancel     {function}
 */
const ConfirmDialog = memo(({
  isOpen,
  title       = 'Are you sure?',
  message     = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText  = 'Cancel',
  variant     = 'danger',
  loading     = false,
  onConfirm,
  onCancel,
}) => {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape' && !loading) onCancel(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, loading, onCancel]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const isDanger  = variant === 'danger';
  const iconBg    = isDanger ? '#fef2f2' : '#fffbeb';
  const iconColor = isDanger ? '#ef4444' : '#f59e0b';
  const btnClass  = isDanger ? 'btn btn-danger' : 'btn btn-warning';

  return (
    /* Backdrop */
    <div
      onClick={!loading ? onCancel : undefined}
      style={{
        position: 'fixed', inset: 0, zIndex: 9998,
        background: 'rgba(15,23,42,0.55)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.15s ease',
      }}
    >
      {/* Dialog card */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--white)',
          borderRadius: '20px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
          padding: '2rem',
          width: '100%',
          maxWidth: 400,
          animation: 'dialogIn 0.2s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {/* Icon */}
        <div style={{
          width: 52, height: 52, borderRadius: '50%',
          background: iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.5rem', margin: '0 auto 1.25rem',
          border: `2px solid ${iconColor}22`,
        }}>
          {isDanger ? '🗑️' : '⚠️'}
        </div>

        {/* Text */}
        <h3 style={{
          fontSize: '1.1rem', fontWeight: 800,
          color: 'var(--gray-900)', textAlign: 'center',
          marginBottom: '0.5rem',
        }}>
          {title}
        </h3>
        <p style={{
          fontSize: '0.875rem', color: 'var(--gray-500)',
          textAlign: 'center', lineHeight: 1.6, marginBottom: '1.75rem',
        }}>
          {message}
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            className="btn btn-ghost"
            onClick={onCancel}
            disabled={loading}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            {cancelText}
          </button>
          <button
            className={btnClass}
            onClick={onConfirm}
            disabled={loading}
            style={{ flex: 1, justifyContent: 'center', color: '#ffffff' }}
          >
            {loading ? (
              <>
                <span className="spinner" style={{
                  width: 14, height: 14, borderWidth: 2,
                  borderColor: 'rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                }} />
                Deleting…
              </>
            ) : confirmText}
          </button>
        </div>
      </div>

      {/* Keyframe definitions injected once */}
      <style>{`
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes dialogIn {
          from { opacity: 0; transform: scale(0.88) translateY(12px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
      `}</style>
    </div>
  );
});

ConfirmDialog.displayName = 'ConfirmDialog';
export default ConfirmDialog;
