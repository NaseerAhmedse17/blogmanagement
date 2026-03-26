import React, { useEffect, useState, useCallback } from 'react';
import usePosts from '../../hooks/usePosts';
import { useToast } from '../../context/ToastContext';
import PostCard from './PostCard';
import Pagination from '../common/Pagination';
import { SkeletonGrid } from '../common/SkeletonCard';

const PostList = ({ mode = 'public', showActions = false }) => {
  const {
    posts, pagination, loading, error,
    fetchPublishedPosts, fetchMyPosts,
    deletePost, updatePostStatus,
    clearError,
  } = usePosts();
  const { toast } = useToast();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchPosts = useCallback(() => {
    const params = {
      page, limit: 9,
      ...(debouncedSearch && { search: debouncedSearch }),
      ...(filterStatus && { status: filterStatus }),
    };
    const fn = mode === 'dashboard' ? fetchMyPosts : fetchPublishedPosts;
    fn(params).finally(() => setFirstLoad(false));
  }, [page, debouncedSearch, filterStatus, mode, fetchMyPosts, fetchPublishedPosts]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);
  useEffect(() => { setPage(1); }, [debouncedSearch, filterStatus]);

  // Show toast when a fetch error occurs
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error]);

  const handleDelete = async (id) => {
    const result = await deletePost(id);
    return result;
  };

  const handleStatusToggle = async (id, status) => {
    const result = await updatePostStatus(id, status);
    return result;
  };

  const showSkeleton = loading && firstLoad;

  return (
    <div>
      {/* Filter bar */}
      <div className="filter-bar">
        <div className="filter-bar-search">
          <span className="filter-bar-search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by title, content, or tags..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {mode === 'dashboard' && (
          <select
            className="filter-select"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="">All statuses</option>
            <option value="published">✅ Published</option>
            <option value="draft">📝 Drafts</option>
          </select>
        )}

        {/* Inline spinner for background refetches */}
        {loading && !firstLoad && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gray-400)', fontSize: '0.8rem' }}>
            <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
            Updating...
          </div>
        )}
      </div>

      {/* Skeleton on first load */}
      {showSkeleton && <SkeletonGrid count={6} />}

      {/* Empty state */}
      {!showSkeleton && !loading && posts.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">
            {debouncedSearch ? '🔍' : mode === 'dashboard' ? '✍️' : '📭'}
          </div>
          <h3>
            {debouncedSearch
              ? `No results for "${debouncedSearch}"`
              : mode === 'dashboard' ? 'No posts yet' : 'Nothing published yet'}
          </h3>
          <p>
            {debouncedSearch
              ? 'Try a different search term or clear the filter.'
              : mode === 'dashboard'
                ? 'Start writing your first post — click "New Post" above!'
                : 'Our authors are working on new content. Check back soon!'}
          </p>
        </div>
      )}

      {/* Post grid */}
      {!showSkeleton && posts.length > 0 && (
        <div className="post-grid">
          {posts.map(post => (
            <PostCard
              key={post._id}
              post={post}
              showActions={showActions}
              onDelete={handleDelete}
              onStatusToggle={handleStatusToggle}
            />
          ))}
        </div>
      )}

      <Pagination pagination={pagination} onPageChange={setPage} />
    </div>
  );
};

export default PostList;
