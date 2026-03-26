import React, { memo } from 'react';

/**
 * LoadingButton — a button that shows a spinner and disabled state while loading.
 * Keeps the same width to prevent layout shift.
 */
const LoadingButton = memo(({
  loading = false,
  loadingText = 'Loading...',
  children,
  className = 'btn btn-primary',
  spinnerStyle = {},
  style = {},
  ...props
}) => (
  <button
    className={className}
    disabled={loading || props.disabled}
    style={{ minWidth: 120, ...style }}
    {...props}
  >
    {loading ? (
      <>
        <span className="spinner" style={{ width: 15, height: 15, borderWidth: 2, ...spinnerStyle }} />
        {loadingText}
      </>
    ) : children}
  </button>
));

LoadingButton.displayName = 'LoadingButton';
export default LoadingButton;
