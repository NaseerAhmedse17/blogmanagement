import React from 'react';

// Single skeleton post card
export const SkeletonPostCard = () => (
  <div style={{
    background: 'white',
    borderRadius: '20px',
    border: '1px solid #f1f5f9',
    padding: '1.6rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem',
  }}>
    {/* Title row */}
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
      <div className="skeleton" style={{ height: 20, flex: 1, borderRadius: 8 }} />
      <div className="skeleton" style={{ height: 20, width: 70, borderRadius: 999 }} />
    </div>
    {/* Author row */}
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <div className="skeleton" style={{ width: 22, height: 22, borderRadius: '50%' }} />
      <div className="skeleton" style={{ height: 14, width: 100, borderRadius: 6 }} />
      <div className="skeleton" style={{ height: 14, width: 80, borderRadius: 6 }} />
    </div>
    {/* Excerpt lines */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <div className="skeleton" style={{ height: 14, width: '100%', borderRadius: 6 }} />
      <div className="skeleton" style={{ height: 14, width: '90%', borderRadius: 6 }} />
      <div className="skeleton" style={{ height: 14, width: '75%', borderRadius: 6 }} />
    </div>
    {/* Tags */}
    <div style={{ display: 'flex', gap: '0.4rem' }}>
      {[60, 75, 50].map((w, i) => (
        <div key={i} className="skeleton" style={{ height: 22, width: w, borderRadius: 999 }} />
      ))}
    </div>
    {/* Footer */}
    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
      <div className="skeleton" style={{ height: 32, width: 90, borderRadius: 999 }} />
      <div style={{ display: 'flex', gap: '0.4rem' }}>
        <div className="skeleton" style={{ height: 32, width: 55, borderRadius: 999 }} />
        <div className="skeleton" style={{ height: 32, width: 70, borderRadius: 999 }} />
      </div>
    </div>
  </div>
);

// Grid of skeleton cards
export const SkeletonGrid = ({ count = 6 }) => (
  <div className="post-grid">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonPostCard key={i} />
    ))}
  </div>
);

// Skeleton for post detail page
export const SkeletonPostDetail = () => (
  <div style={{ maxWidth: 780, margin: '0 auto', padding: '2rem 1.5rem' }}>
    <div className="skeleton" style={{ height: 16, width: 100, borderRadius: 8, marginBottom: '2rem' }} />
    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
      <div className="skeleton" style={{ height: 22, width: 80, borderRadius: 999 }} />
      <div className="skeleton" style={{ height: 22, width: 60, borderRadius: 999 }} />
    </div>
    {/* Title */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
      <div className="skeleton" style={{ height: 36, width: '90%', borderRadius: 10 }} />
      <div className="skeleton" style={{ height: 36, width: '65%', borderRadius: 10 }} />
    </div>
    {/* Meta */}
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
      {[140, 110, 90, 80].map((w, i) => (
        <div key={i} className="skeleton" style={{ height: 16, width: w, borderRadius: 6 }} />
      ))}
    </div>
    {/* Content */}
    <div style={{ background: 'white', borderRadius: 24, border: '1px solid #f1f5f9', padding: '2.5rem' }}>
      {[100, 95, 88, 100, 70, 92, 85, 78, 100, 60].map((w, i) => (
        <div key={i} className="skeleton" style={{ height: 16, width: `${w}%`, borderRadius: 6, marginBottom: '0.7rem' }} />
      ))}
    </div>
  </div>
);

// Skeleton for stats panel
export const SkeletonStats = () => (
  <div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} style={{ background: 'white', borderRadius: 20, border: '1px solid #f1f5f9', padding: '1.4rem', display: 'flex', gap: '1rem' }}>
          <div className="skeleton" style={{ width: 48, height: 48, borderRadius: 12, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton" style={{ height: 28, width: '70%', borderRadius: 8, marginBottom: '0.4rem' }} />
            <div className="skeleton" style={{ height: 12, width: '90%', borderRadius: 6 }} />
          </div>
        </div>
      ))}
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
      {[0, 1].map(i => (
        <div key={i} style={{ background: 'white', borderRadius: 20, border: '1px solid #f1f5f9', padding: '1.5rem' }}>
          <div className="skeleton" style={{ height: 18, width: '50%', borderRadius: 8, marginBottom: '1.25rem' }} />
          {Array.from({ length: 4 }).map((_, j) => (
            <div key={j} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0', borderBottom: j < 3 ? '1px solid #f8fafc' : 'none' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <div className="skeleton" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                <div>
                  <div className="skeleton" style={{ height: 14, width: 100, borderRadius: 6, marginBottom: '0.3rem' }} />
                  <div className="skeleton" style={{ height: 11, width: 130, borderRadius: 6 }} />
                </div>
              </div>
              <div className="skeleton" style={{ height: 22, width: 60, borderRadius: 999 }} />
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);
