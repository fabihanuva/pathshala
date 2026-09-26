const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    progress: [
      {
        lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
        completed: { type: Boolean, default: false },
        completedAt: { type: Date },
      },
    ],
    overallProgress: { type: Number, default: 0 }, // percentage
  },
  { timestamps: true }
);

enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
