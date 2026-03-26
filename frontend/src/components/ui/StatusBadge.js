import React, { memo } from 'react';

const CONFIG = {
  published: { className: 'badge-published', dot: '●', label: 'Live'  },
  draft:     { className: 'badge-draft',     dot: '○', label: 'Draft' },
};

/**
 * StatusBadge — displays post published/draft status.
 */
const StatusBadge = memo(({ status }) => {
  const cfg = CONFIG[status] || CONFIG.draft;
  return (
    <span className={`badge ${cfg.className}`} style={{ flexShrink: 0 }}>
      {cfg.dot} {cfg.label}
    </span>
  );
});

StatusBadge.displayName = 'StatusBadge';
export default StatusBadge;
