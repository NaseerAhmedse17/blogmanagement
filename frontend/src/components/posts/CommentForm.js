import React, { useState, memo } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../ui/Avatar';
import LoadingButton from '../ui/LoadingButton';
import { ROUTES } from '../../constants';

/**
 * CommentForm — textarea + submit button for adding a comment.
 * Renders a "sign in" prompt for unauthenticated visitors.
 */
const CommentForm = memo(({ isAuthenticated, userName, onSubmit }) => {
  const [text,    setText]    = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed)          { setError('Comment cannot be empty.');          return; }
    if (trimmed.length > 1000) { setError('Comment is too long (max 1000 chars).'); return; }

    setLoading(true);
    setError('');
    const result = await onSubmit(trimmed);
    if (result.success) {
      setText('');
    } else {
      setError(result.error || 'Failed to post comment.');
    }
    setLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="alert alert-info" style={{ marginBottom: '1.5rem' }}>
        💡 <Link to={ROUTES.LOGIN} style={{ fontWeight: 700 }}>Sign in</Link> to join the conversation.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
        <Avatar name={userName} size={36} style={{ marginTop: '0.15rem' }} />
        <div style={{ flex: 1 }}>
          <textarea
            value={text}
            onChange={e => { setText(e.target.value); setError(''); }}
            className={`form-textarea ${error ? 'error' : ''}`}
            placeholder="Share your thoughts..."
            rows={3}
            style={{ minHeight: 80 }}
            disabled={loading}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
            {error
              ? <p className="form-error" style={{ margin: 0 }}>⚠ {error}</p>
              : <span className="form-hint">{text.length}/1000</span>}
            <LoadingButton
              type="submit"
              loading={loading}
              loadingText="Posting..."
              className="btn btn-primary btn-sm"
              style={{ minWidth: 'unset' }}
            >
              💬 Post Comment
            </LoadingButton>
          </div>
        </div>
      </div>
    </form>
  );
});

CommentForm.displayName = 'CommentForm';
export default CommentForm;
