const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');

/**
 * GET /api/stats/posts
 * Aggregation pipeline that returns blog-wide statistics.
 * Admin only.
 */
const getPostStats = async (req, res, next) => {
  try {
    // Parallel aggregation queries for performance
    const [postStats, topAuthors, recentPosts, commentCount, userCount] = await Promise.all([
      // Count posts grouped by status
      Post.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]),

      // Top 5 authors by number of published posts
      Post.aggregate([
        { $match: { status: 'published' } },
        {
          $group: {
            _id: '$author',
            postCount: { $sum: 1 },
          },
        },
        { $sort: { postCount: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'authorInfo',
          },
        },
        {
          $project: {
            postCount: 1,
            author: { $arrayElemAt: ['$authorInfo', 0] },
          },
        },
        {
          $project: {
            postCount: 1,
            'author.name': 1,
            'author.email': 1,
          },
        },
      ]),

      // 5 most recent published posts
      Post.find({ status: 'published' })
        .populate('author', 'name')
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title createdAt author')
        .lean(),

      Comment.countDocuments(),
      User.countDocuments(),
    ]);

    // Flatten status counts into a readable object
    const counts = { total: 0, published: 0, draft: 0 };
    postStats.forEach(({ _id, count }) => {
      counts[_id] = count;
      counts.total += count;
    });

    res.json({
      posts: counts,
      topAuthors,
      recentPosts,
      totalComments: commentCount,
      totalUsers: userCount,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPostStats };
