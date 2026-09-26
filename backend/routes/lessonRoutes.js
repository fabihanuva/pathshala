const express = require('express');
const { body } = require('express-validator');
const {
  createLesson,
  getLessonsByCourse,
  getLessonById,
  updateLesson,
  deleteLesson,
} = require('../controllers/lessonController');
const { verifyToken, requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

const lessonValidation = [
  body('course').notEmpty().withMessage('Course ID is required'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('videoUrl').trim().notEmpty().withMessage('Video URL is required'),
];

router.post('/', verifyToken, requireRole('instructor', 'admin'), lessonValidation, validate, createLesson);
router.get('/course/:courseId', getLessonsByCourse);
router.get('/:id', verifyToken, getLessonById);
router.put('/:id', verifyToken, requireRole('instructor', 'admin'), updateLesson);
router.delete('/:id', verifyToken, requireRole('instructor', 'admin'), deleteLesson);

module.exports = router;
