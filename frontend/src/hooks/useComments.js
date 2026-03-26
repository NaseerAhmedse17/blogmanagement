import { useState, useCallback } from 'react';
import { commentsAPI } from '../utils/api';
import { getErrorMessage } from '../utils/helpers';

/**
 * useComments - Manages comment state for a single post.
 */
const useComments = (postId) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchComments = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await commentsAPI.getByPost(postId);
      setComments(data.comments);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [postId]);

  const addComment = useCallback(async (content) => {
    try {
      const { data } = await commentsAPI.add(postId, { content });
      // Prepend new comment optimistically
      setComments((prev) => [data.comment, ...prev]);
      return { success: true };
    } catch (err) {
      return { success: false, error: getErrorMessage(err) };
    }
  }, [postId]);

  const deleteComment = useCallback(async (commentId) => {
    // Optimistic removal
    setComments((prev) => prev.filter((c) => c._id !== commentId));
    try {
      await commentsAPI.delete(postId, commentId);
      return { success: true };
    } catch (err) {
      // Rollback on error
      fetchComments();
      return { success: false, error: getErrorMessage(err) };
    }
  }, [postId, fetchComments]);

  return { comments, loading, error, fetchComments, addComment, deleteComment };
};

export default useComments;
