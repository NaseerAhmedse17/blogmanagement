import React, { useState, memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import Avatar from '../ui/Avatar';
import StatusBadge from '../ui/StatusBadge';
import ConfirmDialog from '../ui/ConfirmDialog';
import useConfirm from '../../hooks/useConfirm';
import { formatDate, generateExcerpt } from '../../utils/helpers';
import { ROUTES } from '../../constants';

/**
 * PostCard — adapts its UI based on the viewer's role:
 *  - public  → read-only preview
 *  - author  → edit / publish / delete for own posts
 *  - admin   → full management + author info strip on every post
 */
const PostCard = memo(({ post, onDelete, onStatusToggle, showActions = false }) => {
  const { user, isAdmin } = useAuth();
  const { toast }         = useToast();

  const [statusLoading, setStatusLoading] = useState(false);
  const { requestConfirm, confirmProps }  = useConfirm();

  const isOwner   = user && post.author?._id === user.id;
  const canManage = showActions && (isOwner || isAdmin);
  const excerpt   = post.excerpt || generateExcerpt(post.content, 25);

  const handleDelete = useCallback(() => {
    requestConfirm({
      title:       'Delete post?',
      message:     `"${post.title}" will be permanently removed. This cannot be undone.`,
      confirmText: 'Yes, Delete',
      cancelText:  'Keep it',
      variant:     'danger',
      onConfirm:   async () => {
        const result = await onDelete(post._id);
        if (result?.success === false) toast.error(result.error || 'Failed to delete post.');
        else toast.success('Post deleted successfully.');
      },
    });
  }, [post._id, post.title, onDelete, toast, requestConfirm]);

  const handleStatusToggle = useCallback(async () => {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    setStatusLoading(true);
    try {
      const result = await onStatusToggle(post._id, newStatus);
      if (result?.success === false) toast.error(result.error || 'Failed to update status.');
      else toast.success(
        newStatus === 'published' ? `"${post.title}" is now live!` : `"${post.title}" moved to drafts.`
      );
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setStatusLoading(false);
    }
  }, [post._id, post.title, post.status, onStatusToggle, toast]);

  return (
    <div className="post-card" style={{ opacity: confirmProps.loading ? 0.5 : 1 }}>
      {/* Status accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: post.status === 'published'
          ? 'linear-gradient(90deg,#06b6d4,#6366f1)'
          : 'linear-gradient(90deg,#f59e0b,#ef4444)',
        borderRadius: '20px 20px 0 0',
      }} />

      {/* Title + status */}
      <div className="post-card-header">
        <h2 className="post-card-title">
          <Link to={ROUTES.POST(post._id)}>{post.title}</Link>
        </h2>
        <StatusBadge status={post.status} />
      </div>

      {/* Author + date */}
      <div className="post-card-meta">
        <div className="author-chip">
          <Avatar name={post.author?.name} size={22} />
          <span className="author-chip-name">{post.author?.name || 'Unknown'}</span>
          {isAdmin && !isOwner && (
            <span className="badge badge-author" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
              author
            </span>
          )}
          {isOwner && (
            <span style={{ fontSize: '0.7rem', color: 'var(--p-500)', fontWeight: 700 }}>· you</span>
          )}
        </div>
        <span className="post-card-meta-item" style={{ marginLeft: 'auto' }}>
          {formatDate(post.createdAt)}
        </span>
      </div>

      {/* Excerpt */}
      <p className="post-card-excerpt">{excerpt}</p>

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div className="post-card-tags">
          {post.tags.slice(0, 3).map(tag => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
          {post.tags.length > 3 && (
            <span className="tag" style={{ background: 'var(--gray-100)', color: 'var(--gray-400)' }}>
              +{post.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="post-card-footer">
        <Link to={ROUTES.POST(post._id)} className="btn btn-outline btn-sm">Read →</Link>

        {canManage && (
          <div className="post-card-actions">
            <Link to={ROUTES.EDIT_POST(post._id)} className="btn btn-ghost btn-sm">✏️ Edit</Link>

            <button
              className={`btn btn-sm ${post.status === 'published' ? 'btn-warning' : 'btn-success'}`}
              onClick={handleStatusToggle}
              disabled={statusLoading}
            >
              {statusLoading
                ? <span className="spinner" style={{ width: 12, height: 12, borderWidth: 2 }} />
                : post.status === 'published' ? '⏸' : '▶'}
              {!statusLoading && (post.status === 'published' ? ' Unpublish' : ' Publish')}
            </button>

            <button
              className="btn btn-danger btn-sm"
              onClick={handleDelete}
              style={{ color: '#ffffff' }}
            >
              ✕ Delete
            </button>
          </div>
        )}
      </div>

      {/* Custom delete confirmation dialog */}
      <ConfirmDialog {...confirmProps} />

      {/* Admin info strip */}
      {isAdmin && !isOwner && (
        <div style={{
          marginTop: '0.25rem', padding: '0.5rem 0.75rem',
          background: 'var(--p-50)', borderRadius: 'var(--r-md)',
          fontSize: '0.75rem', color: 'var(--p-700)',
          display: 'flex', alignItems: 'center', gap: '0.4rem',
        }}>
          <span>⚡</span>
          <span><strong>Admin view</strong> · {post.author?.email || 'no email'}</span>
        </div>
      )}
    </div>
  );
});

PostCard.displayName = 'PostCard';
export default PostCard;
