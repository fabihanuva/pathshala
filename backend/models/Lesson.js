const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    videoUrl: { type: String, required: true },
    duration: { type: Number, default: 0 }, // in minutes
    order: { type: Number, default: 0 },
    resources: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lesson', lessonSchema);
