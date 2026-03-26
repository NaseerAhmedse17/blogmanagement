const Post = require('../models/Post');
const Comment = require('../models/Comment');

/**
 * Build the MongoDB query filter from request query params.
 * Supports: search (text), status, tags, author.
 */
const buildPostFilter = (query, overrides = {}) => {
  const filter = { ...overrides };

  if (query.search) {
    // Use MongoDB full-text search index
    filter.$text = { $search: query.search };
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (query.tags) {
    // Accept comma-separated tags or a single tag
    const tagList = query.tags.split(',').map((t) => t.trim().toLowerCase());
    filter.tags = { $in: tagList };
  }

  return filter;
};

/**
 * GET /api/posts
 * Public: returns only published posts with pagination, search, filtering.
 */
const getPosts = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const filter = buildPostFilter(req.query, { status: 'published' });

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .populate('author', 'name email')
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      posts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts: total,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/posts/my
 * Authenticated: returns the current user's posts (all statuses).
 */
const getMyPosts = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    // Admins can view all posts; authors see only their own
    const filter =
      req.user.role === 'admin'
        ? buildPostFilter(req.query)
        : buildPostFilter(req.query, { author: req.user._id });

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .populate('author', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      posts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts: total,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/posts/:id
 * Public for published posts; authenticated users can view their own drafts.
 */
const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name email');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Drafts are only visible to the author or an admin
    if (post.status === 'draft') {
      if (!req.user) {
        return res.status(404).json({ message: 'Post not found' });
      }
      const isOwner = post.author._id.toString() === req.user._id.toString();
      if (!isOwner && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to view this post' });
      }
    }

    res.json({ post });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/posts
 * Create a new post (authenticated authors/admins).
 */
const createPost = async (req, res, next) => {
  try {
    const { title, content, status, tags, excerpt } = req.body;

    const post = await Post.create({
      title,
      content,
      status: status || 'draft',
      tags: tags || [],
      excerpt,
      author: req.user._id,
    });

    await post.populate('author', 'name email');

    res.status(201).json({ post });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/posts/:id
 * Update a post. Only the owner or an admin may update.
 */
const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const isOwner = post.author.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    const { title, content, status, tags, excerpt } = req.body;
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (status !== undefined) post.status = status;
    if (tags !== undefined) post.tags = tags;
    if (excerpt !== undefined) post.excerpt = excerpt;

    await post.save();
    await post.populate('author', 'name email');

    res.json({ post });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/posts/:id
 * Delete a post and its comments. Only owner or admin.
 */
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const isOwner = post.author.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    // Remove associated comments before deleting the post
    await Comment.deleteMany({ post: post._id });
    await post.deleteOne();

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/posts/:id/status
 * Toggle published/draft status. Only owner or admin.
 */
const updatePostStatus = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const isOwner = post.author.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to change this post status' });
    }

    post.status = req.body.status;
    await post.save();
    await post.populate('author', 'name email');

    res.json({ post });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPosts, getMyPosts, getPostById, createPost, updatePost, deletePost, updatePostStatus };
