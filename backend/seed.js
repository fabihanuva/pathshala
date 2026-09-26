// Seeds the database with sample users, courses, and lessons for development/testing.
// Run with: npm run seed
// WARNING: this clears existing Course/Lesson/Enrollment/User data. Don't run on production.

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Course = require('./models/Course');
const Lesson = require('./models/Lesson');
const Enrollment = require('./models/Enrollment');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    await Promise.all([
      User.deleteMany({}),
      Course.deleteMany({}),
      Lesson.deleteMany({}),
      Enrollment.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    // Users (password auto-hashed by the User model's pre-save hook)
    const instructor = await User.create({
      name: 'Jane Instructor',
      email: 'instructor@example.com',
      password: 'password123',
      role: 'instructor',
    });

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
    });

    const student = await User.create({
      name: 'Sam Student',
      email: 'student@example.com',
      password: 'password123',
      role: 'student',
    });

    console.log('Created users: instructor, admin, student (password: password123)');

    // Courses (thumbnail uses Picsum - real photographs served specifically for
    // dev/placeholder use, with a fixed seed so each course always gets the same image)
    const courseData = [
      { title: 'Introduction to JavaScript', category: 'Programming', level: 'Beginner', price: 0,
        description: 'Learn the fundamentals of JavaScript from scratch.',
        thumbnail: 'https://picsum.photos/seed/js-course/600/400' },
      { title: 'React for Beginners', category: 'Programming', level: 'Intermediate', price: 1500,
        description: 'Build modern web apps with React.',
        thumbnail: 'https://picsum.photos/seed/react-course/600/400' },
      { title: 'Advanced Node.js & APIs', category: 'Programming', level: 'Advanced', price: 2200,
        description: 'Design scalable REST APIs and backend architecture with Node.js.',
        thumbnail: 'https://picsum.photos/seed/node-course/600/400' },
      { title: 'UI/UX Design Basics', category: 'Design', level: 'Beginner', price: 1200,
        description: 'Learn the principles of good interface design.',
        thumbnail: 'https://picsum.photos/seed/design-course/600/400' },
      { title: 'Digital Marketing 101', category: 'Marketing', level: 'Intermediate', price: 800,
        description: 'Understand the core concepts of digital marketing.',
        thumbnail: 'https://picsum.photos/seed/marketing-course/600/400' },
      { title: 'Business Strategy Fundamentals', category: 'Business', level: 'Advanced', price: 1800,
        description: 'Learn how successful companies plan, compete, and grow.',
        thumbnail: 'https://picsum.photos/seed/business-course/600/400' },
    ];

    const courses = [];
    for (const data of courseData) {
      const course = await Course.create({ ...data, instructor: instructor._id });
      courses.push(course);
    }
    console.log(`Created ${courses.length} courses`);

    // Lessons for the first course
    const lessonTitles = [
      'Welcome & Setup',
      'Variables and Data Types',
      'Functions and Scope',
      'Working with Arrays',
    ];

    const lessons = [];
    for (let i = 0; i < lessonTitles.length; i++) {
      const lesson = await Lesson.create({
        course: courses[0]._id,
        title: lessonTitles[i],
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', // placeholder sample video
        duration: 10,
        order: i + 1,
      });
      lessons.push(lesson);
    }
    courses[0].lessons = lessons.map((l) => l._id);
    await courses[0].save();
    console.log(`Added ${lessons.length} lessons to "${courses[0].title}"`);

    // Enroll the sample student in the first course
    const progress = lessons.map((lesson, i) => ({
      lesson: lesson._id,
      completed: i === 0, // first lesson pre-marked complete for demo purposes
      completedAt: i === 0 ? new Date() : undefined,
    }));

    await Enrollment.create({
      student: student._id,
      course: courses[0]._id,
      progress,
      overallProgress: Math.round((1 / lessons.length) * 100),
    });

    await User.findByIdAndUpdate(student._id, { $addToSet: { enrolledCourses: courses[0]._id } });
    console.log(`Enrolled student in "${courses[0].title}"`);

    console.log('\nSeed complete! Test accounts (all use password: password123):');
    console.log('  Instructor: instructor@example.com');
    console.log('  Admin:      admin@example.com');
    console.log('  Student:    student@example.com');

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();
