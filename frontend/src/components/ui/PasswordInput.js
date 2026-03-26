import React, { useState, memo } from 'react';

/**
 * PasswordInput — text input with an inline show/hide toggle button.
 * Fully controlled — accepts all standard input props.
 */
const PasswordInput = memo(({ className = '', style = {}, ...props }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <input
        {...props}
        type={visible ? 'text' : 'password'}
        className={`form-input ${className}`}
        style={{ paddingRight: '2.75rem', ...style }}
      />
      <button
        type="button"
        onClick={() => setVisible(v => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        style={{
          position: 'absolute', right: '0.85rem', top: '50%',
          transform: 'translateY(-50%)',
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: '1rem', color: 'var(--gray-400)', padding: '0.1rem', lineHeight: 1,
        }}
      >
        {visible ? '🙈' : '👁'}
      </button>
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';
export default PasswordInput;
