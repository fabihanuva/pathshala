const express = require('express');
const { body } = require('express-validator');
const {
  enrollInCourse,
  getMyEnrollments,
  getEnrollmentForCourse,
  updateProgress,
  getCourseEnrollments,
  getRecentActivity,
} = require('../controllers/enrollmentController');
const { verifyToken, requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.post(
  '/',
  verifyToken,
  requireRole('student'),
  [body('courseId').notEmpty().withMessage('Course ID is required')],
  validate,
  enrollInCourse
);

router.get('/my-courses', verifyToken, requireRole('student'), getMyEnrollments);
router.get('/recent-activity', verifyToken, requireRole('instructor', 'admin'), getRecentActivity);
router.get('/course/:courseId/students', verifyToken, requireRole('instructor', 'admin'), getCourseEnrollments);
router.get('/:courseId', verifyToken, requireRole('student'), getEnrollmentForCourse);
router.put(
  '/:courseId/progress',
  verifyToken,
  requireRole('student'),
  [body('lessonId').notEmpty().withMessage('Lesson ID is required')],
  validate,
  updateProgress
);

module.exports = router;
