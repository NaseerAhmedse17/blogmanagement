import React, { memo } from 'react';

/**
 * PageHeader — consistent section title + subtitle + optional action slot.
 */
const PageHeader = memo(({ title, subtitle, action }) => (
  <div className="section-header">
    <div>
      <div className="section-title">{title}</div>
      {subtitle && <div className="section-sub">{subtitle}</div>}
    </div>
    {action && <div>{action}</div>}
  </div>
));

PageHeader.displayName = 'PageHeader';
export default PageHeader;
