const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');

// @route GET /api/courses
// Public - supports search, category filter, and pagination
const getCourses = async (req, res, next) => {
  try {
    const { search, category, level, minPrice, maxPrice, page = 1, limit = 12 } = req.query;

    const query = { published: true };

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    if (level) {
      query.level = level;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [courses, total] = await Promise.all([
      Course.find(query)
        .populate('instructor', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Course.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: courses.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      courses,
    });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/courses/:id
// Public - includes lessons
const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email')
      .populate('lessons');

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.status(200).json({ success: true, course });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/courses
// Instructor/Admin only
const createCourse = async (req, res, next) => {
  try {
    const { title, description, thumbnail, category, level, price } = req.body;

    const course = await Course.create({
      title,
      description,
      thumbnail,
      category,
      level,
      price,
      instructor: req.user._id,
    });

    res.status(201).json({ success: true, course });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/courses/:id
// Instructor (own course) or Admin
const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Only the owning instructor or an admin can edit
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this course' });
    }

    const allowedFields = ['title', 'description', 'thumbnail', 'category', 'level', 'price', 'published'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) course[field] = req.body[field];
    });

    await course.save();

    res.status(200).json({ success: true, course });
  } catch (error) {
    next(error);
  }
};

// @route DELETE /api/courses/:id
// Instructor (own course) or Admin
const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this course' });
    }

    // Clean up related lessons and enrollments so we don't leave orphaned data
    await Lesson.deleteMany({ course: course._id });
    await Enrollment.deleteMany({ course: course._id });
    await course.deleteOne();

    res.status(200).json({ success: true, message: 'Course deleted' });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/courses/my-courses
// Instructor/Admin - courses they teach, enriched with enrollment counts for dashboard stats
const getMyCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ instructor: req.user._id }).sort({ createdAt: -1 });

    // Attach a live student count + estimated revenue per course (small N, fine to do in parallel)
    const enriched = await Promise.all(
      courses.map(async (course) => {
        const studentCount = await Enrollment.countDocuments({ course: course._id });
        return {
          ...course.toObject(),
          studentCount,
          revenue: studentCount * course.price,
        };
      })
    );

    res.status(200).json({ success: true, count: enriched.length, courses: enriched });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getMyCourses,
};
