import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import PostList from '../components/posts/PostList';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();

  return (
    <div>
      {/* Top banner */}
      <div className="dashboard-top">
        <div className="dashboard-top-inner">
          <div>
            <p className="dashboard-greeting">
              {new Date().getHours() < 12 ? '☀️ Good morning' : new Date().getHours() < 18 ? '👋 Good afternoon' : '🌙 Good evening'},
            </p>
            <h1 className="dashboard-title">{user?.name} 👋</h1>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.6rem', flexWrap: 'wrap' }}>
              <span className={`badge ${isAdmin ? 'badge-admin' : 'badge-author'}`} style={{ fontSize: '0.7rem' }}>
                {isAdmin ? '⚡ Admin' : '✍️ Author'}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', alignSelf: 'center' }}>
                {user?.email}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {isAdmin && (
              <Link to="/admin" className="btn btn-lg"
                style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1.5px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(10px)' }}>
                📊 View Stats
              </Link>
            )}
            <Link to="/posts/new" className="btn btn-accent btn-lg">
              ✨ New Post
            </Link>
          </div>
        </div>
      </div>

      <div className="container">
        {isAdmin && (
          <div className="alert alert-info mb-3">
            <span>⚡</span>
            <span>You have <strong>admin access</strong> — you can manage all posts on the platform.
              <Link to="/admin" style={{ marginLeft: '0.5rem', fontWeight: 700 }}>
                View site statistics →
              </Link>
            </span>
          </div>
        )}

        <div className="section-header">
          <div>
            <div className="section-title">
              {isAdmin ? 'All Posts' : 'My Posts'}
            </div>
            <div className="section-sub">
              {isAdmin ? 'Manage all posts across the platform' : 'Manage your drafts and published posts'}
            </div>
          </div>
        </div>

        <PostList mode="dashboard" showActions={true} />
      </div>
    </div>
  );
};

export default Dashboard;
