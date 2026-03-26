import React, { useState } from 'react';
import PostList from '../components/posts/PostList';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* Hero */}
      <div className="hero">
        <div className="hero-inner">
          <div className="hero-label">
            <span>✨</span> Modern Blog Platform
          </div>
          <h1 className="hero-title">
            Discover <span>Stories</span> That<br />Inspire & Inform
          </h1>
          <p className="hero-sub">
            Explore articles written by our talented authors on technology, design, development, and more.
          </p>
          {!isAuthenticated && (
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
              <Link to="/register" className="btn btn-accent btn-xl">
                🚀 Start Writing Free
              </Link>
              <Link to="/login" className="btn btn-lg"
                style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1.5px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)' }}>
                Sign In →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Posts */}
      <div className="container">
        <div className="section-header">
          <div>
            <div className="section-title">Latest Articles</div>
            <div className="section-sub">Published stories from our community</div>
          </div>
        </div>
        <PostList mode="public" showActions={false} />
      </div>
    </div>
  );
};

export default Home;
