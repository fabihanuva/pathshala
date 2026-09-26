const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const User = require('../models/User');

// @route POST /api/enrollments
// Student enrolls in a course
const enrollInCourse = async (req, res, next) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const existing = await Enrollment.findOne({ student: req.user._id, course: courseId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
    }

    // Pre-fill progress array with one entry per lesson, all incomplete
    const lessons = await Lesson.find({ course: courseId });
    const progress = lessons.map((lesson) => ({ lesson: lesson._id, completed: false }));

    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: courseId,
      progress,
    });

    // Keep a denormalized reference on the user for quick lookups
    await User.findByIdAndUpdate(req.user._id, { $addToSet: { enrolledCourses: courseId } });

    res.status(201).json({ success: true, enrollment });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/enrollments/my-courses
// Student - list of courses they're enrolled in, with progress
const getMyEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({
        path: 'course',
        select: 'title thumbnail category instructor',
        populate: { path: 'instructor', select: 'name' },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: enrollments.length, enrollments });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/enrollments/:courseId
// Student - get their own enrollment/progress detail for one course
const getEnrollmentForCourse = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: req.params.courseId,
    }).populate('progress.lesson', 'title order duration');

    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Not enrolled in this course' });
    }

    res.status(200).json({ success: true, enrollment });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/enrollments/:courseId/progress
// Student - mark a lesson complete/incomplete, recalculates overall %
const updateProgress = async (req, res, next) => {
  try {
    const { lessonId, completed } = req.body;

    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: req.params.courseId,
    });

    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Not enrolled in this course' });
    }

    const progressEntry = enrollment.progress.find((p) => p.lesson.toString() === lessonId);

    if (!progressEntry) {
      // Lesson was added after enrollment - append it now
      enrollment.progress.push({
        lesson: lessonId,
        completed: !!completed,
        completedAt: completed ? new Date() : undefined,
      });
    } else {
      progressEntry.completed = !!completed;
      progressEntry.completedAt = completed ? new Date() : undefined;
    }

    // Recalculate overall percentage
    const total = enrollment.progress.length;
    const done = enrollment.progress.filter((p) => p.completed).length;
    enrollment.overallProgress = total > 0 ? Math.round((done / total) * 100) : 0;

    await enrollment.save();

    res.status(200).json({ success: true, enrollment });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/enrollments/course/:courseId/students
// Instructor/Admin - see who's enrolled in a course they teach
const getCourseEnrollments = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this data' });
    }

    const enrollments = await Enrollment.find({ course: req.params.courseId })
      .populate('student', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: enrollments.length, enrollments });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/enrollments/recent-activity
// Instructor/Admin - latest enrollments across the courses they teach (or all courses, for admin)
const getRecentActivity = async (req, res, next) => {
  try {
    const courseFilter = req.user.role === 'admin' ? {} : { instructor: req.user._id };
    const myCourses = await Course.find(courseFilter).select('_id');
    const courseIds = myCourses.map((c) => c._id);

    const recent = await Enrollment.find({ course: { $in: courseIds } })
      .populate('student', 'name')
      .populate('course', 'title')
      .sort({ createdAt: -1 })
      .limit(8);

    res.status(200).json({ success: true, activity: recent });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  enrollInCourse,
  getMyEnrollments,
  getEnrollmentForCourse,
  updateProgress,
  getCourseEnrollments,
  getRecentActivity,
};
