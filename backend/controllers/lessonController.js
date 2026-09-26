const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// Helper: check the requester owns the course (or is admin)
const canManageCourse = (course, user) => {
  return course.instructor.toString() === user._id.toString() || user.role === 'admin';
};

// @route POST /api/lessons
// Instructor (owns the course) or Admin
const createLesson = async (req, res, next) => {
  try {
    const { course: courseId, title, videoUrl, duration, order, resources } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (!canManageCourse(course, req.user)) {
      return res.status(403).json({ success: false, message: 'Not authorized to add lessons to this course' });
    }

    const lesson = await Lesson.create({
      course: courseId,
      title,
      videoUrl,
      duration,
      order,
      resources,
    });

    course.lessons.push(lesson._id);
    await course.save();

    res.status(201).json({ success: true, lesson });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/lessons/course/:courseId
// Public metadata list; a student must be enrolled to get real videoUrl (enforced on getLessonById)
const getLessonsByCourse = async (req, res, next) => {
  try {
    const lessons = await Lesson.find({ course: req.params.courseId }).sort({ order: 1 });
    res.status(200).json({ success: true, count: lessons.length, lessons });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/lessons/:id
// Authenticated - must be enrolled, the course instructor, or admin
const getLessonById = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate('course', 'instructor title');
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    const isOwner = lesson.course.instructor.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      const enrollment = await Enrollment.findOne({
        student: req.user._id,
        course: lesson.course._id,
      });
      if (!enrollment) {
        return res.status(403).json({
          success: false,
          message: 'You must be enrolled in this course to view this lesson',
        });
      }
    }

    res.status(200).json({ success: true, lesson });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/lessons/:id
// Instructor (owns course) or Admin
const updateLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate('course');
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    if (!canManageCourse(lesson.course, req.user)) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this lesson' });
    }

    const allowedFields = ['title', 'videoUrl', 'duration', 'order', 'resources'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) lesson[field] = req.body[field];
    });

    await lesson.save();

    res.status(200).json({ success: true, lesson });
  } catch (error) {
    next(error);
  }
};

// @route DELETE /api/lessons/:id
// Instructor (owns course) or Admin
const deleteLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate('course');
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    if (!canManageCourse(lesson.course, req.user)) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this lesson' });
    }

    await Course.findByIdAndUpdate(lesson.course._id, { $pull: { lessons: lesson._id } });
    await lesson.deleteOne();

    res.status(200).json({ success: true, message: 'Lesson deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLesson,
  getLessonsByCourse,
  getLessonById,
  updateLesson,
  deleteLesson,
};
