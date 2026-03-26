const express = require('express');
const router = express.Router();
const { getComments, addComment, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/auth');
const { validate, commentSchema } = require('../middleware/validate');

router.get('/:id/comments', getComments);
router.post('/:id/comments', protect, validate(commentSchema), addComment);
router.delete('/:id/comments/:commentId', protect, deleteComment);

module.exports = router;
