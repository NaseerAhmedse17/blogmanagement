import { useContext } from 'react';
import PostContext from '../context/PostContext';

/**
 * usePosts - Custom hook to access post state and CRUD actions.
 *
 * Returns: { posts, currentPost, pagination, loading, error,
 *            fetchPublishedPosts, fetchMyPosts, fetchPostById,
 *            createPost, updatePost, deletePost, updatePostStatus, clearError }
 */
const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePosts must be used within a <PostProvider>');
  }
  return context;
};

export default usePosts;
