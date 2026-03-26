import React, { memo, useMemo } from 'react';
import { PASSWORD_RULES, getPasswordStrength } from '../../constants';

/**
 * PasswordStrengthMeter — shows a coloured strength bar + rule checklist.
 * Rendered only when password has content.
 * Checklist visible while focused or when there's a validation error.
 */
const PasswordStrengthMeter = memo(({ password = '', focused = false, showChecklist = false }) => {
  const ruleResults = useMemo(
    () => PASSWORD_RULES.map(r => ({ ...r, passed: r.test(password) })),
    [password]
  );
  const strength = useMemo(() => getPasswordStrength(password), [password]);

  if (!password) return null;

  return (
    <>
      {/* Strength bar */}
      <div style={{ marginTop: '0.6rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: 500 }}>
            Password strength
          </span>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: strength.color }}>
            {strength.label}
          </span>
        </div>
        <div style={{ height: 5, background: 'var(--gray-150)', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 999,
            background: strength.color, width: strength.width,
            transition: 'width 0.35s ease, background 0.3s ease',
          }} />
        </div>
      </div>

      {/* Rule checklist */}
      {(focused || showChecklist) && (
        <div style={{
          marginTop: '0.6rem', padding: '0.75rem 0.9rem',
          background: 'var(--gray-50)', border: '1px solid var(--gray-200)',
          borderRadius: 'var(--r-lg)', display: 'flex', flexDirection: 'column', gap: '0.35rem',
        }}>
          {ruleResults.map(r => (
            <div key={r.id} style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              fontSize: '0.8rem', color: r.passed ? 'var(--success-dark)' : 'var(--gray-500)',
              transition: 'color 0.2s',
            }}>
              <span style={{
                width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.65rem', fontWeight: 700,
                background: r.passed ? 'var(--success-light)' : 'var(--gray-200)',
                color:      r.passed ? 'var(--success-dark)'  : 'var(--gray-400)',
                transition: 'all 0.2s',
              }}>
                {r.passed ? '✓' : '·'}
              </span>
              {r.label}
            </div>
          ))}
        </div>
      )}
    </>
  );
});

PasswordStrengthMeter.displayName = 'PasswordStrengthMeter';
export default PasswordStrengthMeter;
