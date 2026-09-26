const express = require('express');
const { body } = require('express-validator');
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getMyCourses,
} = require('../controllers/courseController');
const { verifyToken, requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

const courseValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
];

// Public
router.get('/', getCourses);

// Specific routes before /:id so they aren't swallowed by the param route
router.get('/my-courses', verifyToken, requireRole('instructor', 'admin'), getMyCourses);

router.get('/:id', getCourseById);

// Instructor/Admin only
router.post('/', verifyToken, requireRole('instructor', 'admin'), courseValidation, validate, createCourse);
router.put('/:id', verifyToken, requireRole('instructor', 'admin'), updateCourse);
router.delete('/:id', verifyToken, requireRole('instructor', 'admin'), deleteCourse);

module.exports = router;
