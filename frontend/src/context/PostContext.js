import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { postsAPI } from '../utils/api';
import { getErrorMessage } from '../utils/helpers';

const initialState = {
  posts: [],
  currentPost: null,
  pagination: null,
  loading: false,
  error: null,
};

const postReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_POSTS_SUCCESS':
      return {
        ...state,
        loading: false,
        posts: action.payload.posts,
        pagination: action.payload.pagination,
      };
    case 'FETCH_POST_SUCCESS':
      return { ...state, loading: false, currentPost: action.payload };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    // Optimistic: add a temp post before server confirms
    case 'CREATE_OPTIMISTIC':
      return { ...state, posts: [action.payload, ...state.posts] };
    case 'CREATE_SUCCESS':
      // Replace the temp entry with the real server response
      return {
        ...state,
        posts: state.posts.map((p) =>
          p._id === action.payload.tempId ? action.payload.post : p
        ),
      };
    case 'CREATE_ROLLBACK':
      return { ...state, posts: state.posts.filter((p) => p._id !== action.payload) };

    case 'UPDATE_SUCCESS':
      return {
        ...state,
        posts: state.posts.map((p) =>
          p._id === action.payload._id ? action.payload : p
        ),
        currentPost:
          state.currentPost?._id === action.payload._id ? action.payload : state.currentPost,
      };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        posts: state.posts.filter((p) => p._id !== action.payload),
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const PostContext = createContext(null);

export const PostProvider = ({ children }) => {
  const [state, dispatch] = useReducer(postReducer, initialState);

  const fetchPublishedPosts = useCallback(async (params = {}) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const { data } = await postsAPI.getPublished(params);
      dispatch({ type: 'FETCH_POSTS_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'FETCH_FAIL', payload: getErrorMessage(error) });
    }
  }, []);

  const fetchMyPosts = useCallback(async (params = {}) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const { data } = await postsAPI.getMyPosts(params);
      dispatch({ type: 'FETCH_POSTS_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'FETCH_FAIL', payload: getErrorMessage(error) });
    }
  }, []);

  const fetchPostById = useCallback(async (id) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const { data } = await postsAPI.getById(id);
      dispatch({ type: 'FETCH_POST_SUCCESS', payload: data.post });
      return data.post;
    } catch (error) {
      dispatch({ type: 'FETCH_FAIL', payload: getErrorMessage(error) });
      return null;
    }
  }, []);

  /**
   * Optimistic create: add a placeholder immediately, replace with real data on success,
   * or roll back on failure.
   */
  const createPost = useCallback(async (postData) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticPost = { _id: tempId, ...postData, createdAt: new Date().toISOString() };

    dispatch({ type: 'CREATE_OPTIMISTIC', payload: optimisticPost });

    try {
      const { data } = await postsAPI.create(postData);
      // Pass post nested so the reducer can distinguish it from tempId
      dispatch({ type: 'CREATE_SUCCESS', payload: { post: data.post, tempId } });
      return { success: true, post: data.post };
    } catch (error) {
      // Roll back the optimistic update
      dispatch({ type: 'CREATE_ROLLBACK', payload: tempId });
      return { success: false, error: getErrorMessage(error) };
    }
  }, []);

  const updatePost = useCallback(async (id, postData) => {
    try {
      const { data } = await postsAPI.update(id, postData);
      dispatch({ type: 'UPDATE_SUCCESS', payload: data.post });
      return { success: true, post: data.post };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  }, []);

  const deletePost = useCallback(async (id) => {
    try {
      await postsAPI.delete(id);
      dispatch({ type: 'DELETE_SUCCESS', payload: id });
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  }, []);

  const updatePostStatus = useCallback(async (id, status) => {
    try {
      const { data } = await postsAPI.updateStatus(id, status);
      dispatch({ type: 'UPDATE_SUCCESS', payload: data.post });
      return { success: true, post: data.post };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  }, []);

  const value = {
    ...state,
    fetchPublishedPosts,
    fetchMyPosts,
    fetchPostById,
    createPost,
    updatePost,
    deletePost,
    updatePostStatus,
    clearError: () => dispatch({ type: 'CLEAR_ERROR' }),
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

export { PostContext };
export default PostContext;
