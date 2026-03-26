import React, { memo } from 'react';
import Avatar from '../ui/Avatar';
import { formatDate } from '../../utils/helpers';

/**
 * CommentItem — single comment row with delete action for owner/admin.
 */
const CommentItem = memo(({ comment, canDelete, onDelete }) => (
  <div className="comment-item">
    <div className="comment-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Avatar name={comment.author?.name} size={28} />
        <span className="comment-author">{comment.author?.name}</span>
        <span className="comment-date">· {formatDate(comment.createdAt)}</span>
      </div>

      {canDelete && (
        <button
          className="btn btn-danger btn-sm"
          style={{ color: '#ffffff', padding: '0.2rem 0.65rem', fontSize: '0.75rem' }}
          onClick={() => onDelete(comment._id)}
        >
          ✕ Delete
        </button>
      )}
    </div>
    <p className="comment-text">{comment.content}</p>
  </div>
));

CommentItem.displayName = 'CommentItem';
export default CommentItem;
