const Joi = require('joi');

/**
 * Middleware factory that validates req.body against the given Joi schema.
 * Returns 400 with validation details if validation fails.
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false, // collect all errors, not just first
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((d) => d.message.replace(/"/g, "'"));
      return res.status(400).json({ message: 'Validation error', errors });
    }

    next();
  };
};

// ── Validation Schemas ──────────────────────────────────────

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8)
    .pattern(/[A-Z]/, 'uppercase')
    .pattern(/[a-z]/, 'lowercase')
    .pattern(/[0-9]/, 'number')
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.name': 'Password must contain at least one {#name} letter',
    }),
  role: Joi.string().valid('admin', 'author').optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const postSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  content: Joi.string().min(10).required(),
  status: Joi.string().valid('draft', 'published').optional(),
  tags: Joi.array().items(Joi.string().max(30)).max(10).optional(),
  excerpt: Joi.string().max(500).optional().allow(''),
});

const postUpdateSchema = Joi.object({
  title: Joi.string().min(3).max(200).optional(),
  content: Joi.string().min(10).optional(),
  status: Joi.string().valid('draft', 'published').optional(),
  tags: Joi.array().items(Joi.string().max(30)).max(10).optional(),
  excerpt: Joi.string().max(500).optional().allow(''),
});

const commentSchema = Joi.object({
  content: Joi.string().min(1).max(1000).required(),
});

const statusSchema = Joi.object({
  status: Joi.string().valid('draft', 'published').required(),
});

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  postSchema,
  postUpdateSchema,
  commentSchema,
  statusSchema,
};
