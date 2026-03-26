import React, { memo } from 'react';

/**
 * EmptyState — reusable empty content placeholder.
 */
const EmptyState = memo(({ icon = '📭', title, message, action }) => (
  <div className="empty-state">
    <div className="empty-state-icon">{icon}</div>
    {title   && <h3>{title}</h3>}
    {message && <p>{message}</p>}
    {action  && <div style={{ marginTop: '1.25rem' }}>{action}</div>}
  </div>
));

EmptyState.displayName = 'EmptyState';
export default EmptyState;
