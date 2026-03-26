const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      minlength: [10, 'Content must be at least 10 characters'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    tags: {
      type: [String],
      default: [],
      // Normalize tags to lowercase on save
      set: (tags) => tags.map((t) => t.toLowerCase().trim()),
    },
    // Optional excerpt for post previews
    excerpt: {
      type: String,
      maxlength: [500, 'Excerpt cannot exceed 500 characters'],
    },
  },
  { timestamps: true }
);

// Full-text search index on title and content
postSchema.index({ title: 'text', content: 'text', tags: 'text' });

// Index for efficient filtering by status + author
postSchema.index({ status: 1, author: 1 });

module.exports = mongoose.model('Post', postSchema);
