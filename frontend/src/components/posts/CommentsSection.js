import React, { useEffect, memo } from 'react';
import { useToast } from '../../context/ToastContext';
import useComments from '../../hooks/useComments';
import useAuth from '../../hooks/useAuth';
import useConfirm from '../../hooks/useConfirm';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import EmptyState from '../ui/EmptyState';
import ConfirmDialog from '../ui/ConfirmDialog';

/**
 * CommentsSection — self-contained comment feed for a post.
 * Fetches its own data so PostDetail stays lean.
 */
const CommentsSection = memo(({ postId }) => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { toast }                          = useToast();
  const { requestConfirm, confirmProps }   = useConfirm();
  const { comments, loading, fetchComments, addComment, deleteComment } = useComments(postId);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  const handleDelete = (commentId) => {
    requestConfirm({
      title:       'Delete comment?',
      message:     'This comment will be permanently removed.',
      confirmText: 'Delete Comment',
      cancelText:  'Cancel',
      variant:     'danger',
      onConfirm:   async () => {
        const result = await deleteComment(commentId);
        if (result.success) toast.success('Comment deleted.');
        else toast.error(result.error || 'Failed to delete comment.');
      },
    });
  };

  return (
    <section className="comments-section">
      <h3 className="comments-title">
        💬 {comments.length} Comment{comments.length !== 1 ? 's' : ''}
      </h3>

      <CommentForm
        isAuthenticated={isAuthenticated}
        userName={user?.name}
        onSubmit={addComment}
      />

      {loading ? (
        // Inline skeleton for comments list
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ background: 'var(--gray-50)', borderRadius: 'var(--r-lg)', padding: '1rem', border: '1px solid var(--gray-150)' }}>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.6rem' }}>
                <div className="skeleton" style={{ width: 28, height: 28, borderRadius: '50%' }} />
                <div className="skeleton" style={{ height: 14, width: 100, borderRadius: 6 }} />
                <div className="skeleton" style={{ height: 14, width: 80, borderRadius: 6 }} />
              </div>
              <div className="skeleton" style={{ height: 14, width: '80%', borderRadius: 6 }} />
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <EmptyState
          icon="💬"
          message="No comments yet — be the first to share your thoughts!"
        />
      ) : (
        comments.map(comment => (
          <CommentItem
            key={comment._id}
            comment={comment}
            canDelete={comment.author?._id === user?.id || isAdmin}
            onDelete={handleDelete}
          />
        ))
      )}

      <ConfirmDialog {...confirmProps} />
    </section>
  );
});

CommentsSection.displayName = 'CommentsSection';
export default CommentsSection;
