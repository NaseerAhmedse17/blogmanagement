import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useApi from '../hooks/useApi';
import { statsAPI } from '../utils/api';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/helpers';
import { SkeletonStats } from '../components/common/SkeletonCard';

const AdminPanel = () => {
  const { execute: fetchStats, data: stats, loading, error } = useApi(statsAPI.getPostStats);
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '0.25rem' }}>
              📊 Site Statistics
            </h1>
            <p style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>
              Platform-wide analytics and insights
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => { fetchStats(); toast.info('Statistics refreshed'); }}
              disabled={loading}
            >
              {loading ? <span className="spinner" style={{ width: 14, height: 14 }} /> : '🔄'} Refresh
            </button>
            <Link to="/dashboard" className="btn btn-outline btn-sm">← Dashboard</Link>
          </div>
        </div>

        {loading && !stats ? (
          <SkeletonStats />
        ) : error && !stats ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h3 style={{ color: 'var(--gray-700)', marginBottom: '0.5rem' }}>Failed to load statistics</h3>
            <p style={{ color: 'var(--gray-400)', marginBottom: '1.5rem' }}>{error}</p>
            <button className="btn btn-primary" onClick={fetchStats}>🔄 Try Again</button>
          </div>
        ) : stats ? (
          <>
            {/* Stats cards */}
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
              {[
                { label: 'Total Posts',  value: stats.posts?.total ?? 0,     icon: '📝', cls: 'stat-card-icon-primary' },
                { label: 'Published',    value: stats.posts?.published ?? 0, icon: '✅', cls: 'stat-card-icon-success' },
                { label: 'Drafts',       value: stats.posts?.draft ?? 0,     icon: '📋', cls: 'stat-card-icon-warning' },
                { label: 'Comments',     value: stats.totalComments ?? 0,    icon: '💬', cls: 'stat-card-icon-cyan'    },
                { label: 'Total Users',  value: stats.totalUsers ?? 0,       icon: '👥', cls: 'stat-card-icon-red'     },
              ].map(s => (
                <div className="stat-card" key={s.label}>
                  <div className={`stat-card-icon ${s.cls}`}>{s.icon}</div>
                  <div>
                    <div className="stat-card-value">{s.value.toLocaleString()}</div>
                    <div className="stat-card-label">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Detail grid */}
            <div className="admin-grid">
              {/* Top Authors */}
              <div className="admin-card">
                <div className="admin-card-title">🏆 Top Authors by Published Posts</div>
                {!stats.topAuthors?.length ? (
                  <div className="empty-state" style={{ padding: '1.5rem' }}>
                    <div className="empty-state-icon" style={{ fontSize: '2rem' }}>📝</div>
                    <p>No published posts yet.</p>
                  </div>
                ) : stats.topAuthors.map((entry, i) => (
                  <div className="top-author-row" key={entry._id}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                        background: ['linear-gradient(135deg,#f59e0b,#ef4444)', 'linear-gradient(135deg,#6366f1,#4338ca)', 'linear-gradient(135deg,#10b981,#059669)', 'var(--gray-200)', 'var(--gray-200)'][i] || 'var(--gray-200)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: i < 3 ? 'white' : 'var(--gray-600)',
                        fontWeight: 700, fontSize: i < 3 ? '1rem' : '0.75rem',
                      }}>
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : entry.author?.name?.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--gray-800)' }}>
                          {entry.author?.name || 'Unknown'}
                        </div>
                        <div style={{ fontSize: '0.775rem', color: 'var(--gray-400)' }}>
                          {entry.author?.email}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
                      <span className="badge badge-published">{entry.postCount} posts</span>
                      <div style={{ fontSize: '0.7rem', color: 'var(--gray-300)' }}>#{i + 1} ranked</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Posts */}
              <div className="admin-card">
                <div className="admin-card-title">🕒 Recently Published</div>
                {!stats.recentPosts?.length ? (
                  <div className="empty-state" style={{ padding: '1.5rem' }}>
                    <div className="empty-state-icon" style={{ fontSize: '2rem' }}>📭</div>
                    <p>No published posts yet.</p>
                  </div>
                ) : stats.recentPosts.map((post, i) => (
                  <div key={post._id} style={{
                    padding: '0.75rem 0',
                    borderBottom: i < stats.recentPosts.length - 1 ? '1px solid var(--gray-100)' : 'none',
                    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem',
                  }}>
                    <div style={{ flex: 1 }}>
                      <Link to={`/posts/${post._id}`}
                        style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--gray-800)', display: 'block', marginBottom: '0.25rem' }}
                        onMouseEnter={e => e.target.style.color = 'var(--p-600)'}
                        onMouseLeave={e => e.target.style.color = 'var(--gray-800)'}
                      >
                        {post.title}
                      </Link>
                      <div style={{ fontSize: '0.775rem', color: 'var(--gray-400)', display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                        <span>👤 {post.author?.name}</span>
                        <span>📅 {formatDate(post.createdAt)}</span>
                      </div>
                    </div>
                    <span className="badge badge-published" style={{ flexShrink: 0 }}>Live</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default AdminPanel;
