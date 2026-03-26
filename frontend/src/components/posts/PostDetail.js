import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import usePosts from '../../hooks/usePosts';
import useAuth from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import Avatar from '../ui/Avatar';
import StatusBadge from '../ui/StatusBadge';
import ConfirmDialog from '../ui/ConfirmDialog';
import useConfirm from '../../hooks/useConfirm';
import CommentsSection from './CommentsSection';
import { SkeletonPostDetail } from '../common/SkeletonCard';
import { formatDate } from '../../utils/helpers';
import { ROUTES } from '../../constants';

const PostDetail = () => {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const { fetchPostById, deletePost, updatePostStatus } = usePosts();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { toast } = useToast();

  const [post,          setPost]          = useState(null);
  const [postLoading,   setPostLoading]   = useState(true);
  const [postError,     setPostError]     = useState('');
  const [actionLoading, setActionLoading] = useState('');
  const { requestConfirm, confirmProps }  = useConfirm();

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setPostLoading(true);
      setPostError('');
      try {
        const p = await fetchPostById(id);
        if (!cancelled) {
          if (p) setPost(p);
          else   setPostError('Post not found or you don\'t have access.');
        }
      } catch {
        if (!cancelled) setPostError('Failed to load post. Please check your connection.');
      } finally {
        if (!cancelled) setPostLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [id, fetchPostById]);

  const handleDelete = useCallback(() => {
    requestConfirm({
      title:       'Delete this post?',
      message:     `"${post?.title}" will be permanently removed along with all its comments. This cannot be undone.`,
      confirmText: 'Yes, Delete',
      cancelText:  'Keep it',
      variant:     'danger',
      onConfirm:   async () => {
        setActionLoading('delete');
        try {
          const result = await deletePost(id);
          if (result.success) {
            toast.success('Post deleted successfully.');
            navigate(ROUTES.DASHBOARD);
          } else {
            toast.error(result.error || 'Failed to delete post.');
          }
        } catch {
          toast.error('An unexpected error occurred.');
        } finally {
          setActionLoading('');
        }
      },
    });
  }, [id, post?.title, deletePost, toast, navigate, requestConfirm]);

  const handleStatusToggle = useCallback(async () => {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    setActionLoading('status');
    try {
      const result = await updatePostStatus(id, newStatus);
      if (result.success) {
        setPost(result.post);
        toast.success(
          newStatus === 'published' ? '🚀 Post is now live!' : '📝 Post moved to drafts.'
        );
      } else {
        toast.error(result.error || 'Failed to update status.');
      }
    } catch {
      toast.error('An unexpected error occurred.');
    } finally {
      setActionLoading('');
    }
  }, [id, post?.status, updatePostStatus, toast]);

  if (postLoading) return <SkeletonPostDetail />;

  if (postError || !post) {
    return (
      <div className="page">
        <div className="container text-center" style={{ paddingTop: '4rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>😕</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--gray-800)', marginBottom: '0.5rem' }}>
            Post not found
          </h2>
          <p style={{ color: 'var(--gray-400)', marginBottom: '2rem' }}>
            {postError || 'This post doesn\'t exist or you don\'t have permission to view it.'}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <Link to={ROUTES.HOME} className="btn btn-primary">← Back to Blog</Link>
            <button className="btn btn-ghost" onClick={() => window.location.reload()}>🔄 Retry</button>
          </div>
        </div>
      </div>
    );
  }

  const isOwner   = user && post.author?._id === user.id;
  const canManage = isOwner || isAdmin;
  const wordCount = post.content?.trim().split(/\s+/).filter(Boolean).length || 0;
  const readTime  = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="page">
      <div className="post-detail-wrapper">
        <Link to={ROUTES.HOME} className="post-detail-back">← Back to Blog</Link>

        {/* Status + tags */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <StatusBadge status={post.status} />
          {post.tags?.map(tag => <span key={tag} className="tag">#{tag}</span>)}
        </div>

        <h1 className="post-detail-title">{post.title}</h1>

        {/* Meta row */}
        <div className="post-detail-meta">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Avatar name={post.author?.name} size={34} />
            <div>
              <span style={{ fontWeight: 700, color: 'var(--gray-700)', fontSize: '0.9rem' }}>
                {post.author?.name}
              </span>
              {isAdmin && (
                <span style={{ color: 'var(--gray-400)', fontSize: '0.775rem', marginLeft: '0.4rem' }}>
                  · {post.author?.email}
                </span>
              )}
            </div>
          </div>
          <span>📅 {formatDate(post.createdAt)}</span>
          <span>⏱ {readTime} min read</span>
          <span>📖 {wordCount.toLocaleString()} words</span>
        </div>

        {/* Management actions */}
        {canManage && (
          <div style={{
            display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '2rem',
            padding: '1rem 1.25rem', background: 'var(--p-50)',
            borderRadius: 'var(--r-lg)', border: '1px solid var(--p-100)',
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--p-700)', fontWeight: 600, alignSelf: 'center', marginRight: '0.25rem' }}>
              {isAdmin && !isOwner ? '⚡ Admin:' : '✏️ Manage:'}
            </span>
            <Link to={ROUTES.EDIT_POST(post._id)} className="btn btn-outline btn-sm">✏️ Edit</Link>
            <button
              className={`btn btn-sm ${post.status === 'published' ? 'btn-warning' : 'btn-success'}`}
              onClick={handleStatusToggle}
              disabled={actionLoading === 'status'}
            >
              {actionLoading === 'status'
                ? <><span className="spinner" style={{ width: 12, height: 12, borderWidth: 2 }} /> Updating...</>
                : post.status === 'published' ? '⏸ Unpublish' : '▶ Publish'}
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={handleDelete}
              disabled={actionLoading === 'delete'}
              style={{ color: '#ffffff' }}
            >
              {actionLoading === 'delete'
                ? <><span className="spinner" style={{ width: 12, height: 12, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} /> Deleting...</>
                : '✕ Delete'}
            </button>
          </div>
        )}

        {/* Content */}
        <div style={{
          background: 'var(--white)', border: '1px solid var(--gray-150)',
          borderRadius: 'var(--r-2xl)', padding: '2.5rem',
          boxShadow: 'var(--shadow-sm)', marginBottom: '3rem',
        }}>
          <div className="post-detail-content">{post.content}</div>
        </div>

        {/* Comments — self-contained, no prop drilling */}
        <CommentsSection postId={post._id} />
      </div>

      {/* Post delete confirmation */}
      <ConfirmDialog {...confirmProps} />
    </div>
  );
};

export default PostDetail;
