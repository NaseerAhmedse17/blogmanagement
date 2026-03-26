const express = require('express');
const router = express.Router();
const {
  getPosts,
  getMyPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  updatePostStatus,
} = require('../controllers/postController');
const { protect, authorizeRoles } = require('../middleware/auth');
const { validate, postSchema, postUpdateSchema, statusSchema } = require('../middleware/validate');

// Middleware that runs protect but does NOT fail if no token is provided
// Used for endpoints that are public but can show extra data when authenticated
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return protect(req, res, next);
  }
  next();
};

// Public - published posts with search & pagination
router.get('/', getPosts);

// Authenticated - current user's posts (admin sees all)
router.get('/my', protect, getMyPosts);

// Single post - public for published, auth required for drafts
router.get('/:id', optionalAuth, getPostById);

// Create post - authors and admins only
router.post('/', protect, authorizeRoles('author', 'admin'), validate(postSchema), createPost);

// Update post - owner or admin
router.put('/:id', protect, validate(postUpdateSchema), updatePost);

// Delete post - owner or admin
router.delete('/:id', protect, deletePost);

// Toggle publish/draft status - owner or admin
router.patch('/:id/status', protect, validate(statusSchema), updatePostStatus);

module.exports = router;
