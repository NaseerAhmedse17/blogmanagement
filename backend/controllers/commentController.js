const Comment = require('../models/Comment');
const Post = require('../models/Post');

/**
 * GET /api/posts/:id/comments
 * Return all comments for a published post (or any post for authenticated users).
 */
const getComments = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comments = await Comment.find({ post: req.params.id })
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ comments });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/posts/:id/comments
 * Add a comment to a published post. Requires authentication.
 */
const addComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.status !== 'published') {
      return res.status(403).json({ message: 'Cannot comment on unpublished posts' });
    }

    const comment = await Comment.create({
      content: req.body.content,
      author: req.user._id,
      post: post._id,
    });

    await comment.populate('author', 'name email');

    res.status(201).json({ comment });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/posts/:id/comments/:commentId
 * Delete a comment. Only the comment author or an admin can delete.
 */
const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const isOwner = comment.author.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getComments, addComment, deleteComment };
